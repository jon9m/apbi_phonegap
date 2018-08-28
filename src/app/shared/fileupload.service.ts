import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { AppGlobal } from './app-global';


@Injectable()
export class FileUploadService {
    rootContext = AppGlobal.API_ENDPOINT;
    baseURL = this.rootContext + AppGlobal.FILE_UPLOAD_ACTION;

    constructor(private http: HttpClient) { }

    fileUpload(fileItem: File, filename: any, extraData?: object): any {
        let apiCreateEndpoint = this.baseURL;
        const formData: FormData = new FormData();

        formData.append('fileItem', fileItem, filename);
        formData.append('filename', filename);
        if (extraData) {
            for (let key in extraData) {
                // iterate and set other form data
                formData.append(key, extraData[key]);
            }
        }

        const req = new HttpRequest('POST', apiCreateEndpoint, formData, {
            reportProgress: true // for progress data
        });
        return this.http.request(req);
    }
}