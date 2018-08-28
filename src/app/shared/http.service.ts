import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppGlobal } from "./app-global";

@Injectable()
export class HTTPService {
    rootContext = AppGlobal.API_ENDPOINT;

    appStatusUrl = this.rootContext + AppGlobal.APP_STATUS_ACTION;
    calendarFeedUrl = this.rootContext + AppGlobal.CALENDAR_FEED_ACTION;
    inspDtlPreviewUrl = this.rootContext + AppGlobal.INSP_DTL_PREVIEW_ACTION;
    inspDtlFormUrl = this.rootContext + AppGlobal.LOAD_FORMDATA_ACTION;
    addReportUrl = this.rootContext + AppGlobal.ADD_REPORT_ACTION;
    loginURL = this.rootContext + AppGlobal.LOGIN_ACTION;


    httpOptions = {
        headers: new HttpHeaders({
            'Cache-Control': 'no-cache'
        })
    };

    constructor(private http: HttpClient) {

    }

    getAppStatus() {
        let currURL = this.appStatusUrl + "?time=" + new Date().getTime();
        return this.http.post(currURL, {}, { responseType: 'text' });
    }
    loadCalendar(postObj) {
        let currURL = this.calendarFeedUrl + "?time=" + new Date().getTime();
        return this.http.post(currURL, postObj);
    }

    getPreview(id) {
        let currURL = this.inspDtlPreviewUrl + "?id=" + id + "&time=" + new Date().getTime();
        return this.http.get(currURL, { responseType: 'text' });
    }

    loadInspectionDtlForm() {
        let currURL = this.inspDtlFormUrl + "?time=" + new Date().getTime();
        return this.http.get(currURL);
    }

    addReport(postObj) {
        let currURL = this.addReportUrl + "?time=" + new Date().getTime();
        return this.http.post(currURL, postObj, this.httpOptions);
    }

    login(postObj) {
        let currURL = this.loginURL + "?time=" + new Date().getTime();
        return this.http.post(currURL, { 'user': postObj['username'], 'pass': postObj['password'] }, this.httpOptions);
    }
}