import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from "fullcalendar";

import * as moment from 'moment';
import { HTTPService } from "../../shared/http.service";
import { Subscription } from "rxjs/Subscription";
import { NavigationStart, Router } from '@angular/router';
import { AppServeiceLoadStatusService } from "../../shared/app-service-load-status.service";
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import { AppUtils } from '../../shared/app-utils';

@Component({
  selector: 'app-mycalendar',
  templateUrl: './mycalendar.component.html',
  styleUrls: ['./mycalendar.component.scss']
})
export class MycalendarComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  isCalendarLoading: boolean = false;
  isCalendarEventsListnerInit = false;
  isCalendarLoadedOnce = false;
  calendarSearchText: string = '';

  currClientEvents: any = [];

  mm;
  events: any = [];
  private eventSubscription: Subscription;
  private calendarSubscription: Subscription;
  private calendarDisplaySubscription: Subscription;
  private calendarSearchSubscription: Subscription;
  private previewSubscription: Subscription;
  private navStartObservable: Observable<NavigationStart>;
  private navStartSubscription: Subscription;

  constructor(private httpService: HTTPService, private appServeiceLoadStatusService: AppServeiceLoadStatusService, private router: Router) {
    this.navStartObservable = this.router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
    ) as Observable<NavigationStart>;
  }

  ngOnDestroy(): void {
    if (this.previewSubscription) { this.previewSubscription.unsubscribe(); }
    if (this.calendarSubscription) { this.calendarSubscription.unsubscribe(); }
    if (this.calendarDisplaySubscription) { this.calendarDisplaySubscription.unsubscribe(); }
    if (this.eventSubscription) { this.eventSubscription.unsubscribe(); }
    if (this.navStartSubscription) { this.navStartSubscription.unsubscribe(); }
    if (this.calendarSearchSubscription) { this.calendarSearchSubscription.unsubscribe(); }
    this.events = [];
  }

  ngOnInit() {
    if (!this.isCalendarLoadedOnce) {
      this.isCalendarLoadedOnce = true;
      this.appServeiceLoadStatusService.setCalendarDisplayStatus();
    }
    this.navStartSubscription = this.navStartObservable.subscribe(evt => {
      if ((evt.url) && (evt.url.indexOf('mycalendar') != -1)) {
        this.calendarSearchText = '';
        this.loadFullcalendarForEvents(this.calendarSearchText);

        this.isCalendarEventsListnerInit = false;
        this.appServeiceLoadStatusService.setCalendarDisplayStatus();
      } else {
        this.appServeiceLoadStatusService.clearCalendarDisplayStatus();
      }
    });

    this.calendarSearchSubscription = this.appServeiceLoadStatusService.calendarSearchSubject.subscribe(searchText => {
      this.loadFullcalendarForEvents(searchText);
    });
  }

  loadFullcalendarForEvents = (searchText) => {
    if (this.ucCalendar && this.ucCalendar.fullCalendar) {
      try {
        this.calendarSearchText = searchText;
        this.events = this.getCalendarEvents(this.calendarSearchText);
      } catch (e) {
        console.log(e);
      }
    }
  }

  getCalendarEvents = (filter: string) => {
    let events = new Array();
    if ((filter == null) || (filter.trim() == '')) {
      events = this.currClientEvents;
    } else {
      events = this.getEventsByFilter(filter);
    }
    return events;
  }

  getEventsByFilter(filter: string) {
    let filterevents = new Array();
    let allevents = this.currClientEvents;
    for (var j in allevents) {
      if ((allevents[j].title) && ((String)(allevents[j].title)).toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
        filterevents.push(allevents[j]);
      }
    }
    return filterevents;
  }

  ngAfterViewChecked() {
    this.reRenderFullCalendar();
  }

  reRenderFullCalendar = () => {
    if (!this.isCalendarEventsListnerInit) {
      if (this.ucCalendar && this.ucCalendar.fullCalendar) {
        try {
          this.ucCalendar.fullCalendar("rerenderEvents");
          this.isCalendarEventsListnerInit = true;
        } catch (e) {
          this.isCalendarEventsListnerInit = false;
          //console.log(e);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    var now = moment();
    let currMonth = (now.set('date', 1).add(-10, 'day')).format('YYYY-MM-DD');
    now = moment();
    let nextMonth = (now.set('date', 1).add(1, 'month').add(10, 'day')).format('YYYY-MM-DD');

    this.isCalendarLoading = true;
    this.calendarSearchText = '';

    this.eventSubscription = this.httpService.loadCalendar({ 'start': currMonth, 'end': nextMonth }).subscribe(
      (data) => {
        this.calendarOptions = {
          editable: true,
          eventLimit: false,
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
          },
          events: data
        };
        this.appServeiceLoadStatusService.setCalendarLoadStatus();
        this.isCalendarLoading = false;
        this.currClientEvents = JSON.parse(JSON.stringify(data));
      }, () => {
        this.appServeiceLoadStatusService.clearCalendarLoadStatus();
        this.isCalendarLoading = false;
      });

      AppUtils.breadcrumbWidthHandler(true, false);
  }

  clickButton() {
    var currView = this.ucCalendar.fullCalendar('getView');
    var currMonth = (currView.start).format('YYYY-MM-DD');
    var nextMonth = (currView.end).format('YYYY-MM-DD');

    //this.events = [];
    //this.currClientEvents = [];
    this.ucCalendar.fullCalendar("removeEvents");

    this.calendarSubscription = this.httpService.loadCalendar({ 'start': currMonth, 'end': nextMonth }).subscribe(
      (response: Response) => {
        this.appServeiceLoadStatusService.setCalendarLoadStatus();
        this.events = response;

        this.currClientEvents = JSON.parse(JSON.stringify(response));
        if (this.calendarSearchText && this.calendarSearchText.trim() !== '') {
          this.loadFullcalendarForEvents(this.calendarSearchText);
        }
      },
      () => {
        this.appServeiceLoadStatusService.clearCalendarLoadStatus();
      });
  }

  eventClick(evt) {
    let inspdtlpreviewcontent: HTMLElement = document.getElementById('inspectiondtlcontent') as HTMLElement;
    let element: HTMLElement = document.getElementById('modalbutton') as HTMLElement;
    let bookingidelement: HTMLInputElement = document.getElementById('previewbookingid') as HTMLInputElement;
    bookingidelement.value = evt.detail.event.id;
    inspdtlpreviewcontent.innerHTML = '<div class="p-3 alert alert-secondary">Loading...</div>';

    this.previewSubscription = this.httpService.getPreview(evt.detail.event.id).subscribe(
      (response) => {
        inspdtlpreviewcontent.innerHTML = response.toString();
      },
      () => {
        inspdtlpreviewcontent.innerHTML = '<div class="p-3 alert alert-danger m-1">Error during loading details!</div>';
      });

    element.click();
  }

  updateEvent() {

  }
}