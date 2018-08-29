import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray, AbstractControl } from "@angular/forms";
import { FileUploadService } from "../../shared/fileupload.service";
import { HttpEventType } from "@angular/common/http";
import { AppGlobal } from '../../shared/app-global';
import { Subscription } from "rxjs/Subscription";
import { FileUploadProgressService } from "../../shared/fileupload-progress.service";
import * as Compress from 'Compress.js';

declare var navigator: any;
declare var window: any;
declare var cordova :any;

@Component({
  selector: 'app-file-upload-component',
  templateUrl: './file-upload-component.component.html',
  styleUrls: ['./file-upload-component.component.scss']
})
export class FileUploadComponentComponent implements OnInit, OnDestroy {

  ngOnInit() {
    let file_name = (this.fileName) ? this.fileName : this.getFileName();
    this.imagePreview.nativeElement.src = AppGlobal.API_ENDPOINT + AppGlobal.IMG_PREVIEW_ACTION + "?src=" + file_name + "&reportId=" + this.reportId + "&" + new Date().getTime();
  }
  ngOnDestroy(): void {
    if (this.fileUploadSub) {
      this.fileUploadSub.unsubscribe();
    }
    if (this.resizeImageSub) {
      this.resizeImageSub.unsubscribe();
    }
  }

  @Input() index: any;
  @Input() recommendationType: any;
  @Input() fileName: any;
  @Input() reportId: any;
  @Input() progress: any;
  @Input() inspectiondetailsform: FormGroup;

  @ViewChild("imgPreview") imagePreview: ElementRef;

  @Output() uploadCompletedEmitter = new EventEmitter<string>();

  fileUploadSub: Subscription;
  resizeImageSub: Subscription;
  uploadingProgressing: boolean = false;
  uploadProgress: number = 0;
  uploadComplete: boolean = false;
  serverResponse: any;
  rgbString: string = '#20a8d8';
  file_name = "";

  currInputElemProgress: any;

  constructor(private fileUploadService: FileUploadService, private fileUploadProgressService: FileUploadProgressService) {

  }

  getFileName() {
    let file_name;
    let currFormArr = (<FormArray>(this.inspectiondetailsform.get(this.recommendationType)));
    if (currFormArr) {
      let currFrmGrp = (<FormGroup>(currFormArr.at(this.index)));
      if (currFrmGrp) {
        let fileNameCtrl = (<AbstractControl>currFrmGrp.controls['filename']);
        if (fileNameCtrl) {
          file_name = fileNameCtrl.value;
        }
      }
    }
    return file_name;
  }

