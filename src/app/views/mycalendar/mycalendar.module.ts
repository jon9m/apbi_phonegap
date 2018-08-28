import { NgModule } from "@angular/core";
import { MycalendarComponent } from "./mycalendar.component";
import { MyCalendarRoutingModule } from "./mycalendar-routing.module";

import { FullCalendarModule } from 'ng-fullcalendar';
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap/modal";

import { InspectionDtlPopupComponent } from './inspection-dtl-popup/inspection-dtl-popup.component';

@NgModule({
    imports: [
        CommonModule,
        MyCalendarRoutingModule,
        FullCalendarModule,
        ModalModule.forRoot()
    ],
    declarations: [
        MycalendarComponent,
        InspectionDtlPopupComponent
    ]
})
export class MyCalendarModule {

}