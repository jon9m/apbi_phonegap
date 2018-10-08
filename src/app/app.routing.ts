import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { CustomPreloadStrategy } from "./shared/customPreloadStrategy";
import { AuthGuard } from './shared/auth-guard.service';
import { LogoutComponent } from './views/logout/logout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: {
      title: 'Logout Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    // canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'mycalendar',
        loadChildren: './views/mycalendar/mycalendar.module#MyCalendarModule',
        data: { preload: true, key: "mycalendar" }
      },
      {
        path: 'inspectiondtlform/:id',
        loadChildren: './views/inspection-dtl-form/inspection-dtl-form.module#InspectionDtlFormModule',
        data: { preload: true, key: "inspectiondtlform" }
      },
      {
        path: 'inspectiondtlreloadform/:id',
        loadChildren: './views/inspection-dtl-form/inspection-dtl-form.module#InspectionDtlFormModule',
        data: { preload: true, key: "inspectiondtlform" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloadStrategy, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
