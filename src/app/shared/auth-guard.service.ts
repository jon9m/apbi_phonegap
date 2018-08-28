import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from "@angular/router";
import { Injectable } from "@angular/core";
import { LoginService } from "./login.service";

@Injectable()
export class AuthGuard implements CanActivateChild {

    constructor(private loginService: LoginService, private router: Router) { }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.loginService.isAuthenticated()) {
            return true;
        } else {
            this.router.navigate(['/login']);
        }
        return false;
    }
}