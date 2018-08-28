import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";
import { AppServeiceLoadStatusService } from "./shared/app-service-load-status.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AppRouteReuseStrategy extends RouteReuseStrategy {

    routesToCache: string[] = ["mycalendar"];
    storedRouteHandles = new Map<string, DetachedRouteHandle>();

    constructor(private appServeiceLoadStatusService: AppServeiceLoadStatusService) {
        super();
    }

    // Decides if the route should be stored
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return this.routesToCache.indexOf(route.data["key"]) > -1;
    }

    //Store the information for the route we're destructing
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        this.storedRouteHandles.set(route.data["key"], handle);
    }

    //Return true if we have a stored route object for the next route
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        if (!this.shouldAPIReload(route)) {
            return false;
        }
        return this.storedRouteHandles.has(route.data["key"]);
    }

    //If we returned true in shouldAttach(), now return the actual route data for restoration
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        return this.storedRouteHandles.get(route.data["key"]);
    }

    //Reuse the route if we're going to and from the same route
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    //Check for API reloaded
    private shouldAPIReload(route: ActivatedRouteSnapshot): boolean {
        if (this.appServeiceLoadStatusService.getCalendarLoadStatus() == false) {
            if ((route.data["key"] == 'mycalendar') && (this.storedRouteHandles.get(route.data["key"]) != null)) {
                this.storedRouteHandles.set(route.data["key"], null);
            }
            return false;
        }
        return true;
    }
}