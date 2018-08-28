import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { AppGlobal } from '../../shared/app-global';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HTTPService } from '../../shared/http.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../shared/login.response.model';
import { LoginService } from '../../shared/login.service';
import { AppUtils } from '../../shared/app-utils';
import { AppServeiceLoadStatusService } from '../../shared/app-service-load-status.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginError: string = "";
  loginform: FormGroup;
  loginResponse: LoginResponse;
  isSignningIn: boolean = false;

  constructor(private renderer: Renderer2, private fb: FormBuilder, private httpService: HTTPService, private router: Router, private loginService: LoginService, private appServeiceLoadStatusService :AppServeiceLoadStatusService) { }

  ngOnInit(): void {
    this.loginResponse = new LoginResponse();
    this.loginService.invalidateUser();

    this.loginform = this.fb.group({
      'username': '',
      'password': ''
    });
  }

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, 'header-fixed');
    this.renderer.removeClass(document.body, 'sidebar-lg-show');
    this.renderer.removeClass(document.body, 'sidebar-fixed');
  }

  onLogin() {
    this.isSignningIn = true;
    this.loginError = "";
    this.loginResponse.flag = true;

    AppUtils.resetClickEventInitializedState();
    this.appServeiceLoadStatusService.clearCalendarLoadStatus();

    this.httpService.login(this.loginform.value).subscribe(
      (response: Response) => {
        Object.assign(this.loginResponse, response);
        this.loginService.setLoginResponse(this.loginResponse);
        if (this.loginResponse.flag == true) {
          this.router.navigate(['/dashboard']);
        } else {
          this.loginError = this.loginResponse.message;
        }
        this.isSignningIn = false;
      },
      (error) => {
        this.isSignningIn = false;
        this.loginResponse.flag = false;
        this.loginError = error.message;
      }
    );
  }
}
