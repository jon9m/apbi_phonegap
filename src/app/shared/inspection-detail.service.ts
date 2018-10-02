import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { InspectionDetails } from "./inspection_details.model";
import { InspectionProperty } from './inspection-property.model';

@Injectable()
export class InspectionDetailsService {

    private inspectionProperty: InspectionProperty;
    private inspectionDetails: InspectionDetails;
    public formVersionForceSaveSubject = new Subject<{ isSaveExit: boolean, isQuickSave: boolean }>();
    public formCompleteSubject = new Subject<{ isComplete: boolean, onLoading: boolean }>();
    public adminCompleteSubject = new Subject<{ isComplete: boolean }>();
    public removeQuickRecommSubject = new Subject<{ doRemove: boolean }>();

    private isSaveAndExit: boolean;
    private isQuickSave: boolean;
    private adminMode: boolean;
    private adminCompleted: boolean;

    constructor() {
        this.isSaveAndExit = false;
        this.isQuickSave = false;
        this.adminCompleted = false;
        this.adminMode = false;

        this.inspectionProperty = new InspectionProperty();
        this.inspectionDetails = new InspectionDetails();
    }

    populateInspectionDetailsModel(responseJSON) {
        let inspectionDetailsJson = responseJSON;

        this.inspectionProperty.inspectionType = responseJSON.inspectionType;
        this.inspectionProperty.propertyAddress = responseJSON.propertyAddress;
        this.inspectionProperty.reportId = responseJSON.reportId;
        this.inspectionProperty.inspectionId = responseJSON.inspectionId;
        this.inspectionProperty.editMode = responseJSON.editmode;

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

    public setFormComplete(onLoading: boolean) {
        this.formCompleteSubject.next({ isComplete: true, onLoading: onLoading });
    }

    public unsetFormComplete(onLoading: boolean) {
        this.formCompleteSubject.next({ isComplete: false, onLoading: onLoading });
    }

    public doRemoveQuickRecommSubject() {
        this.removeQuickRecommSubject.next({ doRemove: true });
    }

    public doKeepQuickRecommSubject() {
        this.removeQuickRecommSubject.next({ doRemove: false });
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

    public setAdminCompleted(state) {
        this.adminCompleteSubject.next({ isComplete: state });
        this.adminCompleted = state;
    }

    public getAdminCompleted() {
        return this.adminCompleted;
    }

    public setAdminMode(state) {
        this.adminMode = state;
    }

    public getAdminMode() {
        return this.adminMode;
    }
}