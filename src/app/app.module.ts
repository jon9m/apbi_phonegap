import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular'

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InspectionDetailsService } from "./shared/inspection-detail.service";
import { HttpClientModule } from '@angular/common/http';
import { HTTPService } from "./shared/http.service";
import { CustomPreloadStrategy } from "./shared/customPreloadStrategy";
import { RouteReuseStrategy } from "@angular/router";
import { AppRouteReuseStrategy } from "./app.route.reuse.strategy";
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './shared/login.service';
import { UserdetailsComponent } from './views/userdetails/userdetails.component';
import { AuthGuard } from './shared/auth-guard.service';
import { AppServeiceLoadStatusService } from "./shared/app-service-load-status.service";
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { FileUploadProgressService } from "./shared/fileupload-progress.service";
import { FileUploadProgressNavComponentComponent } from './views/file-upload-progress-nav-component/file-upload-progress-nav-component.component';
import { LogoutComponent } from './views/logout/logout.component';
import { CalendarSearchComponent } from './views/mycalendar/calendar-search/calendar-search.component';
import { TabIndexComponent } from './views/inspection-dtl-form/tab-index/tab-index.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    Ng2ImgMaxModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    LoginComponent,
    RegisterComponent,
    UserdetailsComponent,
    FileUploadProgressNavComponentComponent,
    LogoutComponent,
    CalendarSearchComponent,
    TabIndexComponent
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: RouteReuseStrategy,
      useClass: AppRouteReuseStrategy
    },
    HTTPService,
    InspectionDetailsService,
    CustomPreloadStrategy,
    LoginService,
    AuthGuard,
    AppServeiceLoadStatusService,
    FileUploadProgressService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
