import { Injectable, QueryList } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { TabIndexDirective } from "./TabIndexModule/tabItem.directive";

@Injectable()
export class AppServeiceLoadStatusService {
    constructor() {

    }

    //Calendar API service chcek
    public calendarLoadStatus: boolean = false;
    public calendarDisplayStatus: boolean = false;
    public inspDtlFormDisplayStatus: boolean = false;
    public tabIndexList: QueryList<TabIndexDirective>;

    public calendarDisplaySubject = new Subject<boolean>();
    public calendarSearchSubject = new Subject<string>();
    public inspDtlFormDisplaySubject = new Subject<boolean>();
    public tabIndexReloadSubject = new Subject<QueryList<TabIndexDirective>>();


    public clearCalendarLoadStatus() {
        this.calendarLoadStatus = false;
    }
    public setCalendarLoadStatus() {
        this.calendarLoadStatus = true;
    }
    public getCalendarLoadStatus() {
        return this.calendarLoadStatus;
    }

    public setCalendarDisplayStatus() {
        this.calendarDisplayStatus = true;
        this.calendarDisplaySubject.next(this.calendarDisplayStatus);
    }
    public clearCalendarDisplayStatus() {
        this.calendarDisplayStatus = false;
        this.calendarDisplaySubject.next(this.calendarDisplayStatus);
    }

    public setCalendarSearchText(searchText: string) {
        this.calendarSearchSubject.next(searchText);
    }

    public clearInspDtlFormLoadStatus() {
        this.inspDtlFormDisplayStatus = false;
        this.inspDtlFormDisplaySubject.next(this.inspDtlFormDisplayStatus);
    }
    public setInspDtlFormLoadStatus() {
        this.inspDtlFormDisplayStatus = true;
        this.inspDtlFormDisplaySubject.next(this.inspDtlFormDisplayStatus);
    }

    public setTabQueryList(tabs) {
        this.tabIndexList = tabs;
    }

    public updateTabQueryList(updatedIndex: QueryList<TabIndexDirective>) {
        this.tabIndexReloadSubject.next(updatedIndex);
    }
}