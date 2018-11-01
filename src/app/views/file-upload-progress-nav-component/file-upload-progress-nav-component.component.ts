import { Component, OnInit } from '@angular/core';
import { AppUtils } from '../../shared/app-utils';
import { FileUploadProgressService } from '../../shared/fileupload-progress.service';

@Component({
  selector: 'app-file-upload-progress-nav-component',
  templateUrl: './file-upload-progress-nav-component.component.html',
  styleUrls: ['./file-upload-progress-nav-component.component.scss'],
  host: {
    'class': 'fileuploadstats'
  }
})
export class FileUploadProgressNavComponentComponent implements OnInit {

  constructor(public fileUploadProgressService: FileUploadProgressService) { }

  ngOnInit() {
  }

  getDisplayed() {
    return AppUtils.isDisplayed;
  }

  scrollToPosition(progressId, event) {
    var liEls: NodeListOf<HTMLElement> = document.querySelectorAll('.progressnavli');
    for (let i = liEls.length - 1; i >= 0; i--) {
      if ((liEls[i]) && liEls[i].classList.contains('progressnavliselected')) {
        liEls[i].classList.remove('progressnavliselected')
      }
    }
    if ((event.target) && (event.target.parentNode) && (event.target.parentNode.classList) && (event.target.parentNode.classList.contains('progressnavli'))) {
      event.target.parentNode.classList.add('progressnavliselected');
    }

    var destElem = <HTMLElement>document.querySelector(progressId);
    var posSrc = AppUtils.findPos(destElem);

    window.scroll({
      left: 0,
      behavior: "auto",
      top: +posSrc - 100
    });
  }
}