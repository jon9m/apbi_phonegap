import { Component, OnInit } from '@angular/core';

declare var navigator: any;

@Component({
  selector: 'app-device-camera',
  templateUrl: './device-camera.component.html',
  styleUrls: ['./device-camera.component.scss']
})

export class DeviceCameraComponent implements OnInit {

  imageURL;
  private sub: any;

  constructor() { }

  ngOnInit() {
  }

  takePhoto() {
    alert("take photo" + navigator.camera);
    if (navigator != undefined) {
      navigator.camera.getPicture(
        (imageUri) => {
          alert(imageUri);
        },
        (error) => {
          alert("Unable to obtain picture: " + error);

        }, {
          quality: 50,
          allowEdit: true,
          correctOrientation: true
        }
      );
    }
  }

}
