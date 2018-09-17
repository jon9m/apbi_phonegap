import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InspectionDetailsService } from '../../../shared/inspection-detail.service';

@Component({
  selector: 'app-app-insp-dtl-form-remove-recomm',
  templateUrl: './app-insp-dtl-form-remove-recomm.component.html',
  styleUrls: ['./app-insp-dtl-form-remove-recomm.component.scss']
})
export class AppInspDtlFormRemoveRecommComponent implements OnInit {

  @ViewChild('removerecommclosebutton') closeButton: ElementRef;

  constructor(private inspectionDetailsService: InspectionDetailsService) { }

  ngOnInit() {
  }

  removeRecomms() {
    this.inspectionDetailsService.doRemoveQuickRecommSubject();
    this.closePopup();
  }

  keepRecomms() {
    this.inspectionDetailsService.doKeepQuickRecommSubject();
    this.closePopup();
  }

  closePopup() {
    let btnElem = this.closeButton.nativeElement as HTMLElement;
    btnElem.click();
  }
}
