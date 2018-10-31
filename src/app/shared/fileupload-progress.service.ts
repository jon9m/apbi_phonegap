import { Injectable } from "@angular/core";
import { FileUploadInfo } from "./fileupload-info.model";

@Injectable()
export class FileUploadProgressService {
    public fileProgressMap = new Map<String, FileUploadInfo>();

    public addMapItem(key: string, name: string): FileUploadInfo {
        let currFileInfo = new FileUploadInfo(key, name);
        this.fileProgressMap.set(key, currFileInfo);
        return currFileInfo;
    }
    public removeMapItem(key: string) {
        this.fileProgressMap.delete(key);
    }
    public clearMap() {
        this.fileProgressMap.clear();
    }
    public updateProgress(key: string, progress: number, progressColor: string) {
        (this.fileProgressMap.get(key)).progress = progress;
        (this.fileProgressMap.get(key)).progressColor = progressColor;
    }
    public setResizeState(key: string, rstate: boolean) {
        (this.fileProgressMap.get(key)).isImageResizing = rstate;
    }
    public setUploadError(key: string, rstate: boolean, progressId: string) {
        (this.fileProgressMap.get(key)).isError = rstate;
        (this.fileProgressMap.get(key)).progressId = progressId;
        if(rstate == true){
            (this.fileProgressMap.get(key)).progress = 0;
        }
    }
    getKeys() {
        return Array.from(this.fileProgressMap.keys());
    }
    getValues() {
        return Array.from(this.fileProgressMap.values());
    }
}