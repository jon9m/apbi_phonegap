import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { InspectionDetailsService } from '../../../shared/inspection-detail.service';
import { Router } from "@angular/router";
import { HTTPService } from '../../../shared/http.service';

@Component({
  selector: 'app-insp-dtl-form-save-popup',
  templateUrl: './insp-dtl-form-save-popup.component.html',
  styleUrls: ['./insp-dtl-form-save-popup.component.scss']
})
export class InspDtlFormSavePopupComponent implements OnInit, OnDestroy {

  @ViewChild('forcesaveclosebutton') closeButton: ElementRef;
  public largeModal;
  isFormLoading: boolean = false;


  constructor(private httpSevice: HTTPService, private inspectionDetailsService: InspectionDetailsService, private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  saveForm() {
    // console.log("Save form");
    this.inspectionDetailsService.setInspectionDetailsSetForceSave();
    this.closePopup();
  }

  reloadForm() {
    // console.log("Reload form");
    this.loadForm();
  }

  loadForm() {
    this.isFormLoading = true;
    this.httpSevice.loadInspectionDtlForm().subscribe(
      (response: Response) => {
        this.inspectionDetailsService.populateInspectionDetailsModel(response);

        let bookingidelement: HTMLInputElement = document.getElementById('bookingid') as HTMLInputElement;
        let bookingId = bookingidelement.value;
        this.isFormLoading = false;
        this.closePopup();

        if (this.router.url.indexOf('inspectiondtlreloadform') >= 0) {
          this.router.navigate(['/inspectiondtlform', bookingId]);
        } else {
          this.router.navigate(['/inspectiondtlreloadform', bookingId]);
        }
      },
      () => {
        this.isFormLoading = false;
      }
    );
  }

  closePopup() {
    let btnElem = this.closeButton.nativeElement as HTMLElement;
    btnElem.click();
  }
}
