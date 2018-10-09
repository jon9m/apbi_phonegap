import { Injectable } from "@angular/core";
import { LoginResponse } from "./login.response.model";
import { Router } from "@angular/router";
import { InspectionDetailsService } from "./inspection-detail.service";

@Injectable()
export class LoginService {

    token: string;
    private loginResponse: LoginResponse;
    public isAdmin: boolean;

    constructor(private router: Router, private inspectionDetailsService: InspectionDetailsService) {

    }

    setLoginResponse(loginResp: LoginResponse) {
        this.loginResponse = loginResp;
        this.isAdmin = this.loginResponse.role.includes('Admin');
        this.inspectionDetailsService.setAdminMode(this.isAdmin);

        // console.log("Is Admin " + this.isAdmin);
    }

    getLoginResponse() {
        return this.loginResponse;
    }

    isAuthenticated() {
        // return true;
        return (this.loginResponse && this.loginResponse.flag != false) && (this.loginResponse.userId != -1);
    }

    invalidateUser() {
        if (this.loginResponse) {
            this.loginResponse.flag = false;
            this.loginResponse.userId = -1;
            this.loginResponse.name = '';
            this.loginResponse.role = '';
            this.loginResponse.message = '';
        }
    }

    logout() {
        if (this.loginResponse) {
            this.loginResponse.flag = false;
            this.loginResponse.userId = -1;
        }

        this.router.navigate(['/login']);
    }
}