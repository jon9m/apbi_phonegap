import { Component, OnInit } from '@angular/core';
import { AppServeiceLoadStatusService } from '../../../shared/app-service-load-status.service';

@Component({
  selector: 'app-calendar-search',
  templateUrl: './calendar-search.component.html',
  styleUrls: ['./calendar-search.component.scss']
})
export class CalendarSearchComponent implements OnInit {

  constructor(private appServeiceLoadStatusService: AppServeiceLoadStatusService) { }

  ngOnInit() {
  }

  changeCalenderSearchText(event) {
    this.appServeiceLoadStatusService.setCalendarSearchText(event.target.value);
  }
}