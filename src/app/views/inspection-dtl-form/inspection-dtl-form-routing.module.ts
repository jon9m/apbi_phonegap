import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InspectionDtlFormComponent } from "./inspection-dtl-form.component";
import { RefreshGuard } from "./refresh-guard.service";

const routes: Routes = [
  {
    path: '', component: InspectionDtlFormComponent, canActivate: [RefreshGuard],
    data: {
      title: 'Building & Pest Inspection'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionDetailsFormRoutingModule { }