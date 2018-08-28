import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { MycalendarComponent } from "./mycalendar.component";

const routes: Routes = [
    {
        path: '',
        component: MycalendarComponent,
        data: {
            title: 'My Calendar'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyCalendarRoutingModule { }
