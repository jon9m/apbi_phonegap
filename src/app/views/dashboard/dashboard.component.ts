import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppUtils } from '../../shared/app-utils';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    AppUtils.breadcrumbWidthHandler(true, false);
  }
}