  onFileChange(event) {
    this.uploadProgress = 0;

    if (this.fileName) {
      this.file_name = this.fileName;
    } else {
      this.file_name = this.getFileName();
    }

    let bookingId = this.inspectiondetailsform.get('bookingid').value;
    let submittedData = { 'index': this.index, 'type': this.recommendationType, 'bookingid': bookingId };
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let fileToUpload = event.target.files[0];

      console.log("fileToUpload " + JSON.stringify(fileToUpload));
      console.log("fileToUpload2 " + typeof fileToUpload);
      console.dir("fileToUpload3 " + fileToUpload);

      reader.readAsDataURL(fileToUpload);
      reader.onload = (event) => {
        let progressId = "#" + this.progress + "-" + this.index;
        let elem: any = (<HTMLImageElement>document.querySelector(progressId));
        if (elem) {
          elem.src = (<FileReader>event.target).result;
        }

        //For left nav - 1
        this.fileUploadProgressService.addMapItem(this.file_name, fileToUpload.name);
        this.fileUploadProgressService.setResizeState(this.file_name, true);


        const compress = new Compress();
        //console.log("compress " + compress);

        const files = [fileToUpload];
        compress.compress(files, {
          size: 4, // the max size in MB, defaults to 2MB
          quality: .75, // the quality of the image, max is 1,
          maxWidth: 800, // the max width of the output image, defaults to 1920px
          maxHeight: 1920, // the max height of the output image, defaults to 1920px
          resize: true, // defaults to true, set false if you do not want to resize the image width and height
        }).then((data) => {
          // returns an array of compressed images
          const img1 = data[0]
          const base64str = img1.data
          const imgExt = img1.ext
          const file = Compress.convertBase64ToFile(base64str, imgExt)
          this.uploadCurrentFile(file, submittedData);
        }).catch(err => {
          console.log('Image resizing failed, using original image', err);


          console.log(submittedData);

          this.uploadCurrentFile(fileToUpload, submittedData);
        });

        // this.ng2PicaService.resize([fileToUpload], AppGlobal.UPLOAD_IMG_WIDTH, AppGlobal.UPLOAD_IMG_HEIGHT, true).subscribe(
        //   (result) => {
        //     //For safari
        //     if (this.isSafari()) {
        //       var the_blob = new Blob([result]);
        //       this.uploadCurrentFile(the_blob, submittedData);
        //     } else {
        //       fileToUpload = new File([result], result.name);
        //       this.uploadCurrentFile(fileToUpload, submittedData);
        //     }
        //   },
        //   (error) => {
        //     this.uploadCurrentFile(fileToUpload, submittedData);
        //   }
        // );

        //file resizing
        // this.resizeImageSub = this.ng2ImgMax.resizeImage(fileToUpload, AppGlobal.UPLOAD_IMG_WIDTH, AppGlobal.UPLOAD_IMG_HEIGHT).subscribe(
        //   (result) => {
        //     //For safari
        //     if (this.isSafari()) {
        //       console.log("Image resizing successful for Browser " + window.navigator.userAgent);
        //       var the_blob = new Blob([result]);
        //       this.uploadCurrentFile(the_blob, submittedData);
        //     } else {
        //       fileToUpload = new File([result], result.name);
        //       console.log("Image resizing successful");
        //       this.uploadCurrentFile(fileToUpload, submittedData);
        //     }
        //   },
        //   (error) => {
        //     console.log('Image resizing failed, using original image', error);
        //     this.uploadCurrentFile(fileToUpload, submittedData);
        //   }
        // );
        //file resizing ends
      };
    }
  }

  isSafari() {
    if ("undefined" != typeof window.navigator && window.navigator.userAgent) {
      let name = window.navigator.userAgent.toLowerCase();
      if (name && name.includes('safari') &&
        !name.includes('chrome') &&
        !name.includes('firefox') &&
        !name.includes('msie') &&
        !name.includes('opera')) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  private uploadCurrentFile(fileToUpload, submittedData) {
    this.fileUploadProgressService.setResizeState(this.file_name, false);
    this.fileUploadProgressService.setUploadError(this.file_name, false);

    console.log(this.file_name);

    this.fileUploadSub = this.fileUploadService.fileUpload(fileToUpload, this.file_name, submittedData).subscribe(
      event => {
        this.handleProgress(event, this.index, this.recommendationType);
      },
      () => {
        this.fileUploadProgressService.setUploadError(this.file_name, true);
      });
  }

  handleProgress(event, index, recommendationType) {
    if (event.type === HttpEventType.Sent) {
      this.uploadProgress = 0;
      this.rgbString = '#FF0000';
    }

    if (event.type === HttpEventType.DownloadProgress) {
      this.uploadingProgressing = true
      this.uploadProgress = Math.round(100 * event.loaded / event.total);
    }

    if (event.type === HttpEventType.UploadProgress) {
      this.currInputElemProgress = recommendationType + "_progress_" + index;
      this.uploadingProgressing = true
      this.uploadProgress = Math.round(event.loaded / event.total * 100);

      this.setRgbString();

      //For left nav - 2
      this.fileUploadProgressService.updateProgress(this.file_name, this.uploadProgress, this.rgbString);
    }

    if (event.type === HttpEventType.Response) {
      this.uploadComplete = true
      this.serverResponse = event.body
      this.uploadProgress = 100;

      this.uploadCompletedEmitter.emit("true");
    }
  }

  resetAll(event) {
    this.uploadProgress = 0;
    event.target.value = '';
  }

  setRgbString() {
    let colorMul = 255 / 100;
    //#20a8d8 - 32, 168 , 216
    let maxG = 168;
    let maxGMul = maxG / 100;
    let maxB = 216;
    let maxBMul = maxB / 100;
    let minR = 32;
    let minRMul = minR / 100;

    let hexR = Math.round(colorMul * (100 - this.uploadProgress) + ((this.uploadProgress > 68) ? this.uploadProgress * minRMul : 0));

    let hexG = 0;
    if (this.uploadProgress > 66) { //Math.round((168/255)*100)
      hexG = Math.round(maxGMul * this.uploadProgress);
    }

    let hexB = 0;
    if (this.uploadProgress > 85) { //Math.round((216/255)*100)
      hexB = Math.round(maxBMul * (this.uploadProgress));
    }

    let strR = hexR.toString(16);
    let strG = hexG.toString(16);
    let strB = hexB.toString(16);

    if (strG.length == 1) {
      strG = strG + "0";
    }
    if (strB.length == 1) {
      strB = strB + "0";
    }

    this.rgbString = "#" + strR + strG + strB;
  }

  // Camera ------------------------------------------------------------------

  setOptions = () => {
    var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: navigator.camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
      encodingType: navigator.camera.EncodingType.JPEG,
      mediaType: navigator.camera.MediaType.PICTURE,
      allowEdit: false,
      correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
  }

  takePhoto(){
    var options = {
      limit: 1
   };
   navigator.device.capture.captureImage(onSuccess, onError, options);

   function onSuccess(mediaFiles) {
      var i, path, len;
      for (i = 0, len = mediaFiles.length; i < len; i += 1) {
         path = mediaFiles[i].fullPath;
         console.log(mediaFiles);
      }
   }

   function onError(error) {
      navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
   }
  }

  // takePhoto() {

  //   if (navigator.camera) {
  //     var options = this.setOptions();
  //     navigator.camera.getPicture(this.onPhotoDataSuccess, this.onFail, options);
  //   }
  // }
  // onFail = (message) => {
  //   alert('Failed because: ' + message);
  // }

  // onPhotoDataSuccess = (imageUri) => {
  //   let eventObj = {
  //     target: {
  //       files: []
  //     }
  //   }
  //   console.log("imageUri " + JSON.stringify(imageUri));

  //   eventObj.target.files[0] = (imageUri);
  //   this.onFileChange(eventObj);

  //   // window.resolveLocalFileSystemURL(imageUri, (entry) => {
  //   //   entry.file((file) => {
  //   //     eventObj.target.files[0] = (file);
  //   //     this.onFileChange(eventObj);
  //   //   },
  //   //     (err) => console.log(err)
  //   //   );
  //   // });

  //   // let progressId = "#" + this.progress + "-" + this.index;
  //   // let elem: any = (<HTMLImageElement>document.querySelector(progressId));
  //   // if (elem) {
  //   //   elem.src = imageUri;
  //   // }
  // }
}