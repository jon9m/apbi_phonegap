import { Component, OnInit, OnDestroy, ViewChildren, QueryList, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from "@angular/forms";
import { InspectionDetailsService } from "../../shared/inspection-detail.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HTTPService } from "../../shared/http.service";
import { InspectionDetails } from "../../shared/inspection_details.model";
import { AppGlobal } from '../../shared/app-global';
import { InspectionProperty } from '../../shared/inspection-property.model';
import { Subscription } from 'rxjs';
import { FileUploadProgressService } from "../../shared/fileupload-progress.service";
import { AppServeiceLoadStatusService } from '../../shared/app-service-load-status.service';
import { TabIndexDirective } from '../../shared/TabIndexModule/tabItem.directive';
import { AppUtils } from '../../shared/app-utils';

@Component({
  selector: 'app-inspection-dtl-form',
  templateUrl: './inspection-dtl-form.component.html',
  styleUrls: ['./inspection-dtl-form.component.scss']
})

/***** keys
'hallways_recommendations_list'
'kitchen_recommendations_list'
'laundry_recommendations_list'
'bedrooms_recommendations_list'
'bathrooms_recommendations_list'
'ensuite_recommendations_list'
'external_recommendations_list'
'timberpest_recommendations_list'
'internal_recommendations_list'
'framestage_slab_recommendations_list'
'walls_beams_recommendations_list'
'roof_recommendations_list'
'lockup_recommendations_list'
'lockup_recommendations_internal_list'
'new_slab_recommendations_list'
 */

export class InspectionDtlFormComponent implements OnInit, OnDestroy, AfterViewInit {

  inspectionProperty: InspectionProperty;
  inspectiondetails: InspectionDetails;
  inspectiondetailsform: FormGroup;

  private sub: any;
  private id: number;

  timberPest: string[] = [];
  hallways: string[] = [];
  kitchen: string[] = [];
  laundry: string[] = [];
  bedrooms: string[] = [];
  bathrooms: string[] = [];
  internal: string[] = [];
  ensuite: string[] = [];
  external: string[] = [];
  internal_delap: string[] = [];
  frameStage_subfloor_slab: string[] = [];
  frameStage_walls_beams: string[] = [];
  frameStage_roof: string[] = [];
  lockup_external: string[] = [];
  lockup_internal: string[] = [];
  pre_slab: string[] = [];
  pre_slab_services: string[] = [];

  formSaving: boolean = false;
  formSaveMsg: string = '';
  formSaveMsgType: string = 'success';
  isFormSaveErr: boolean = false;
  isFormQuickSave: boolean = false;

  reportId: string;
  reportType: number;
  isFormDirty: boolean = false;
  valueChangeCheckSub: Subscription;
  addReportSub: Subscription;

  private formVersionSubscription: Subscription;
  private formCompleteSubscription: Subscription;
  private removeQuickRecommSubscription: Subscription;

  insp_type_pre_purchase_building_inspection;
  insp_type_pre_sale_building_inspection;
  insp_type_pre_auction_building_inspection;
  insp_type_asbestos_inspection;
  insp_type_pest_and_termite_inspection;
  insp_type_building_and_pest_inspection;
  insp_type_dilapidation_inspection;
  insp_type_owner_buildin_inspection_137b;
  insp_type_new_building_inspection_slab_stage;
  insp_type_new_building_inspection_frame_stage;
  insp_type_new_building_inspection_lockup_stage;
  insp_type_new_building_inspection_completion_stage;
  insp_type_new_building_inspection_4_stages_package;

  recommQuickAddMode: boolean = false;
  recommQuickAddCurrentCheckItem: { id: '', recType: '', recommType_short: '', recDetails: '', recommType: '', typee: '', recommId: '' };

  popupOverlay: boolean = false;
  isAdmin: boolean = false;
  adminCompleted: boolean = false;

  @ViewChildren(TabIndexDirective) tabs: QueryList<TabIndexDirective>;

  ngAfterViewInit(): void {
    this.appServeiceLoadStatusService.setTabQueryList(this.tabs);
    AppUtils.breadcrumbWidthHandler(true, false);

    let isFormCompleted = false;
    let completed = this.inspectiondetails.completed;
    if (completed && completed === 'completed') {
      isFormCompleted = true;
    }

    if (this.inspectionDetailsService.getAdminMode() === true) {
      this.isAdmin = true;

      if (isFormCompleted) {
        this.inspectionDetailsService.setAdminCompleted(true);
        this.adminCompleted = true;
      } else {
        this.inspectionDetailsService.setAdminCompleted(false);
      }
    } else {
      this.isAdmin = false;
      this.adminCompleted = false;
      this.inspectionDetailsService.setAdminCompleted(false);

      if (isFormCompleted) {
        this.inspectionDetailsService.setFormComplete(true);
      } else {
        this.inspectionDetailsService.unsetFormComplete(true);
      }
    }
  }

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private inspectionDetailsService: InspectionDetailsService,
    private router: Router, private httpService: HTTPService,
    private fileUploadProgressService: FileUploadProgressService,
    private appServeiceLoadStatusService: AppServeiceLoadStatusService) {

  }

  ngOnInit() {
    this.timberPest = AppGlobal.TimberPest;
    this.hallways = AppGlobal.Hallways;
    this.kitchen = AppGlobal.Kitchen;
    this.laundry = AppGlobal.Laundry;
    this.bedrooms = AppGlobal.Bedrooms;
    this.bathrooms = AppGlobal.Bathrooms;
    this.internal = AppGlobal.Internal;
    this.ensuite = AppGlobal.Ensuite;
    this.external = AppGlobal.External;
    this.internal_delap = AppGlobal.Internal_delap;
    this.frameStage_subfloor_slab = AppGlobal.FrameStage_subfloor_slab;
    this.frameStage_walls_beams = AppGlobal.FrameStage_walls_beams;
    this.frameStage_roof = AppGlobal.FrameStage_roof;
    this.lockup_external = AppGlobal.Lockup_external;
    this.lockup_internal = AppGlobal.Lockup_internal;
    this.pre_slab = AppGlobal.Pre_slab;
    this.pre_slab_services = AppGlobal.Pre_slab_services;

    this.insp_type_pre_purchase_building_inspection = AppGlobal.INSP_TYPE_PRE_PURCHASE_BUILDING_INSPECTION;
    this.insp_type_pre_sale_building_inspection = AppGlobal.INSP_TYPE_PRE_SALE_BUILDING_INSPECTION;
    this.insp_type_pre_auction_building_inspection = AppGlobal.INSP_TYPE_PRE_AUCTION_BUILDING_INSPECTION;
    this.insp_type_asbestos_inspection = AppGlobal.INSP_TYPE_ASBESTOS_INSPECTION;
    this.insp_type_pest_and_termite_inspection = AppGlobal.INSP_TYPE_PEST_AND_TERMITE_INSPECTION;
    this.insp_type_building_and_pest_inspection = AppGlobal.INSP_TYPE_BUILDING_AND_PEST_INSPECTION;
    this.insp_type_dilapidation_inspection = AppGlobal.INSP_TYPE_DILAPIDATION_INSPECTION;
    this.insp_type_owner_buildin_inspection_137b = AppGlobal.INSP_TYPE_OWNER_BUILDIN_INSPECTION_137B;
    this.insp_type_new_building_inspection_slab_stage = AppGlobal.INSP_TYPE_NEW_BUILDING_INSPECTION_SLAB_STAGE;
    this.insp_type_new_building_inspection_frame_stage = AppGlobal.INSP_TYPE_NEW_BUILDING_INSPECTION_FRAME_STAGE;
    this.insp_type_new_building_inspection_lockup_stage = AppGlobal.INSP_TYPE_NEW_BUILDING_INSPECTION_LOCKUP_STAGE;
    this.insp_type_new_building_inspection_completion_stage = AppGlobal.INSP_TYPE_NEW_BUILDING_INSPECTION_COMPLETION_STAGE;
    this.insp_type_new_building_inspection_4_stages_package = AppGlobal.INSP_TYPE_NEW_BUILDING_INSPECTION_4_STAGES_PACKAGE;

    this.formVersionSubscription = this.inspectionDetailsService.formVersionForceSaveSubject.subscribe(status => {
      this.onSave(status.isSaveExit, status.isQuickSave);
    });

    this.formCompleteSubscription = this.inspectionDetailsService.formCompleteSubject.subscribe(status => {
      let strStatus = status.isComplete ? "true" : "false";
      this.formComplete(strStatus, status.onLoading);
    });

    this.removeQuickRecommSubscription = this.inspectionDetailsService.removeQuickRecommSubject.subscribe(status => {
      if (status.doRemove === true) {
        this.removeRecommsFromCurrentList();
      } else {
        this.keepRecommsFromCurrentList();
      }
    });

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number

      this.inspectiondetails = this.inspectionDetailsService.getInspectionDetailsModal();
      this.inspectionProperty = this.inspectionDetailsService.getInspectionPropertyModal();
      this.reportId = this.inspectionProperty.reportId;
      this.reportType = this.inspectionProperty.inspectionId;

      console.log("reportId " + this.reportId);
      console.log("reportType " + this.reportType);

      //Initialize the form
      this.initForm();

      this.initRecommendations();

      this.inspectiondetailsform.patchValue(this.inspectiondetails);

      //Set booking id
      console.log("Setting booking id " + this.id.toString());
      const value = { bookingid: this.id.toString() };
      this.inspectiondetailsform.patchValue(value);

      //Subscribe to form changes
      this.subscribeToFormChanges();
      this.formChangeChecker();
    });

    this.fileUploadProgressService.clearMap();

    this.appServeiceLoadStatusService.setInspDtlFormLoadStatus();
  }

  private subscribeToFormChanges() {
    this.valueChangeCheckSub = this.inspectiondetailsform.valueChanges.subscribe(
      () => {
        this.isFormDirty = true;
      },
      () => {
        this.isFormDirty = false;
      }
    );
  }

  private formChangeChecker() {
    setInterval(() => {
      if (this.isFormDirty) {
        this.onSave(false, true);
      }
    }, 5000);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.valueChangeCheckSub) {
      this.valueChangeCheckSub.unsubscribe();
    }
    if (this.addReportSub) {
      this.addReportSub.unsubscribe();
    }
    if (this.formVersionSubscription != null) {
      this.formVersionSubscription.unsubscribe();
    }
    if (this.formCompleteSubscription != null) {
      this.formCompleteSubscription.unsubscribe();
    }
    if (this.removeQuickRecommSubscription != null) {
      this.removeQuickRecommSubscription.unsubscribe();
    }

    this.fileUploadProgressService.clearMap();
    this.appServeiceLoadStatusService.clearInspDtlFormLoadStatus();
  }

  public initRecommendations() {
    let hallways_recommendations_array = [];
    let kitchen_recommendations_array = [];
    let laundry_recommendations_array = [];
    let bedrooms_recommendations_array = [];
    let bathrooms_recommendations_array = [];
    let external_recommendations_array = [];
    let ensuite_recommendations_array = [];
    let timberpest_recommendations_array = [];
    let internl_recommendations_array = [];

    let framestage_slab_recommendations_array = [];
    let walls_beams_recommendations_array = [];
    let roof_recommendations_array = [];
    let lockup_recommendations_array = [];
    let lockup_recommendations_internal_array = [];
    let new_slab_recommendations_array = [];
    let new_slab_services_recommendations_array = [];

    if (this.inspectiondetails && this.inspectiondetails.hallways_recommendations_list) {
      hallways_recommendations_array = this.inspectiondetails.hallways_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.kitchen_recommendations_list) {
      kitchen_recommendations_array = this.inspectiondetails.kitchen_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.laundry_recommendations_list) {
      laundry_recommendations_array = this.inspectiondetails.laundry_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.bedrooms_recommendations_list) {
      bedrooms_recommendations_array = this.inspectiondetails.bedrooms_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.bathrooms_recommendations_list) {
      bathrooms_recommendations_array = this.inspectiondetails.bathrooms_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.external_recommendations_list) {
      external_recommendations_array = this.inspectiondetails.external_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.ensuite_recommendations_list) {
      ensuite_recommendations_array = this.inspectiondetails.ensuite_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.timberpest_recommendations_list) {
      timberpest_recommendations_array = this.inspectiondetails.timberpest_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.internal_recommendations_list) {
      internl_recommendations_array = this.inspectiondetails.internal_recommendations_list;
    }

    if (this.inspectiondetails && this.inspectiondetails.framestage_slab_recommendations_list) {
      framestage_slab_recommendations_array = this.inspectiondetails.framestage_slab_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.walls_beams_recommendations_list) {
      walls_beams_recommendations_array = this.inspectiondetails.walls_beams_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.roof_recommendations_list) {
      roof_recommendations_array = this.inspectiondetails.roof_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.lockup_recommendations_list) {
      lockup_recommendations_array = this.inspectiondetails.lockup_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.lockup_recommendations_internal_list) {
      lockup_recommendations_internal_array = this.inspectiondetails.lockup_recommendations_internal_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.new_slab_recommendations_list) {
      new_slab_recommendations_array = this.inspectiondetails.new_slab_recommendations_list;
    }
    if (this.inspectiondetails && this.inspectiondetails.preslab_services_recommendations_list) {
      new_slab_services_recommendations_array = this.inspectiondetails.preslab_services_recommendations_list;
    }

    //if (this.isFormDisplay('visual_building_inspection_form')) {
    if ((hallways_recommendations_array != null) && (typeof hallways_recommendations_array.forEach === 'function')) {
      hallways_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('hallways_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    if ((kitchen_recommendations_array != null) && (typeof kitchen_recommendations_array.forEach === 'function')) {
      kitchen_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('kitchen_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    if ((laundry_recommendations_array != null) && (typeof laundry_recommendations_array.forEach === 'function')) {
      laundry_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('laundry_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    if ((bedrooms_recommendations_array != null) && (typeof bedrooms_recommendations_array.forEach === 'function')) {
      bedrooms_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('bedrooms_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    if ((bathrooms_recommendations_array != null) && (typeof bathrooms_recommendations_array.forEach === 'function')) {
      bathrooms_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('bathrooms_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    if ((external_recommendations_array != null) && (typeof external_recommendations_array.forEach === 'function')) {
      external_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('external_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    if ((ensuite_recommendations_array != null) && (typeof ensuite_recommendations_array.forEach === 'function')) {
      ensuite_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('ensuite_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    //}

    //if (this.isFormDisplay('visual_timber_pest_inspection_form')) {
    if ((timberpest_recommendations_array != null) && (typeof timberpest_recommendations_array.forEach === 'function')) {
      timberpest_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('timberpest_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    //}

    //if (this.isFormDisplay('dilapidation_inspection_form')) {
    if ((internl_recommendations_array != null) && (typeof internl_recommendations_array.forEach === 'function')) {
      internl_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('internal_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    //}

    if ((framestage_slab_recommendations_array != null) && (typeof framestage_slab_recommendations_array.forEach === 'function')) {
      framestage_slab_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('framestage_slab_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    if ((walls_beams_recommendations_array != null) && (typeof walls_beams_recommendations_array.forEach === 'function')) {
      walls_beams_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('walls_beams_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    if ((roof_recommendations_array != null) && (typeof roof_recommendations_array.forEach === 'function')) {
      roof_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('roof_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    if ((lockup_recommendations_array != null) && (typeof lockup_recommendations_array.forEach === 'function')) {
      lockup_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('lockup_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    if ((lockup_recommendations_internal_array != null) && (typeof lockup_recommendations_internal_array.forEach === 'function')) {
      lockup_recommendations_internal_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('lockup_recommendations_internal_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
    if ((new_slab_recommendations_array != null) && (typeof new_slab_recommendations_array.forEach === 'function')) {
      new_slab_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('new_slab_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }

    if ((new_slab_services_recommendations_array != null) && (typeof new_slab_services_recommendations_array.forEach === 'function')) {
      new_slab_services_recommendations_array.forEach(() => {
        (<FormArray>this.inspectiondetailsform.get('preslab_services_recommendations_list')).push(
          new FormGroup({
            'item': new FormControl('-'),
            'rectype': new FormControl('-'),
            'recdetail': new FormControl('-'),
            'comment': new FormControl(''),
            'typee': new FormControl(),
            'filename': new FormControl(),
            'isquickitem': new FormControl(),
            'id': new FormControl('')
          })
        );
      });
    }
  }

  private initForm() {

    let visual_timber_pest_inspection_form = {
      '1985': '',
      '1986': '',
      '1987': '',
      '1988': '',
      '1989': '',
      '1990': '',
      '1991': '',
      '1992': '',
      '1993': '',
      '1994': '',
      '1995': '',
      '2000': '',
      '2001': '',
      '2002': '',
      '2003': '',
      '2004': '',
      '2005': '',
      '2006': '',
      '2007': '',
      '2008': '',
      '2009': '',
      '2010': '',
      '2011': '',
      '2012': '',
      '2013': '',
      '2014': '',
      '2015': '',
      '2016': '',
      '2017': '',
      '2018': '',
      '2019': '',
      '2020': '',
      '2021': '',
      '2022': '',
      '2023': '',
      '2024': '',
      '2025': '',
      '2026': '',
      '2027': '',
      '2028': '',
      '2029': '',
      '2030': '',
      '2031': '',
      '2032': '',
      '2033': '',
      '2034': '',
      '2035': '',
      '2036': '',
      '2037': '',
      '2038': '',
      '2039': '',
      '2040': '',
      '2041': '',
      '2042': '',
      '2043': '',
      '2044': '',
      '2045': '',
      '2046': '',
      '2047': '',
      '2048': '',
      '2049': '',
      '2050': '',
      '2051': '',
      '2052': '',
      '2053': '',
      '2054': '',
      '2055': '',
      '2056': '',
      '2057': '',
      '2058': '',
      '2059': '',
      '2060': '',
      '2061': '',
      '2062': '',
      '2063': '',
      '2064': '',
      '2065': '',
      '2066': '',
      '2067': '',
      '2068': '',
      '2069': '',
      '2070': '',
      '2071': '',
      '2072': '',
      '2073': '',
      '2074': '',
      '2075': '',
      '2076': '',
      '2077': '',
      '2078': '',
      '2079': '',
      '2080': '',
      '2081': '',
      '2082': '',
      '2083': '',
      'timberpest_recommendations_list': [],
      '2096': '',
      '2097': '',
      '2098': '',
      '2099': '',
      '2100': '',
      'Areas_Conducive_note': '',
      '2103': '',
      '2104': '',
      '2105': '',
      'Report_on_Drainage_note': '',
      '2108': '',
      '2109': '',
      '2110': '',
      'Report_on_Ventilation_note': '',
      '2113': '',
      '2114': '',
      '2115': '',
      'Evidence_note': '',
      '2120': '',
      '2121': '',
      '2122': '',
      '2123': '',
      '2124': '',
      '2125': '',
      'timber_summary': ''
    };

    let furnished_and_extension_form = {
      'furnished': '',
      'extension': '',
      'extension_comment': ''
    }

    let smoke_detectors_fitted_form = {
      'smoke': ''
    }

    let smoke_detectors_form = {
      'smoke_detectors': '',
      'smoke_detectors-test': '',
      'smoke_detectors_comment': ''
    }

    let services_connected_form = {
      'electricity': '',
      'electricity-test': '',
      'electricity_comment': '',
      'gas': '',
      'gas-test': '',
      'gas_comment': '',
      'water': '',
      'water-test': '',
      'water_comment': '',
      'sewer': '',
      'sewer-test': '',
      'sewer_comment': '',
      'drainage': '',
      'drainage-test': '',
      'drainage_comment': ''
    }

    let visual_building_inspection_form = {
      '1001': '',
      '1002': '',
      '1003': '',
      '1004': '',
      '1005': '',
      '1006': '',
      '1007': '',
      '1008': '',
      '1009': '',
      '1010': '',
      '1011': '',
      '1012': '',
      '1013': '',
      '1014': '',
      '1015': '',
      '1016': '',
      '1017': '',
      '1018': '',
      '1019': '',
      '1020': '',
      '1021': '',
      '1022': '',
      '1023': '',
      '1024': '',
      '1025': '',
      '1026': '',
      '1027': '',
      '1028': '',
      '1029': '',
      '1030': '',
      '1031': '',
      '1032': '',
      '1033': '',
      '1034': '',
      '1035': '',
      '1036': '',
      '1037': '',
      '1038': '',
      '1039': '',
      '1040': '',
      '1041': '',
      '1042': '',
      '1043': '',
      '1044': '',
      '1045': '',
      '1046': '',
      '1047': '',
      '1048': '',
      '1049': '',
      '1050': '',
      '1051': '',
      '1052': '',
      '1053': '',
      '1054': '',
      'hallways_recommendations_list': [],
      '1061': '',
      '1062': '',
      '1063': '',
      '1064': '',
      '1065': '',
      '1066': '',
      '1067': '',
      '1068': '',
      '1069': '',
      '1070': '',
      '1071': '',
      '1072': '',
      '1073': '',
      '1074': '',
      '1075': '',
      '1076': '',
      '1077': '',
      '1078': '',
      '1079': '',
      '1080': '',
      '1081': '',
      '1082': '',
      '1083': '',
      '1084': '',
      '1085': '',
      '1086': '',
      '1087': '',
      '1088': '',
      '1089': '',
      '1090': '',
      '1091': '',
      '1092': '',
      '1093': '',
      '1094': '',
      '1095': '',
      '1096': '',
      '1097': '',
      '1098': '',
      '1099': '',
      '1100': '',
      '1101': '',
      '1102': '',
      '1103': '',
      '1104': '',
      '1105': '',
      '1106': '',
      '1107': '',
      '1108': '',
      '1109': '',
      '1110': '',
      '1111': '',
      '1112': '',
      '1113': '',
      '1114': '',
      '1115': '',
      '1116': '',
      '1117': '',
      '1118': '',
      '1119': '',
      '1120': '',
      '1121': '',
      '1122': '',
      '1123': '',
      '1124': '',
      '1125': '',
      '1126': '',
      '1127': '',
      '1128': '',
      '1129': '',
      '1130': '',
      '1131': '',
      '1132': '',
      '1133': '',
      '1134': '',
      '1135': '',
      '1136': '',
      '1137': '',
      '1138': '',
      '1139': '',
      '1140': '',
      '1141': '',
      '1142': '',
      '1143': '',
      '1144': '',
      '1145': '',
      '1146': '',
      '1147': '',
      '1148': '',
      '1149': '',
      '1150': '',
      '1151': '',
      '1152': '',
      '1153': '',
      '1154': '',
      '1155': '',
      '1156': '',
      '1157': '',
      '1158': '',
      '1159': '',
      '1160': '',
      '1161': '',
      '1162': '',
      'kitchen_recommendations_list': [],
      '1169': '',
      '1170': '',
      '1171': '',
      '1172': '',
      '1173': '',
      '1174': '',
      '1175': '',
      '1176': '',
      '1177': '',
      '1178': '',
      '1179': '',
      '1180': '',
      '1181': '',
      '1182': '',
      '1183': '',
      '1184': '',
      '1185': '',
      '1186': '',
      '1187': '',
      '1188': '',
      '1189': '',
      '1190': '',
      '1191': '',
      '1192': '',
      '1193': '',
      '1194': '',
      '1195': '',
      '1196': '',
      '1197': '',
      '1198': '',
      '1199': '',
      '1200': '',
      '1201': '',
      '1202': '',
      '1203': '',
      '1204': '',
      '1205': '',
      '1206': '',
      '1207': '',
      '1208': '',
      '1209': '',
      '1210': '',
      '1211': '',
      '1212': '',
      '1213': '',
      '1214': '',
      '1215': '',
      '1216': '',
      '1217': '',
      '1218': '',
      '1219': '',
      '1220': '',
      '1221': '',
      '1222': '',
      '1223': '',
      '1224': '',
      '1225': '',
      '1226': '',
      '1227': '',
      '1228': '',
      '1229': '',
      '1230': '',
      '1231': '',
      '1232': '',
      '1233': '',
      '1234': '',
      'laundry_recommendations_list': [],
      '1253': '',
      '1254': '',
      '1255': '',
      '1256': '',
      '1257': '',
      '1258': '',
      '1259': '',
      '1260': '',
      '1261': '',
      '1262': '',
      '1263': '',
      '1264': '',
      '1265': '',
      '1266': '',
      '1267': '',
      '1268': '',
      '1269': '',
      '1270': '',
      '1271': '',
      '1272': '',
      '1273': '',
      '1274': '',
      '1275': '',
      '1276': '',
      '1277': '',
      '1278': '',
      '1279': '',
      '1280': '',
      '1281': '',
      '1282': '',
      '1283': '',
      '1284': '',
      '1285': '',
      '1286': '',
      '1287': '',
      '1288': '',
      '1289': '',
      '1290': '',
      '1291': '',
      '1292': '',
      '1293': '',
      '1294': '',
      '1301': '',
      '1302': '',
      '1303': '',
      '1304': '',
      '1305': '',
      '1306': '',
      '1307': '',
      '1308': '',
      '1309': '',
      '1310': '',
      '1311': '',
      '1312': '',
      '1313': '',
      '1314': '',
      '1315': '',
      '1316': '',
      '1317': '',
      '1318': '',
      '1319': '',
      '1320': '',
      '1321': '',
      '1322': '',
      '1323': '',
      '1324': '',
      '1325': '',
      '1326': '',
      '1327': '',
      '1328': '',
      '1329': '',
      '1330': '',
      '1331': '',
      '1332': '',
      '1333': '',
      '1334': '',
      '1335': '',
      '1336': '',
      '1337': '',
      '1338': '',
      '1339': '',
      '1340': '',
      '1341': '',
      '1342': '',
      '1349': '',
      '1350': '',
      '1351': '',
      '1352': '',
      '1353': '',
      '1354': '',
      '1355': '',
      '1356': '',
      '1357': '',
      '1358': '',
      '1359': '',
      '1360': '',
      '1361': '',
      '1362': '',
      '1363': '',
      '1364': '',
      '1365': '',
      '1366': '',
      '1367': '',
      '1368': '',
      '1369': '',
      '1370': '',
      '1371': '',
      '1372': '',
      '1373': '',
      '1374': '',
      '1375': '',
      '1376': '',
      '1377': '',
      '1378': '',
      '1379': '',
      '1380': '',
      '1381': '',
      '1382': '',
      '1383': '',
      '1384': '',
      '1385': '',
      '1386': '',
      '1387': '',
      '1388': '',
      '1389': '',
      '1390': '',
      '1397': '',
      '1398': '',
      '1399': '',
      '1400': '',
      '1401': '',
      '1402': '',
      '1403': '',
      '1404': '',
      '1405': '',
      '1406': '',
      '1407': '',
      '1408': '',
      '1409': '',
      '1410': '',
      '1411': '',
      '1412': '',
      '1413': '',
      '1414': '',
      '1415': '',
      '1416': '',
      '1417': '',
      '1418': '',
      '1419': '',
      '1420': '',
      '1421': '',
      '1422': '',
      '1423': '',
      '1424': '',
      '1425': '',
      '1426': '',
      '1427': '',
      '1428': '',
      '1429': '',
      '1430': '',
      '1431': '',
      '1432': '',
      '1433': '',
      '1434': '',
      '1435': '',
      '1436': '',
      '1437': '',
      '1438': '',
      '1445': '',
      '1446': '',
      '1447': '',
      '1448': '',
      '1449': '',
      '1450': '',
      '1451': '',
      '1452': '',
      '1453': '',
      '1454': '',
      '1455': '',
      '1456': '',
      '1457': '',
      '1458': '',
      '1459': '',
      '1460': '',
      '1461': '',
      '1462': '',
      '1463': '',
      '1464': '',
      '1465': '',
      '1466': '',
      '1467': '',
      '1468': '',
      '1469': '',
      '1470': '',
      '1471': '',
      '1472': '',
      '1473': '',
      '1474': '',
      '1475': '',
      '1476': '',
      '1477': '',
      '1478': '',
      '1479': '',
      '1480': '',
      '1481': '',
      '1482': '',
      '1483': '',
      '1484': '',
      '1485': '',
      '1486': '',
      'bedrooms_recommendations_list': [],
      'internal_recommendations_list': [],
      '1499': '',
      '1500': '',
      '1501': '',
      '1502': '',
      '1503': '',
      '1504': '',
      '1505': '',
      '1506': '',
      '1507': '',
      '1508': '',
      '1509': '',
      '1510': '',
      '1511': '',
      '1512': '',
      '1513': '',
      '1514': '',
      '1515': '',
      '1516': '',
      '1517': '',
      '1518': '',
      '1519': '',
      '1520': '',
      '1521': '',
      '1522': '',
      '1523': '',
      '1524': '',
      '1525': '',
      '1526': '',
      '1527': '',
      '1528': '',
      '1529': '',
      '1530': '',
      '1531': '',
      '1532': '',
      '1533': '',
      '1534': '',
      '1535': '',
      '1536': '',
      '1537': '',
      '1538': '',
      '1539': '',
      '1540': '',
      '1541': '',
      '1542': '',
      '1543': '',
      '1544': '',
      '1545': '',
      '1546': '',
      '1547': '',
      '1548': '',
      '1549': '',
      '1550': '',
      '1551': '',
      '1552': '',
      '1553': '',
      '1554': '',
      '1555': '',
      '1556': '',
      '1557': '',
      '1558': '',
      '1559': '',
      '1560': '',
      '1561': '',
      '1562': '',
      '1563': '',
      '1564': '',
      '1565': '',
      '1566': '',
      '1567': '',
      '1568': '',
      '1569': '',
      '1570': '',
      '1571': '',
      '1572': '',
      '1573': '',
      '1574': '',
      '1575': '',
      '1576': '',
      '1577': '',
      '1578': '',
      '1579': '',
      '1580': '',
      '1581': '',
      '1582': '',
      '1583': '',
      '1584': '',
      '1585': '',
      '1586': '',
      '1587': '',
      '1588': '',
      '1589': '',
      '1590': '',
      '1591': '',
      '1592': '',
      '1593': '',
      '1594': '',
      '1595': '',
      '1596': '',
      '1597': '',
      '1598': '',
      '1599': '',
      '1600': '',
      '1601': '',
      '1602': '',
      '1603': '',
      '1604': '',
      '1605': '',
      '1606': '',
      '1607': '',
      '1608': '',
      '1609': '',
      '1610': '',
      '1611': '',
      '1612': '',
      '1613': '',
      '1614': '',
      '1615': '',
      '1616': '',
      '1617': '',
      '1618': '',
      '1619': '',
      '1620': '',
      '1621': '',
      '1622': '',
      '1623': '',
      '1624': '',
      '1625': '',
      '1626': '',
      '1627': '',
      '1628': '',
      '1629': '',
      '1630': '',
      'bathrooms_recommendations_list': [],
      '1643': '',
      '1644': '',
      '1645': '',
      '1646': '',
      '1647': '',
      '1648': '',
      '1649': '',
      '1650': '',
      '1651': '',
      '1652': '',
      '1653': '',
      '1654': '',
      '1655': '',
      '1656': '',
      '1657': '',
      '1658': '',
      '1659': '',
      '1660': '',
      '1661': '',
      '1662': '',
      '1663': '',
      '1664': '',
      '1665': '',
      '1666': '',
      '1667': '',
      '1668': '',
      '1669': '',
      '1670': '',
      '1671': '',
      '1672': '',
      '1673': '',
      '1674': '',
      '1675': '',
      '1676': '',
      '1677': '',
      '1678': '',
      '1679': '',
      '1680': '',
      '1681': '',
      '1682': '',
      '1683': '',
      '1684': '',
      '1685': '',
      '1686': '',
      '1687': '',
      '1688': '',
      '1689': '',
      '1690': '',
      '1691': '',
      '1692': '',
      '1693': '',
      '1694': '',
      '1695': '',
      '1696': '',
      '1697': '',
      '1698': '',
      '1699': '',
      '1700': '',
      '1701': '',
      '1702': '',
      '1703': '',
      '1704': '',
      '1705': '',
      '1706': '',
      '1707': '',
      '1708': '',
      '1709': '',
      '1710': '',
      '1711': '',
      '1712': '',
      '1713': '',
      '1714': '',
      '1715': '',
      '1716': '',
      '1717': '',
      '1718': '',
      '1719': '',
      '1720': '',
      '1721': '',
      '1722': '',
      '1723': '',
      '1724': '',
      '1725': '',
      '1726': '',
      '1727': '',
      '1728': '',
      '1729': '',
      '1730': '',
      '1731': '',
      '1732': '',
      '1733': '',
      '1734': '',
      '1735': '',
      '1736': '',
      '1737': '',
      '1738': '',
      '1739': '',
      '1740': '',
      '1741': '',
      '1742': '',
      '1743': '',
      '1744': '',
      '1745': '',
      '1746': '',
      '1747': '',
      '1748': '',
      '1749': '',
      '1750': '',
      '1751': '',
      '1752': '',
      '1753': '',
      '1754': '',
      '1755': '',
      '1756': '',
      '1757': '',
      '1758': '',
      '1759': '',
      '1760': '',
      '1761': '',
      '1762': '',
      '1763': '',
      '1764': '',
      '1765': '',
      '1766': '',
      '1767': '',
      '1768': '',
      '1769': '',
      '1770': '',
      '1771': '',
      '1772': '',
      '1773': '',
      '1774': '',
      'ensuite_recommendations_list': [],
      '1787': '',
      '1788': '',
      '1789': '',
      '1790': '',
      '1791': '',
      '1792': '',
      '1793': '',
      '1794': '',
      '1795': '',
      '1796': '',
      '1797': '',
      '1798': '',
      '1799': '',
      '1800': '',
      '1801': '',
      '1802': '',
      '1803': '',
      '1804': '',
      '1805': '',
      '1806': '',
      '1807': '',
      '1808': '',
      '1809': '',
      '1810': '',
      '1811': '',
      '1812': '',
      '1813': '',
      '1814': '',
      '1815': '',
      '1816': '',
      '1817': '',
      '1818': '',
      '1819': '',
      '1820': '',
      '1821': '',
      '1822': '',
      '1823': '',
      '1824': '',
      '1825': '',
      '1826': '',
      '1827': '',
      '1828': '',
      '1829': '',
      '1830': '',
      '1831': '',
      '1832': '',
      '1833': '',
      '1834': '',
      '1835': '',
      '1836': '',
      '1837': '',
      '1838': '',
      '1839': '',
      '1840': '',
      '1841': '',
      '1842': '',
      '1843': '',
      '1844': '',
      '1845': '',
      '1846': '',
      '1847': '',
      '1848': '',
      '1849': '',
      '1850': '',
      '1851': '',
      '1852': '',
      '1853': '',
      '1854': '',
      '1855': '',
      '1856': '',
      '1857': '',
      '1858': '',
      '1859': '',
      '1860': '',
      '1861': '',
      '1862': '',
      '1863': '',
      '1864': '',
      '1865': '',
      '1866': '',
      '1867': '',
      '1868': '',
      '1869': '',
      '1870': '',
      '1871': '',
      '1872': '',
      '1873': '',
      '1874': '',
      '1875': '',
      '1876': '',
      '1877': '',
      '1878': '',
      '1879': '',
      '1880': '',
      '1881': '',
      '1882': '',
      '1883': '',
      '1884': '',
      '1885': '',
      '1886': '',
      '1887': '',
      '1888': '',
      '1889': '',
      '1890': '',
      '1891': '',
      '1892': '',
      '1893': '',
      '1894': '',
      '1895': '',
      '1896': '',
      '1897': '',
      '1898': '',
      '1899': '',
      '1900': '',
      '1901': '',
      '1902': '',
      '1903': '',
      '1904': '',
      '1905': '',
      '1906': '',
      '1907': '',
      '1908': '',
      '1909': '',
      '1910': '',
      '1911': '',
      '1912': '',
      '1913': '',
      '1914': '',
      '1915': '',
      '1916': '',
      '1917': '',
      '1918': '',
      '1919': '',
      '1920': '',
      '1921': '',
      '1922': '',
      '1923': '',
      '1924': '',
      '1925': '',
      '1926': '',
      '1927': '',
      '1928': '',
      '1929': '',
      '1930': '',
      '1931': '',
      '1932': '',
      '1933': '',
      '1934': '',
      '1935': '',
      '1936': '',
      '1937': '',
      '1938': '',
      '1939': '',
      '1940': '',
      '1941': '',
      '1942': '',
      '1943': '',
      '1944': '',
      '1945': '',
      '1946': '',
      '1947': '',
      '1948': '',
      '1949': '',
      '1950': '',
      '1951': '',
      '1952': '',
      '1953': '',
      '1954': '',
      '1955': '',
      '1956': '',
      '1957': '',
      '1958': '',
      '1959': '',
      '1960': '',
      'external_recommendations_list': [],
      'summary': '',
      'major_defects': '',
      'major_defects_comment': '',
      'structural_defects': '',
      'structural_defects_comment': '',

      '1499_1': '',
      '1500_1': '',
      '1501_1': '',
      '1502_1': '',
      '1503_1': '',
      '1504_1': '',
      '1505_1': '',
      '1506_1': '',
      '1507_1': '',
      '1508_1': '',
      '1509_1': '',
      '1510_1': '',
      '1511_1': '',
      '1512_1': '',
      '1513_1': '',
      '1514_1': '',
      '1515_1': '',
      '1516_1': '',
      '1517_1': '',
      '1518_1': '',
      '1519_1': '',
      '1520_1': '',
      '1521_1': '',
      '1522_1': '',
      '1523_1': '',
      '1524_1': '',
      '1525_1': '',
      '1526_1': '',
      '1527_1': '',
      '1528_1': '',
      '1529_1': '',
      '1530_1': '',
      '1531_1': '',
      '1532_1': '',
      '1533_1': '',
      '1534_1': '',
      '1535_1': '',
      '1536_1': '',
      '1537_1': '',
      '1538_1': '',
      '1539_1': '',
      '1540_1': '',
      '1541_1': '',
      '1542_1': '',
      '1543_1': '',
      '1544_1': '',
      '1545_1': '',
      '1546_1': '',
      '1547_1': '',
      '1548_1': '',
      '1549_1': '',
      '1550_1': '',
      '1551_1': '',
      '1552_1': '',
      '1553_1': '',
      '1554_1': '',
      '1555_1': '',
      '1556_1': '',
      '1557_1': '',
      '1558_1': '',
      '1559_1': '',
      '1560_1': '',
      '1561_1': '',
      '1562_1': '',
      '1563_1': '',
      '1564_1': '',
      '1565_1': '',
      '1566_1': '',
      '1567_1': '',
      '1568_1': '',
      '1569_1': '',
      '1570_1': '',
      '1571_1': '',
      '1572_1': '',
      '1573_1': '',
      '1574_1': '',
      '1575_1': '',
      '1576_1': '',
      '1577_1': '',
      '1578_1': '',
      '1579_1': '',
      '1580_1': '',
      '1581_1': '',
      '1582_1': '',
      '1583_1': '',
      '1584_1': '',
      '1585_1': '',
      '1586_1': '',
      '1587_1': '',
      '1588_1': '',
      '1589_1': '',
      '1590_1': '',
      '1591_1': '',
      '1592_1': '',
      '1593_1': '',
      '1594_1': '',
      '1595_1': '',
      '1596_1': '',
      '1597_1': '',
      '1598_1': '',
      '1599_1': '',
      '1600_1': '',
      '1601_1': '',
      '1602_1': '',
      '1603_1': '',
      '1604_1': '',
      '1605_1': '',
      '1606_1': '',
      '1607_1': '',
      '1608_1': '',
      '1609_1': '',
      '1610_1': '',
      '1611_1': '',
      '1612_1': '',
      '1613_1': '',
      '1614_1': '',
      '1615_1': '',
      '1616_1': '',
      '1617_1': '',
      '1618_1': '',
      '1619_1': '',
      '1620_1': '',
      '1621_1': '',
      '1622_1': '',
      '1623_1': '',
      '1624_1': '',
      '1625_1': '',
      '1626_1': '',
      '1627_1': '',
      '1628_1': '',
      '1629_1': '',
      '1630_1': '',

      '1499_2': '',
      '1500_2': '',
      '1501_2': '',
      '1502_2': '',
      '1503_2': '',
      '1504_2': '',
      '1505_2': '',
      '1506_2': '',
      '1507_2': '',
      '1508_2': '',
      '1509_2': '',
      '1510_2': '',
      '1511_2': '',
      '1512_2': '',
      '1513_2': '',
      '1514_2': '',
      '1515_2': '',
      '1516_2': '',
      '1517_2': '',
      '1518_2': '',
      '1519_2': '',
      '1520_2': '',
      '1521_2': '',
      '1522_2': '',
      '1523_2': '',
      '1524_2': '',
      '1525_2': '',
      '1526_2': '',
      '1527_2': '',
      '1528_2': '',
      '1529_2': '',
      '1530_2': '',
      '1531_2': '',
      '1532_2': '',
      '1533_2': '',
      '1534_2': '',
      '1535_2': '',
      '1536_2': '',
      '1537_2': '',
      '1538_2': '',
      '1539_2': '',
      '1540_2': '',
      '1541_2': '',
      '1542_2': '',
      '1543_2': '',
      '1544_2': '',
      '1545_2': '',
      '1546_2': '',
      '1547_2': '',
      '1548_2': '',
      '1549_2': '',
      '1550_2': '',
      '1551_2': '',
      '1552_2': '',
      '1553_2': '',
      '1554_2': '',
      '1555_2': '',
      '1556_2': '',
      '1557_2': '',
      '1558_2': '',
      '1559_2': '',
      '1560_2': '',
      '1561_2': '',
      '1562_2': '',
      '1563_2': '',
      '1564_2': '',
      '1565_2': '',
      '1566_2': '',
      '1567_2': '',
      '1568_2': '',
      '1569_2': '',
      '1570_2': '',
      '1571_2': '',
      '1572_2': '',
      '1573_2': '',
      '1574_2': '',
      '1575_2': '',
      '1576_2': '',
      '1577_2': '',
      '1578_2': '',
      '1579_2': '',
      '1580_2': '',
      '1581_2': '',
      '1582_2': '',
      '1583_2': '',
      '1584_2': '',
      '1585_2': '',
      '1586_2': '',
      '1587_2': '',
      '1588_2': '',
      '1589_2': '',
      '1590_2': '',
      '1591_2': '',
      '1592_2': '',
      '1593_2': '',
      '1594_2': '',
      '1595_2': '',
      '1596_2': '',
      '1597_2': '',
      '1598_2': '',
      '1599_2': '',
      '1600_2': '',
      '1601_2': '',
      '1602_2': '',
      '1603_2': '',
      '1604_2': '',
      '1605_2': '',
      '1606_2': '',
      '1607_2': '',
      '1608_2': '',
      '1609_2': '',
      '1610_2': '',
      '1611_2': '',
      '1612_2': '',
      '1613_2': '',
      '1614_2': '',
      '1615_2': '',
      '1616_2': '',
      '1617_2': '',
      '1618_2': '',
      '1619_2': '',
      '1620_2': '',
      '1621_2': '',
      '1622_2': '',
      '1623_2': '',
      '1624_2': '',
      '1625_2': '',
      '1626_2': '',
      '1627_2': '',
      '1628_2': '',
      '1629_2': '',
      '1630_2': '',

      '1499_3': '',
      '1500_3': '',
      '1501_3': '',
      '1502_3': '',
      '1503_3': '',
      '1504_3': '',
      '1505_3': '',
      '1506_3': '',
      '1507_3': '',
      '1508_3': '',
      '1509_3': '',
      '1510_3': '',
      '1511_3': '',
      '1512_3': '',
      '1513_3': '',
      '1514_3': '',
      '1515_3': '',
      '1516_3': '',
      '1517_3': '',
      '1518_3': '',
      '1519_3': '',
      '1520_3': '',
      '1521_3': '',
      '1522_3': '',
      '1523_3': '',
      '1524_3': '',
      '1525_3': '',
      '1526_3': '',
      '1527_3': '',
      '1528_3': '',
      '1529_3': '',
      '1530_3': '',
      '1531_3': '',
      '1532_3': '',
      '1533_3': '',
      '1534_3': '',
      '1535_3': '',
      '1536_3': '',
      '1537_3': '',
      '1538_3': '',
      '1539_3': '',
      '1540_3': '',
      '1541_3': '',
      '1542_3': '',
      '1543_3': '',
      '1544_3': '',
      '1545_3': '',
      '1546_3': '',
      '1547_3': '',
      '1548_3': '',
      '1549_3': '',
      '1550_3': '',
      '1551_3': '',
      '1552_3': '',
      '1553_3': '',
      '1554_3': '',
      '1555_3': '',
      '1556_3': '',
      '1557_3': '',
      '1558_3': '',
      '1559_3': '',
      '1560_3': '',
      '1561_3': '',
      '1562_3': '',
      '1563_3': '',
      '1564_3': '',
      '1565_3': '',
      '1566_3': '',
      '1567_3': '',
      '1568_3': '',
      '1569_3': '',
      '1570_3': '',
      '1571_3': '',
      '1572_3': '',
      '1573_3': '',
      '1574_3': '',
      '1575_3': '',
      '1576_3': '',
      '1577_3': '',
      '1578_3': '',
      '1579_3': '',
      '1580_3': '',
      '1581_3': '',
      '1582_3': '',
      '1583_3': '',
      '1584_3': '',
      '1585_3': '',
      '1586_3': '',
      '1587_3': '',
      '1588_3': '',
      '1589_3': '',
      '1590_3': '',
      '1591_3': '',
      '1592_3': '',
      '1593_3': '',
      '1594_3': '',
      '1595_3': '',
      '1596_3': '',
      '1597_3': '',
      '1598_3': '',
      '1599_3': '',
      '1600_3': '',
      '1601_3': '',
      '1602_3': '',
      '1603_3': '',
      '1604_3': '',
      '1605_3': '',
      '1606_3': '',
      '1607_3': '',
      '1608_3': '',
      '1609_3': '',
      '1610_3': '',
      '1611_3': '',
      '1612_3': '',
      '1613_3': '',
      '1614_3': '',
      '1615_3': '',
      '1616_3': '',
      '1617_3': '',
      '1618_3': '',
      '1619_3': '',
      '1620_3': '',
      '1621_3': '',
      '1622_3': '',
      '1623_3': '',
      '1624_3': '',
      '1625_3': '',
      '1626_3': '',
      '1627_3': '',
      '1628_3': '',
      '1629_3': '',
      '1630_3': '',

      '1499_4': '',
      '1500_4': '',
      '1501_4': '',
      '1502_4': '',
      '1503_4': '',
      '1504_4': '',
      '1505_4': '',
      '1506_4': '',
      '1507_4': '',
      '1508_4': '',
      '1509_4': '',
      '1510_4': '',
      '1511_4': '',
      '1512_4': '',
      '1513_4': '',
      '1514_4': '',
      '1515_4': '',
      '1516_4': '',
      '1517_4': '',
      '1518_4': '',
      '1519_4': '',
      '1520_4': '',
      '1521_4': '',
      '1522_4': '',
      '1523_4': '',
      '1524_4': '',
      '1525_4': '',
      '1526_4': '',
      '1527_4': '',
      '1528_4': '',
      '1529_4': '',
      '1530_4': '',
      '1531_4': '',
      '1532_4': '',
      '1533_4': '',
      '1534_4': '',
      '1535_4': '',
      '1536_4': '',
      '1537_4': '',
      '1538_4': '',
      '1539_4': '',
      '1540_4': '',
      '1541_4': '',
      '1542_4': '',
      '1543_4': '',
      '1544_4': '',
      '1545_4': '',
      '1546_4': '',
      '1547_4': '',
      '1548_4': '',
      '1549_4': '',
      '1550_4': '',
      '1551_4': '',
      '1552_4': '',
      '1553_4': '',
      '1554_4': '',
      '1555_4': '',
      '1556_4': '',
      '1557_4': '',
      '1558_4': '',
      '1559_4': '',
      '1560_4': '',
      '1561_4': '',
      '1562_4': '',
      '1563_4': '',
      '1564_4': '',
      '1565_4': '',
      '1566_4': '',
      '1567_4': '',
      '1568_4': '',
      '1569_4': '',
      '1570_4': '',
      '1571_4': '',
      '1572_4': '',
      '1573_4': '',
      '1574_4': '',
      '1575_4': '',
      '1576_4': '',
      '1577_4': '',
      '1578_4': '',
      '1579_4': '',
      '1580_4': '',
      '1581_4': '',
      '1582_4': '',
      '1583_4': '',
      '1584_4': '',
      '1585_4': '',
      '1586_4': '',
      '1587_4': '',
      '1588_4': '',
      '1589_4': '',
      '1590_4': '',
      '1591_4': '',
      '1592_4': '',
      '1593_4': '',
      '1594_4': '',
      '1595_4': '',
      '1596_4': '',
      '1597_4': '',
      '1598_4': '',
      '1599_4': '',
      '1600_4': '',
      '1601_4': '',
      '1602_4': '',
      '1603_4': '',
      '1604_4': '',
      '1605_4': '',
      '1606_4': '',
      '1607_4': '',
      '1608_4': '',
      '1609_4': '',
      '1610_4': '',
      '1611_4': '',
      '1612_4': '',
      '1613_4': '',
      '1614_4': '',
      '1615_4': '',
      '1616_4': '',
      '1617_4': '',
      '1618_4': '',
      '1619_4': '',
      '1620_4': '',
      '1621_4': '',
      '1622_4': '',
      '1623_4': '',
      '1624_4': '',
      '1625_4': '',
      '1626_4': '',
      '1627_4': '',
      '1628_4': '',
      '1629_4': '',
      '1630_4': '',

      '1643_1': '',
      '1644_1': '',
      '1645_1': '',
      '1646_1': '',
      '1647_1': '',
      '1648_1': '',
      '1649_1': '',
      '1650_1': '',
      '1651_1': '',
      '1652_1': '',
      '1653_1': '',
      '1654_1': '',
      '1655_1': '',
      '1656_1': '',
      '1657_1': '',
      '1658_1': '',
      '1659_1': '',
      '1660_1': '',
      '1661_1': '',
      '1662_1': '',
      '1663_1': '',
      '1664_1': '',
      '1665_1': '',
      '1666_1': '',
      '1667_1': '',
      '1668_1': '',
      '1669_1': '',
      '1670_1': '',
      '1671_1': '',
      '1672_1': '',
      '1673_1': '',
      '1674_1': '',
      '1675_1': '',
      '1676_1': '',
      '1677_1': '',
      '1678_1': '',
      '1679_1': '',
      '1680_1': '',
      '1681_1': '',
      '1682_1': '',
      '1683_1': '',
      '1684_1': '',
      '1685_1': '',
      '1686_1': '',
      '1687_1': '',
      '1688_1': '',
      '1689_1': '',
      '1690_1': '',
      '1691_1': '',
      '1692_1': '',
      '1693_1': '',
      '1694_1': '',
      '1695_1': '',
      '1696_1': '',
      '1697_1': '',
      '1698_1': '',
      '1699_1': '',
      '1700_1': '',
      '1701_1': '',
      '1702_1': '',
      '1703_1': '',
      '1704_1': '',
      '1705_1': '',
      '1706_1': '',
      '1707_1': '',
      '1708_1': '',
      '1709_1': '',
      '1710_1': '',
      '1711_1': '',
      '1712_1': '',
      '1713_1': '',
      '1714_1': '',
      '1715_1': '',
      '1716_1': '',
      '1717_1': '',
      '1718_1': '',
      '1719_1': '',
      '1720_1': '',
      '1721_1': '',
      '1722_1': '',
      '1723_1': '',
      '1724_1': '',
      '1725_1': '',
      '1726_1': '',
      '1727_1': '',
      '1728_1': '',
      '1729_1': '',
      '1730_1': '',
      '1731_1': '',
      '1732_1': '',
      '1733_1': '',
      '1734_1': '',
      '1735_1': '',
      '1736_1': '',
      '1737_1': '',
      '1738_1': '',
      '1739_1': '',
      '1740_1': '',
      '1741_1': '',
      '1742_1': '',
      '1743_1': '',
      '1744_1': '',
      '1745_1': '',
      '1746_1': '',
      '1747_1': '',
      '1748_1': '',
      '1749_1': '',
      '1750_1': '',
      '1751_1': '',
      '1752_1': '',
      '1753_1': '',
      '1754_1': '',
      '1755_1': '',
      '1756_1': '',
      '1757_1': '',
      '1758_1': '',
      '1759_1': '',
      '1760_1': '',
      '1761_1': '',
      '1762_1': '',
      '1763_1': '',
      '1764_1': '',
      '1765_1': '',
      '1766_1': '',
      '1767_1': '',
      '1768_1': '',
      '1769_1': '',
      '1770_1': '',
      '1771_1': '',
      '1772_1': '',
      '1773_1': '',
      '1774_1': '',

      '1643_2': '',
      '1644_2': '',
      '1645_2': '',
      '1646_2': '',
      '1647_2': '',
      '1648_2': '',
      '1649_2': '',
      '1650_2': '',
      '1651_2': '',
      '1652_2': '',
      '1653_2': '',
      '1654_2': '',
      '1655_2': '',
      '1656_2': '',
      '1657_2': '',
      '1658_2': '',
      '1659_2': '',
      '1660_2': '',
      '1661_2': '',
      '1662_2': '',
      '1663_2': '',
      '1664_2': '',
      '1665_2': '',
      '1666_2': '',
      '1667_2': '',
      '1668_2': '',
      '1669_2': '',
      '1670_2': '',
      '1671_2': '',
      '1672_2': '',
      '1673_2': '',
      '1674_2': '',
      '1675_2': '',
      '1676_2': '',
      '1677_2': '',
      '1678_2': '',
      '1679_2': '',
      '1680_2': '',
      '1681_2': '',
      '1682_2': '',
      '1683_2': '',
      '1684_2': '',
      '1685_2': '',
      '1686_2': '',
      '1687_2': '',
      '1688_2': '',
      '1689_2': '',
      '1690_2': '',
      '1691_2': '',
      '1692_2': '',
      '1693_2': '',
      '1694_2': '',
      '1695_2': '',
      '1696_2': '',
      '1697_2': '',
      '1698_2': '',
      '1699_2': '',
      '1700_2': '',
      '1701_2': '',
      '1702_2': '',
      '1703_2': '',
      '1704_2': '',
      '1705_2': '',
      '1706_2': '',
      '1707_2': '',
      '1708_2': '',
      '1709_2': '',
      '1710_2': '',
      '1711_2': '',
      '1712_2': '',
      '1713_2': '',
      '1714_2': '',
      '1715_2': '',
      '1716_2': '',
      '1717_2': '',
      '1718_2': '',
      '1719_2': '',
      '1720_2': '',
      '1721_2': '',
      '1722_2': '',
      '1723_2': '',
      '1724_2': '',
      '1725_2': '',
      '1726_2': '',
      '1727_2': '',
      '1728_2': '',
      '1729_2': '',
      '1730_2': '',
      '1731_2': '',
      '1732_2': '',
      '1733_2': '',
      '1734_2': '',
      '1735_2': '',
      '1736_2': '',
      '1737_2': '',
      '1738_2': '',
      '1739_2': '',
      '1740_2': '',
      '1741_2': '',
      '1742_2': '',
      '1743_2': '',
      '1744_2': '',
      '1745_2': '',
      '1746_2': '',
      '1747_2': '',
      '1748_2': '',
      '1749_2': '',
      '1750_2': '',
      '1751_2': '',
      '1752_2': '',
      '1753_2': '',
      '1754_2': '',
      '1755_2': '',
      '1756_2': '',
      '1757_2': '',
      '1758_2': '',
      '1759_2': '',
      '1760_2': '',
      '1761_2': '',
      '1762_2': '',
      '1763_2': '',
      '1764_2': '',
      '1765_2': '',
      '1766_2': '',
      '1767_2': '',
      '1768_2': '',
      '1769_2': '',
      '1770_2': '',
      '1771_2': '',
      '1772_2': '',
      '1773_2': '',
      '1774_2': '',

      '1643_3': '',
      '1644_3': '',
      '1645_3': '',
      '1646_3': '',
      '1647_3': '',
      '1648_3': '',
      '1649_3': '',
      '1650_3': '',
      '1651_3': '',
      '1652_3': '',
      '1653_3': '',
      '1654_3': '',
      '1655_3': '',
      '1656_3': '',
      '1657_3': '',
      '1658_3': '',
      '1659_3': '',
      '1660_3': '',
      '1661_3': '',
      '1662_3': '',
      '1663_3': '',
      '1664_3': '',
      '1665_3': '',
      '1666_3': '',
      '1667_3': '',
      '1668_3': '',
      '1669_3': '',
      '1670_3': '',
      '1671_3': '',
      '1672_3': '',
      '1673_3': '',
      '1674_3': '',
      '1675_3': '',
      '1676_3': '',
      '1677_3': '',
      '1678_3': '',
      '1679_3': '',
      '1680_3': '',
      '1681_3': '',
      '1682_3': '',
      '1683_3': '',
      '1684_3': '',
      '1685_3': '',
      '1686_3': '',
      '1687_3': '',
      '1688_3': '',
      '1689_3': '',
      '1690_3': '',
      '1691_3': '',
      '1692_3': '',
      '1693_3': '',
      '1694_3': '',
      '1695_3': '',
      '1696_3': '',
      '1697_3': '',
      '1698_3': '',
      '1699_3': '',
      '1700_3': '',
      '1701_3': '',
      '1702_3': '',
      '1703_3': '',
      '1704_3': '',
      '1705_3': '',
      '1706_3': '',
      '1707_3': '',
      '1708_3': '',
      '1709_3': '',
      '1710_3': '',
      '1711_3': '',
      '1712_3': '',
      '1713_3': '',
      '1714_3': '',
      '1715_3': '',
      '1716_3': '',
      '1717_3': '',
      '1718_3': '',
      '1719_3': '',
      '1720_3': '',
      '1721_3': '',
      '1722_3': '',
      '1723_3': '',
      '1724_3': '',
      '1725_3': '',
      '1726_3': '',
      '1727_3': '',
      '1728_3': '',
      '1729_3': '',
      '1730_3': '',
      '1731_3': '',
      '1732_3': '',
      '1733_3': '',
      '1734_3': '',
      '1735_3': '',
      '1736_3': '',
      '1737_3': '',
      '1738_3': '',
      '1739_3': '',
      '1740_3': '',
      '1741_3': '',
      '1742_3': '',
      '1743_3': '',
      '1744_3': '',
      '1745_3': '',
      '1746_3': '',
      '1747_3': '',
      '1748_3': '',
      '1749_3': '',
      '1750_3': '',
      '1751_3': '',
      '1752_3': '',
      '1753_3': '',
      '1754_3': '',
      '1755_3': '',
      '1756_3': '',
      '1757_3': '',
      '1758_3': '',
      '1759_3': '',
      '1760_3': '',
      '1761_3': '',
      '1762_3': '',
      '1763_3': '',
      '1764_3': '',
      '1765_3': '',
      '1766_3': '',
      '1767_3': '',
      '1768_3': '',
      '1769_3': '',
      '1770_3': '',
      '1771_3': '',
      '1772_3': '',
      '1773_3': '',
      '1774_3': '',

      '1643_4': '',
      '1644_4': '',
      '1645_4': '',
      '1646_4': '',
      '1647_4': '',
      '1648_4': '',
      '1649_4': '',
      '1650_4': '',
      '1651_4': '',
      '1652_4': '',
      '1653_4': '',
      '1654_4': '',
      '1655_4': '',
      '1656_4': '',
      '1657_4': '',
      '1658_4': '',
      '1659_4': '',
      '1660_4': '',
      '1661_4': '',
      '1662_4': '',
      '1663_4': '',
      '1664_4': '',
      '1665_4': '',
      '1666_4': '',
      '1667_4': '',
      '1668_4': '',
      '1669_4': '',
      '1670_4': '',
      '1671_4': '',
      '1672_4': '',
      '1673_4': '',
      '1674_4': '',
      '1675_4': '',
      '1676_4': '',
      '1677_4': '',
      '1678_4': '',
      '1679_4': '',
      '1680_4': '',
      '1681_4': '',
      '1682_4': '',
      '1683_4': '',
      '1684_4': '',
      '1685_4': '',
      '1686_4': '',
      '1687_4': '',
      '1688_4': '',
      '1689_4': '',
      '1690_4': '',
      '1691_4': '',
      '1692_4': '',
      '1693_4': '',
      '1694_4': '',
      '1695_4': '',
      '1696_4': '',
      '1697_4': '',
      '1698_4': '',
      '1699_4': '',
      '1700_4': '',
      '1701_4': '',
      '1702_4': '',
      '1703_4': '',
      '1704_4': '',
      '1705_4': '',
      '1706_4': '',
      '1707_4': '',
      '1708_4': '',
      '1709_4': '',
      '1710_4': '',
      '1711_4': '',
      '1712_4': '',
      '1713_4': '',
      '1714_4': '',
      '1715_4': '',
      '1716_4': '',
      '1717_4': '',
      '1718_4': '',
      '1719_4': '',
      '1720_4': '',
      '1721_4': '',
      '1722_4': '',
      '1723_4': '',
      '1724_4': '',
      '1725_4': '',
      '1726_4': '',
      '1727_4': '',
      '1728_4': '',
      '1729_4': '',
      '1730_4': '',
      '1731_4': '',
      '1732_4': '',
      '1733_4': '',
      '1734_4': '',
      '1735_4': '',
      '1736_4': '',
      '1737_4': '',
      '1738_4': '',
      '1739_4': '',
      '1740_4': '',
      '1741_4': '',
      '1742_4': '',
      '1743_4': '',
      '1744_4': '',
      '1745_4': '',
      '1746_4': '',
      '1747_4': '',
      '1748_4': '',
      '1749_4': '',
      '1750_4': '',
      '1751_4': '',
      '1752_4': '',
      '1753_4': '',
      '1754_4': '',
      '1755_4': '',
      '1756_4': '',
      '1757_4': '',
      '1758_4': '',
      '1759_4': '',
      '1760_4': '',
      '1761_4': '',
      '1762_4': '',
      '1763_4': '',
      '1764_4': '',
      '1765_4': '',
      '1766_4': '',
      '1767_4': '',
      '1768_4': '',
      '1769_4': '',
      '1770_4': '',
      '1771_4': '',
      '1772_4': '',
      '1773_4': '',
      '1774_4': '',
    }

    let newbuilding_framestage_form = {
      '1055': '',
      '1056': '',
      '1057': '',
      '1058': '',
      '1059': '',
      '1060': '',

      '1235': '',
      '1236': '',
      '1237': '',
      '1238': '',
      '1239': '',
      '1240': '',

      '1163': '',
      '1164': '',
      '1165': '',
      '1166': '',
      '1167': '',
      '1168': '',

      'dwelling_type_1': '',
      'dwelling_type_2': '',
      'dwelling_additions': '',
      'dwelling_configuration': '',
      'main_construction': '',
      'footing_type': '',
      'plans': '',
      'plans_comment': '',
      'framestage_slab_recommendations_list': [],
      'walls_beams_recommendations_list': [],
      'roof_recommendations_list': []
    }

    let newbuilding_slabstage_form = {
      '1055': '',
      '1056': '',
      '1057': '',
      '1058': '',
      '1059': '',
      '1060': '',

      'dwelling_type_1': '',
      'dwelling_type_2': '',
      'dwelling_additions': '',
      'dwelling_configuration': '',
      'main_construction': '',
      'footing_type': '',
      'plans': '',
      'plans_comment': '',
      'new_slab_recommendations_list': [],
      'preslab_services_recommendations_list': []
    }

    let newbuilding_completion_form = {
      '1055': '',
      '1056': '',
      '1057': '',
      '1058': '',
      '1059': '',
      '1060': '',
      'external_walling': '',
      'internal_walling': '',
      'dwelling_configuration': '',
      'windows': '',
      'roof': '',
      'year_built': '',
      'footing_type': '',
      'lockup_recommendations_list': [],
      'lockup_recommendations_internal_list': []
    }

    this.inspectiondetailsform = this.fb.group({
      'completed': '',
      'fversion': '',
      'forcesave': '',
      'bookingid': '',
      'rec_count': '',
      'type_1': '',
      'type_2': '',
      'bedrooms': '',
      'bathrooms': '',
      'ensuites': '',
      'car_park': '',
      'height': '',
      'building': '',
      'piers': '',
      'floor': '',
      'roof': '',
      'age': '',
      'weather': '',
      'access': '',
      'access_comment': ''
    });

    switch (this.reportType) {
      case this.insp_type_pre_purchase_building_inspection: {           //1
        AppUtils.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, services_connected_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_fitted_form);
      }
        break;
      case this.insp_type_pre_sale_building_inspection: {               //2
        AppUtils.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, services_connected_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_fitted_form);
      }
        break;
      case this.insp_type_pre_auction_building_inspection: {            //3
        AppUtils.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, services_connected_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_fitted_form);
      }
        break;
      case this.insp_type_asbestos_inspection: {                        //4
        //Not needed!!!
      }
        break;
      case this.insp_type_pest_and_termite_inspection: {                //5
        AppUtils.addControlsToForm(this.inspectiondetailsform, visual_timber_pest_inspection_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
      }
        break;
      case this.insp_type_building_and_pest_inspection: {               //6
        AppUtils.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, services_connected_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_fitted_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, visual_timber_pest_inspection_form);
      }
        break;
      case this.insp_type_dilapidation_inspection: {                    //7
        AppUtils.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, services_connected_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_fitted_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, visual_timber_pest_inspection_form);

      }
        break;
      case this.insp_type_owner_buildin_inspection_137b: {              //8
        //Not available!!!
      }
        break;
      case this.insp_type_new_building_inspection_slab_stage: {         //9
        AppUtils.addControlsToForm(this.inspectiondetailsform, newbuilding_slabstage_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);

      }
        break;
      case this.insp_type_new_building_inspection_frame_stage: {        //10
        AppUtils.addControlsToForm(this.inspectiondetailsform, newbuilding_framestage_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);

      }
        break;
      case this.insp_type_new_building_inspection_lockup_stage: {       //11
        AppUtils.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, newbuilding_completion_form);
      }
        break;
      case this.insp_type_new_building_inspection_completion_stage: {   //12
        AppUtils.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, services_connected_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        AppUtils.addControlsToForm(this.inspectiondetailsform, smoke_detectors_fitted_form);
      }
        break;
      case this.insp_type_new_building_inspection_4_stages_package: {   //13
        //Not available!!!
      }
        break;
      default: {

      }
    }
  }

  formsMapper = {
    'visual_building_inspection_form': [1, 2, 3, 6, 12],
    'services_connected_form': [1, 2, 3, 6, 12],
    'smoke_detectors_form': [1, 2, 3, 5, 6, 12],
    'furnished_form': [1, 2, 3, 5, 6, 7, 12],
    'extension_form': [1, 2, 3, 5, 6, 7],
    'smoke_detectors_fitted_form': [1, 2, 3, 6],
    'visual_timber_pest_inspection_form': [5, 6],
    'dilapidation_inspection_form': [7],
    'building_age': [12],
    'new_building_slab_stage_form': [9],
    'new_building_frame_stage_form': [10],
    'pest_termite_form': [5],
    'new_building_completion_stage_form': [11]
  }

  isFormDisplay(formSection) {
    let sectionArr: Array<number> = this.formsMapper[formSection];
    if (sectionArr) {
      if (sectionArr.includes(this.reportType)) {
        return true;
      }
    }
    return false;
  }

  addControlsToForm(form: FormGroup, controls: {}) {
    Object.entries(controls).forEach(([key, value]) => {
      if (value instanceof Array) {
        form.addControl(key, new FormArray([]));
      } else {
        form.addControl(key, new FormControl(value));
      }
    });
  }

  getRecommendationControls(inspectiondetailsform, recommendationType) {
    return inspectiondetailsform.get(recommendationType).controls;
  }

  onAddRecommendations(recommendationType, typee) {
    let len = new Date().getTime();
    let typeeLower = (<string>typee).toLowerCase();
    let fileName = 'rec-file-' + typeeLower + '-' + len;
    let itemValue = this.getRecommendationItemValue(recommendationType);

    let recType = '-';
    let recDetails = '-';
    let isquickitem = false;
    let optionId = '';
    if (this.recommQuickAddMode) {
      recType = this.recommQuickAddCurrentCheckItem.recType;
      recDetails = this.recommQuickAddCurrentCheckItem.recDetails;
      optionId = this.recommQuickAddCurrentCheckItem.id;
      isquickitem = true;
    }

    (<FormArray>this.inspectiondetailsform.get(recommendationType)).push(new FormGroup({
      'item': new FormControl(itemValue),
      'rectype': new FormControl(recType),
      'recdetail': new FormControl(recDetails),
      'comment': new FormControl(''),
      'typee': new FormControl(typee),
      'filename': new FormControl(fileName),
      'isquickitem': new FormControl(isquickitem),
      'id': new FormControl(optionId)
    }));
  }

  onAddRecommendationsQuick(recommendationType, typee, recType, recDetail, id) {
    let len = new Date().getTime();
    let typeeLower = (<string>typee).toLowerCase();
    let fileName = 'rec-file-' + typeeLower + '-' + len;
    let itemValue = this.getRecommendationItemValue(recommendationType);

    (<FormArray>this.inspectiondetailsform.get(recommendationType)).push(new FormGroup({
      'item': new FormControl(itemValue),
      'rectype': new FormControl(recType),
      'recdetail': new FormControl(recDetail),
      'comment': new FormControl(''),
      'typee': new FormControl(typee),
      'filename': new FormControl(fileName),
      'isquickitem': new FormControl(true),
      'id': new FormControl(id)
    }));
  }

  getRecommendationItemValue(recommendationType: string) {
    let item = '-';
    if (recommendationType != null) {
      switch (recommendationType) {
        case 'hallways_recommendations_list': {
          item = 'Hallways and General Living Spaces';
        }
          break;
        case 'kitchen_recommendations_list': {
          item = 'Kitchen';
        }
          break;
        case 'laundry_recommendations_list': {
          item = 'Laundry';
        }
          break;
        case 'bedrooms_recommendations_list': {
          item = 'Bedrooms';
        }
          break;
        case 'bathrooms_recommendations_list': {
          item = 'Bathrooms';
        }
          break;
        case 'ensuite_recommendations_list': {
          item = 'Ensuite';
        }
          break;
        case 'external_recommendations_list': {
          item = 'External';
        }
          break;
        case 'internal_recommendations_list': {
          item = 'Internal';
        }
          break;
        case 'timberpest_recommendations_list': {
          item = 'Timber Pest - Findings and Recommendations';
        }
          break;
        case 'framestage_slab_recommendations_list': {
          item = 'Sub Floor/Slab';
        }
          break;
        case 'lockup_recommendations_list': {
          item = 'External';
        }
          break;
        case 'lockup_recommendations_internal_list': {
          item = 'Internal';
        }
          break;
        case 'roof_recommendations_list': {
          item = 'Roof';
        }
          break;
        case 'walls_beams_recommendations_list': {
          item = 'Walls and Structural Beams';
        }
          break;
        case 'new_slab_recommendations_list': {
          item = 'Pre-Slab';
        }
          break;
        case 'preslab_services_recommendations_list': {
          item = 'Services';
        }
          break;
      }
    }

    return item;
  }

  //Save on file upload complete
  onUploadComplete($event) {
    if (!this.formSaving) {
      this.onSave(false, true);
    } else {
      this.isFormDirty = true;
    }
  }

  onDeleteRecommendations($event, recommendationType, i) {
    let delKey = null;
    if ($event.target.closest('.card-body')) {
      if ($event.target.closest('.card-body').querySelector('input[formcontrolname="filename"]')) {
        delKey = $event.target.closest('.card-body').querySelector('input[formcontrolname="filename"]').value;
      }
    }
    this.fileUploadProgressService.removeMapItem(delKey);
    (<FormArray>this.inspectiondetailsform.get(recommendationType)).removeAt(i);
  }

  showForceSaveWindow() {
    let element: HTMLElement = document.getElementById('forceSaveWarningButton') as HTMLElement;
    element.click();
  }

  onSave(isExit, isQuickSave) {
    this.formSaveMsg = '';
    this.isFormSaveErr = false;
    this.isFormQuickSave = isQuickSave;

    if (this.formSaving == true) {
      return;
    }

    this.formSaving = true;
    this.addReportSub = this.httpService.addReport(this.inspectiondetailsform.value).subscribe(
      (response: Response) => {
        if (response['forcesave'] && response['forcesave'] == 'true') {
          this.inspectiondetailsform.patchValue({ 'forcesave': response['forcesave'] });
          this.inspectionDetailsService.setSaveTypes(isExit, isQuickSave);
          this.isFormDirty = false;
          this.formSaving = false;
          this.isFormSaveErr = false;
          this.formSaveMsg = '';

          this.showForceSaveWindow();
        } else {
          this.inspectiondetailsform.patchValue({ 'fversion': response['fversion'] });
          this.inspectiondetailsform.patchValue({ 'forcesave': 'false' });

          this.formSaveMsg = response['message'];
          this.formSaveMsgType = response['type'];

          this.isFormDirty = false;
          this.formSaving = false;
          if (this.formSaveMsgType == 'failure') {
            this.isFormSaveErr = true;
          } else {
            this.isFormSaveErr = false;
          }

          if (isExit) {
            this.formSaveMsg = '';
            this.isFormSaveErr = false;
            this.router.navigate(['mycalendar']);
          } else {
            setTimeout(() => {
              this.formSaveMsg = '';
              this.isFormSaveErr = false;
            }, 3000);
          }
        }
      },
      (error) => {
        this.formSaveMsg = error['message'];
        this.isFormDirty = false;
        this.formSaving = false;
        this.isFormSaveErr = true;

        if (isExit) {
          this.formSaveMsg = '';
          this.isFormSaveErr = false;
          this.router.navigate(['mycalendar']);
        } else {
          setTimeout(() => {
            this.formSaveMsg = '';
            this.isFormSaveErr = false;
          }, 3000);
        }
      });
  }

  onCancel() {
    this.onSave(true, false);
    //this.router.navigate(['mycalendar']);
  }

  onCloseMsg() {
    this.formSaveMsg = '';
  }

  //Complete Form
  onFormComplete() {
    // console.log('onFormComplete');
    let element: HTMLElement = document.getElementById('completeReportWarningButton') as HTMLElement;
    element.click();
  }

  @ViewChild('inspDtlFieldSet') inspDtlFieldSet: ElementRef;
  formComplete(status, onLoading) {
    // console.log('formComplete');
    if (status === 'true') {
      if (this.isAdmin !== true) {
        this.adminCompleted = false;
        this.inspDtlFieldSet.nativeElement.disabled = !this.inspDtlFieldSet.nativeElement.disabled;
      } else {
        this.adminCompleted = true;
      }
      if (!onLoading) {
        this.inspectiondetailsform.patchValue({ 'completed': 'completed' });
        this.onSave(false, true);
      }
    } else {
      this.adminCompleted = false;
      if (!onLoading) {
        this.inspectiondetailsform.patchValue({ 'completed': '' });
        this.onSave(false, true);
      }
    }
  }

  removeRecommsFromCurrentList() {
    this.removeRecommendationsFromCurrentList(this.recommQuickAddCurrentCheckItem.recommId);
  }

  keepRecommsFromCurrentList() {
    let formCtrlArray = (<FormArray>this.inspectiondetailsform.get(this.recommQuickAddCurrentCheckItem.recommType)).controls;
    if (formCtrlArray && formCtrlArray.length > 0) {
      formCtrlArray.forEach((elem) => {
        if (elem && elem.value) {
          this.checkAndSetQuickItemValue(elem);
        }
      });
    }
  }

  checkAndSetQuickItemValue(currelem) {
    // console.log(currelem);
    let reccomKey = this.getKeyForRecommendationObject(currelem);
    let currRecommKey = this.getKeyForCurrentRecommendationSelected();

    if ((currRecommKey != null) && (reccomKey != null) && (currRecommKey === reccomKey)) {
      currelem.value.isquickitem = false;
    }
  }

  //Show Recommendations
  showRecommendations(event, recommId, recommType_short, id, itemType, itemValue, recommType, typee) {
    this.recommQuickAddCurrentCheckItem = { id: id, recType: itemValue, recommType_short: recommType_short, recDetails: itemType, recommType: recommType, typee: typee, recommId: recommId };
    console.log(this.recommQuickAddCurrentCheckItem);

    //If already checked
    let currSetItem = this.inspectiondetailsform.get(this.recommQuickAddCurrentCheckItem.id);
    if (currSetItem && currSetItem.value === true) {
      this.recommQuickAddMode = false;
      this.onClickRemoveQuickRecommendations();
      return;
    } else {
      this.recommQuickAddMode = true;
    }

    this.showPopupOverlay();
    if (!this.hasRecommendationAddedForItem(recommId)) {
      this.onAddRecommendationsQuick(recommType, typee, this.recommQuickAddCurrentCheckItem.recType, this.recommQuickAddCurrentCheckItem.recDetails, this.recommQuickAddCurrentCheckItem.id);
    }

    setTimeout(() => {
      AppUtils.moveToPosition(event.target, recommId);
    }, 0);
  }

  getKeyForRecommendationObject(recommObj) {
    let key = null;
    if (recommObj && recommObj.value) {
      key = recommObj.value.typee + "_" + recommObj.value.item + "_" + recommObj.value.recdetail + "_" + recommObj.value.rectype + "_" + recommObj.value.id;
      if (key) {
        key = key.replace(/\s+/g, '');
        key = key.toLowerCase();
      }
    }
    return key;
  }

  getKeyForCurrentRecommendationSelected() {
    let key = null;
    let reccommUcrrentItem = this.recommQuickAddCurrentCheckItem;
    if (reccommUcrrentItem) {
      key = reccommUcrrentItem.typee + "_" + reccommUcrrentItem.recommType_short + "_" + reccommUcrrentItem.recDetails + "_" + reccommUcrrentItem.recType + "_" + reccommUcrrentItem.id;
      if (key) {
        key = key.replace(/\s+/g, '');
        key = key.toLowerCase();
      }
    }
    return key;
  }

  displayCurrRecommendation(recommObj, recommType) {
    if (this.recommQuickAddMode) {
      if (this.recommQuickAddCurrentCheckItem && this.recommQuickAddCurrentCheckItem.recommType !== recommType) {
        return true;
      }

      let reccomKey = null;
      let currRecommKey = null;

      reccomKey = this.getKeyForRecommendationObject(recommObj);
      currRecommKey = this.getKeyForCurrentRecommendationSelected();

      // console.log("reccomKey " + reccomKey, "currRecommKey " + currRecommKey);

      if ((currRecommKey != null) && (reccomKey != null) && (currRecommKey === reccomKey)) {
        AppUtils.toggleDisableSelectElements(true, "select", this.recommQuickAddCurrentCheckItem.recommId);
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  hasRecommendationAddedForItem(recommId) {
    let recommList = document.querySelector('#' + recommId);
    if (recommList) {
      let currKey = this.getKeyForCurrentRecommendationSelected();
      let recomms: NodeListOf<HTMLElement> = recommList.querySelectorAll('.closequickadded');
      for (let i = recomms.length - 1; i >= 0; i--) {
        if ((recomms[i]) && recomms[i].classList.contains(currKey)) {
          return true;
        }
      }
    }
    return false;
  }

  removeRecommendationsFromCurrentList(recommId) {
    let recommList = document.querySelector('#' + recommId);
    if (recommList) {
      let recomms: NodeListOf<HTMLElement> = recommList.querySelectorAll('.closequickadded');
      for (let i = recomms.length - 1; i >= 0; i--) {
        if ((recomms[i]) && recomms[i].classList.contains(this.getKeyForCurrentRecommendationSelected())) {
          recomms[i].click();
        }
      }
    }
  }

  onRecommQuickViewCancel(recommId) {
    this.recommQuickAddMode = false;
    this.removeRecommendationsFromCurrentList(recommId);

    let currSetItem = this.inspectiondetailsform.get(this.recommQuickAddCurrentCheckItem.id);
    if (currSetItem) {
      currSetItem.setValue(false);
    }

    this.recommQuickAddCurrentCheckItem = null;
    AppUtils.resetPosition(recommId);

    this.hidePopupOverlay();
  }

  onRecommQuickViewOk(recommId) {
    this.recommQuickAddMode = false;
    this.recommQuickAddCurrentCheckItem = null;

    AppUtils.toggleDisableSelectElements(false, "select", recommId);
    AppUtils.resetPosition(recommId);
    this.hidePopupOverlay();
  }

  showPopupOverlay() {
    this.popupOverlay = true;
  }

  hidePopupOverlay() {
    this.popupOverlay = false;
  }

  onClickRemoveQuickRecommendations() {
    let element: HTMLElement = document.getElementById('removeQuickRecommendationsButton') as HTMLElement;
    element.click();
  }

  showCurrItem(itemType, itemNumber: number) {
    let noOfEnsuites = this.inspectiondetailsform.get(itemType).value;

    if (itemNumber <= AppUtils.getNumberForItemValue(noOfEnsuites)) {
      return true;
    }
    return false;
  }
}