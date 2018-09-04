import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InspectionDetailsService } from '../../../shared/inspection-detail.service';

@Component({
  selector: 'app-insp-dtl-form-complete-popup',
  templateUrl: './insp-dtl-form-complete-popup.component.html',
  styleUrls: ['./insp-dtl-form-complete-popup.component.scss']
})
export class InspDtlFormCompletePopupComponent implements OnInit {

  @ViewChild('completereportclosebutton') closeButton: ElementRef;

  constructor(private inspectionDetailsService: InspectionDetailsService) { }

  ngOnInit() {
  }

  closePopup() {
    let btnElem = this.closeButton.nativeElement as HTMLElement;
    btnElem.click();
  }

  completeForm() {
    this.inspectionDetailsService.setFormComplete();
    this.closePopup();
  }
}
