import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { InspectionDetails } from "./inspection_details.model";
import { InspectionProperty } from './inspection-property.model';

@Injectable()
export class InspectionDetailsService {

    private inspectionProperty: InspectionProperty;
    private inspectionDetails: InspectionDetails;
    public formVersionForceSaveSubject = new Subject<{ isSaveExit: boolean, isQuickSave: boolean }>();

    private isSaveAndExit: boolean;
    private isQuickSave: boolean;

    constructor() {
        this.isSaveAndExit = false;
        this.isQuickSave = false;

        this.inspectionProperty = new InspectionProperty();
        this.inspectionDetails = new InspectionDetails();
    }

    populateInspectionDetailsModel(responseJSON) {
        let inspectionDetailsJson = responseJSON;

        this.inspectionProperty.inspectionType = responseJSON.inspectionType;
        this.inspectionProperty.propertyAddress = responseJSON.propertyAddress;
        this.inspectionProperty.reportId = responseJSON.reportId;
        this.inspectionProperty.inspectionId = responseJSON.inspectionId;

        //Reset the form
        this.inspectionDetails = new InspectionDetails();

        //Assign all values to the modal
        Object.assign(this.inspectionDetails, inspectionDetailsJson);
    }

    getInspectionDetailsModal() {
        return this.inspectionDetails;
    }

    getInspectionPropertyModal() {
        return this.inspectionProperty;
    }

    public setInspectionDetailsSetForceSave() {
        this.formVersionForceSaveSubject.next({ isSaveExit: this.isSaveAndExit, isQuickSave: this.isQuickSave });
    }

    public getSaveAndExit() {
        return this.isSaveAndExit;
    }

    public getQuickSave() {
        return this.isQuickSave;
    }

    public setSaveTypes(isSaveExit, isQuickSave) {
        this.isSaveAndExit = isSaveExit;
        this.isQuickSave = isQuickSave;
    }
}