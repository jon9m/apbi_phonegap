import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { AppServeiceLoadStatusService } from '../../../shared/app-service-load-status.service';
import { Subscription } from 'rxjs/Subscription';
import { TabIndexDirective } from '../../../shared/TabIndexModule/tabItem.directive';

@Component({
  selector: 'app-tab-index',
  templateUrl: './tab-index.component.html',
  styleUrls: ['./tab-index.component.scss'],
  host: {
    'class': 'indextab'
  }
})
export class TabIndexComponent implements AfterViewInit, OnDestroy {

  public currTabs: TabIndexDirective[];
  tabIndexReloadSubscription: Subscription;

  constructor(private appServeiceLoadStatusService: AppServeiceLoadStatusService) {
  }

  ngAfterViewInit(): void {
    if (this.appServeiceLoadStatusService.tabIndexList) {
      this.currTabs = this.appServeiceLoadStatusService.tabIndexList.toArray();
    }

    this.tabIndexReloadSubscription = this.appServeiceLoadStatusService.tabIndexReloadSubject.subscribe((updatedIndex) => {
      if (updatedIndex) {
        this.currTabs = updatedIndex.toArray();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.tabIndexReloadSubscription != null) {
      this.tabIndexReloadSubscription.unsubscribe();
    }
  }

  onSelectTab(event) {
    let currtabElem = this.currTabs[event.target.value];
    if (!currtabElem) {
      return;
    }
    // let pos = this.findPos(document.querySelector('#file-01'));
    let pos = this.findPos(currtabElem.elem.nativeElement);

    window.scroll({
      left: 0,
      behavior: "auto",  //smooth
      top: +pos
    });
  }

  findPos(obj) {
    var curtop = -100;
    if (obj && obj.offsetParent) {
      do {
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return [curtop];
    }
  }
}
