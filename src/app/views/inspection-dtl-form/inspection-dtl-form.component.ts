import { Component, OnInit, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
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


  @ViewChildren(TabIndexDirective) tabs : QueryList<TabIndexDirective>;

  ngAfterViewInit(): void {
    this.appServeiceLoadStatusService.setTabQueryList(this.tabs);
    AppUtils.breadcrumbWidthHandler(true, false);    
  }

  constructor(private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private inspectionDetailsService: InspectionDetailsService, 
    private router: Router, private httpService: HTTPService, 
    private fileUploadProgressService: FileUploadProgressService, 
    private appServeiceLoadStatusService :AppServeiceLoadStatusService) {

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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
            'filename': new FormControl()
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
      'structural_defects_comment': ''
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
      'fversion': '',
      'bookingid': '',
      'rec_count': '',
      'type_1': '',
      'type_2': '',
      'bedrooms': '',
      'bathrooms': '',
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
        this.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        this.addControlsToForm(this.inspectiondetailsform, services_connected_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        this.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_fitted_form);
      }
        break;
      case this.insp_type_pre_sale_building_inspection: {               //2
        this.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        this.addControlsToForm(this.inspectiondetailsform, services_connected_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        this.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_fitted_form);
      }
        break;
      case this.insp_type_pre_auction_building_inspection: {            //3
        this.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        this.addControlsToForm(this.inspectiondetailsform, services_connected_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        this.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_fitted_form);
      }
        break;
      case this.insp_type_asbestos_inspection: {                        //4
        //Not needed!!!
      }
        break;
      case this.insp_type_pest_and_termite_inspection: {                //5
        this.addControlsToForm(this.inspectiondetailsform, visual_timber_pest_inspection_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        this.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
      }
        break;
      case this.insp_type_building_and_pest_inspection: {               //6
        this.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        this.addControlsToForm(this.inspectiondetailsform, services_connected_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        this.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_fitted_form);
        this.addControlsToForm(this.inspectiondetailsform, visual_timber_pest_inspection_form);
      }
        break;
      case this.insp_type_dilapidation_inspection: {                    //7
        this.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        this.addControlsToForm(this.inspectiondetailsform, services_connected_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        this.addControlsToForm(this.inspectiondetailsform, furnished_and_extension_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_fitted_form);
        this.addControlsToForm(this.inspectiondetailsform, visual_timber_pest_inspection_form);

      }
        break;
      case this.insp_type_owner_buildin_inspection_137b: {              //8
        //Not available!!!
      }
        break;
      case this.insp_type_new_building_inspection_slab_stage: {         //9
        this.addControlsToForm(this.inspectiondetailsform, newbuilding_slabstage_form);
        this.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);

      }
        break;
      case this.insp_type_new_building_inspection_frame_stage: {        //10
        this.addControlsToForm(this.inspectiondetailsform, newbuilding_framestage_form);
        this.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);

      }
        break;
      case this.insp_type_new_building_inspection_lockup_stage: {       //11
        this.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        this.addControlsToForm(this.inspectiondetailsform, newbuilding_completion_form);
      }
        break;
      case this.insp_type_new_building_inspection_completion_stage: {   //12
        this.addControlsToForm(this.inspectiondetailsform, visual_building_inspection_form);
        this.addControlsToForm(this.inspectiondetailsform, services_connected_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_form);
        this.addControlsToForm(this.inspectiondetailsform, smoke_detectors_fitted_form);
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
    'furnished_and_extension_form': [1, 2, 3, 5, 6, 7],
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

    (<FormArray>this.inspectiondetailsform.get(recommendationType)).push(new FormGroup({
      'item': new FormControl(itemValue),
      'rectype': new FormControl('-'),
      'recdetail': new FormControl('-'),
      'comment': new FormControl(''),
      'typee': new FormControl(typee),
      'filename': new FormControl(fileName)
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
          this.inspectionDetailsService.setSaveTypes(isExit, isQuickSave);
          this.isFormDirty = false;
          this.formSaving = false;
          this.isFormSaveErr = false;
          this.formSaveMsg = '';

          this.showForceSaveWindow();
        } else {
          this.inspectiondetailsform.patchValue({'fversion' : response['fversion']});

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
}