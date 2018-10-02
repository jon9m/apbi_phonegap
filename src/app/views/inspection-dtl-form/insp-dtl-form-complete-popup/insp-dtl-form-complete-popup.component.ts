import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { InspectionDetailsService } from '../../../shared/inspection-detail.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-insp-dtl-form-complete-popup',
  templateUrl: './insp-dtl-form-complete-popup.component.html',
  styleUrls: ['./insp-dtl-form-complete-popup.component.scss']
})
export class InspDtlFormCompletePopupComponent implements AfterViewInit, OnDestroy {

  @ViewChild('completereportclosebutton') closeButton: ElementRef;

  constructor(private inspectionDetailsService: InspectionDetailsService) { }

  adminMode: boolean = false;
  adminCompleted: boolean = false;
  private adminCompleteSubscription: Subscription;

  ngAfterViewInit(): void {
    this.adminCompleteSubscription = this.inspectionDetailsService.adminCompleteSubject.subscribe(status => {
      this.adminCompleted = status.isComplete;
      console.log(this.adminMode, this.adminCompleted);
    });
    this.adminMode = this.inspectionDetailsService.getAdminMode();
  }

  ngOnDestroy(): void {
    if (this.adminCompleteSubscription != null) {
      this.adminCompleteSubscription.unsubscribe();
    }
  }

  closePopup() {
    let btnElem = this.closeButton.nativeElement as HTMLElement;
    btnElem.click();
  }

  completeForm() {
    this.inspectionDetailsService.setFormComplete(false);
    if (this.adminMode) {
      this.inspectionDetailsService.setAdminCompleted(true);
    }
    this.closePopup();
  }

  enableEditForm() {
    this.inspectionDetailsService.unsetFormComplete(false);
    this.inspectionDetailsService.setAdminCompleted(false);
    this.closePopup();
  }
}
