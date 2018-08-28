import { Component, Input, OnInit, ViewChild, ElementRef, OnDestroy, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { navItems } from './../../_nav';
import { HTTPService } from "../../shared/http.service";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import 'rxjs/add/operator/takeWhile';
import { Subscription } from "rxjs/Subscription";
import { AppServeiceLoadStatusService } from "../../shared/app-service-load-status.service";
import { FileUploadProgressService } from "../../shared/fileupload-progress.service";
import { AppUtils } from '../../shared/app-utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('serverStatusElem') serverStatusElem: ElementRef;

  private alive: boolean;
  private interval: number;

  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  public calendarDisplaying = false;
  public inspDtlDisplaying = false;

  constructor(private httpService: HTTPService, private renderer: Renderer2, private appServeiceLoadStatusService: AppServeiceLoadStatusService, public fileUploadProgressService: FileUploadProgressService) {
    this.alive = true;
    this.interval = 5000;

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized')
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }

  private subscription: Subscription;
  private calDisplaySubscription: Subscription;
  private inspDtlFormDisplaySubscription: Subscription;

  ngOnInit() {
    let statusElem = this.serverStatusElem.nativeElement;
    let timer = TimerObservable.create(0, this.interval);
    timer.takeWhile(() => this.alive).subscribe(() => {
      this.subscription = this.httpService.getAppStatus().subscribe(
        (response) => {
          this.renderer.removeClass(statusElem, 'alert-danger');
          this.renderer.addClass(statusElem, 'alert-success');
          statusElem.textContent = "Successful connection to the server!";
        },
        (error) => {
          this.appServeiceLoadStatusService.clearCalendarLoadStatus();
          this.renderer.removeClass(statusElem, 'alert-success');
          this.renderer.addClass(statusElem, 'alert-danger');
          statusElem.textContent = "Unable to connect to the server! please check your network connection.";
        });
    });

    this.calDisplaySubscription = this.appServeiceLoadStatusService.calendarDisplaySubject.subscribe((status: boolean) => {
      this.calendarDisplaying = status;
    });

    this.inspDtlFormDisplaySubscription = this.appServeiceLoadStatusService.inspDtlFormDisplaySubject.subscribe((status: boolean) => {
      this.inspDtlDisplaying = status;
    });
  }

  ngAfterViewInit(): void {
    try {
      let appsidemenutoggler = document.querySelectorAll('[appasidemenutoggler]');
      if ((appsidemenutoggler) && (appsidemenutoggler.length > 0)) {
        (<HTMLElement>appsidemenutoggler[0]).style.display = 'none';
      }
    } catch (e) {
    }

    AppUtils.breadcrumbWidthHandler(true, false);
    // AppUtils.sidebarMinimizerHandler(this.isDisplayed);
  }

  ngOnDestroy() {
    this.alive = false; // switches your TimerObservable off
    this.subscription.unsubscribe();
    if (this.calDisplaySubscription) {
      this.calDisplaySubscription.unsubscribe();
    }
    if (this.inspDtlFormDisplaySubscription) {
      this.inspDtlFormDisplaySubscription.unsubscribe();
    }
  }
}
