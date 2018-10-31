export class FileUploadInfo {
    public progress: number;
    public progressColor: string;
    public isImageResizing: boolean;
    public isError: boolean = false;
    public progressId: string = '';

    constructor(public fileId: string, public realName: string) {
        this.realName = realName;
        this.progress = 0;
    }
}