import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable()
export class RefreshGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.isPageRefresh()) {
            this.router.navigate(["/dashboard"]);
            return false;
        }
        return true;
    }

    private isPageRefresh() {
        return !this.router.navigated;
    }
}