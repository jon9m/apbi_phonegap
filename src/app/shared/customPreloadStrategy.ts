import { Route, PreloadingStrategy } from "@angular/router";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

export class CustomPreloadStrategy implements PreloadingStrategy {
    preloadedModules: string[] = [];

    preload(route: Route, load: () => Observable<any>): Observable<any> {
        if (route.data && route.data['preload']) {
            // add the route path to the preloaded module array
            this.preloadedModules.push(route.path);
            return load();
        } else {
            return Observable.of(null);
        }
    }
}