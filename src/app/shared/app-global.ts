export class AppGlobal {
    // public static API_ENDPOINT = 'https://apbi.com.au/inspector-app/';
    // public static API_ENDPOINT = 'http://34.251.200.88:8080/inspector-app/';
    // public static API_ENDPOINT = 'http://localhost:8080/inspector-app/';

    public static API_ENDPOINT = 'https://apbi.com.au/inspector-app/';
    public static DOMAIN_ENDPOINT = 'https://apbi.com.au/';


    public static FILE_UPLOAD_ACTION = 'cpUploadImageAppv2';
    public static APP_STATUS_ACTION = 'cpLiveApp';
    public static CALENDAR_FEED_ACTION = 'cpBookingCalendarFeedAppv2';
    public static INSP_DTL_PREVIEW_ACTION = 'cpInspectionDetailsAppv2';
    public static LOAD_FORMDATA_ACTION = 'cpLoadFormDataAppv2';
    public static ADD_REPORT_ACTION = 'cpAddReportv2';
    public static IMG_PREVIEW_ACTION = 'cpRepImgv2';
    public static LOGIN_ACTION = 'appLogin';
    public static USER_AVATAR_URL = AppGlobal.DOMAIN_ENDPOINT + "controlPanel/profileImage?image=";

    //Image upload width and height
    public static UPLOAD_IMG_WIDTH = 800;
    public static UPLOAD_IMG_HEIGHT = 10000; //Keep aspect ratio

    //ReportIDs
    public static INSP_TYPE_PRE_PURCHASE_BUILDING_INSPECTION = 1;              //Pre-Purchase Building Inspection
    public static INSP_TYPE_PRE_SALE_BUILDING_INSPECTION = 2;                  //Pre-Sale Building Inspection
    public static INSP_TYPE_PRE_AUCTION_BUILDING_INSPECTION = 3;               //Pre-Auction Building Inspection
    public static INSP_TYPE_ASBESTOS_INSPECTION = 4;                           //Asbestos Inspection
    public static INSP_TYPE_PEST_AND_TERMITE_INSPECTION = 5;                   //Pest & Termite Inspection
    public static INSP_TYPE_BUILDING_AND_PEST_INSPECTION = 6;                  //Building & Pest Inspection
    public static INSP_TYPE_DILAPIDATION_INSPECTION = 7;                       //Dilapidation Inspection
    public static INSP_TYPE_OWNER_BUILDIN_INSPECTION_137B = 8;                 //Owner Buildin Inspection 137B
    public static INSP_TYPE_NEW_BUILDING_INSPECTION_SLAB_STAGE = 9;            //New Building Inspection - Slab Stage
    public static INSP_TYPE_NEW_BUILDING_INSPECTION_FRAME_STAGE = 10;          //New Building Inspection - Frame Stage
    public static INSP_TYPE_NEW_BUILDING_INSPECTION_LOCKUP_STAGE = 11;         //New Building Inspection - Lockup Stage
    public static INSP_TYPE_NEW_BUILDING_INSPECTION_COMPLETION_STAGE = 12;     //New Building Inspection - Completion Stage
    public static INSP_TYPE_NEW_BUILDING_INSPECTION_4_STAGES_PACKAGE = 13;     //New Building Inspection - 4 Stages Package
    public static INSP_TYPE_WARRANTY_DEFECT_INSPECTION = 14;                   //Warranty (defect) inspection


    //Messages
    public static MSG_SERVER_MAINTENANCE = 'The server may be undergoing maintenance, or you may be experiencing a network interruption. Please try again later.';


    //Recommendations Options
    public static TimberPest: string[] = [
        "Dwelling",
        "Interior",
        "Windows",
        "Door Frames",
        "Roof Cavity",
        "Sub Floor",
        "Garage/Carport",
        "Fence line",
        "Grounds",
        "Retaining Walls",
        "Garden Borders",
        "Pergola",
        "Deck",
        "Outbuildings"
    ];

    public static Hallways: string[] = [
        "Floor",
        "Walls",
        "Ceiling",
        "Doors",
        "Windows",
        "Fireplace",
        "Heater",
        "Stairs",
        "Balustrade"
    ];

    public static Kitchen: string[] = [
        "Floor",
        "Walls",
        "Ceiling",
        "Ground Cabinets",
        "Overhead Cabinets",
        "Benchtops",
        "Drawers",
        "Sink",
        "Sink Mixer",
        "Oven",
        "Range Hood",
        "Dishwasher",
        "Sealants",
        "Windows",
        "Doors",
        "Tile or Glass",
        "Ventilation"
    ];

    public static Laundry: string[] = [
        "Doors",
        "Floor",
        "Walls",
        "Ceiling",
        "Trough/Sink",
        "Taps",
        "Cabinets",
        "Sealants",
        "Windows",
        "Exhaust Fans",
        "Ventilation"
    ];

    public static Bedrooms: string[] = [
        "Floor",
        "Walls",
        "Ceiling",
        "Robes",
        "Windows",
        "Doors",
        "Smoke Detectors"
    ];

    public static Bathrooms: string[] = [
        "Shower Recess",
        "Bath",
        "Floor",
        "Walls",
        "Ceiling",
        "Breech Combo",
        "Bath Outlet",
        "Shower Screen",
        "Cabinets",
        "Mirrors",
        "Exhaust Fan",
        "IXL Tastic",
        "Sealants",
        "Basins",
        "Mixer Taps",
        "Shower Rose",
        "Windows",
        "Doors",
        "Toilet Roll Holder",
        "Towel Rail",
        "Toilet",
        "Ventilation"
    ];

    public static Internal: string[] = [
        "Entry/Hallway",
        "Lounge Room",
        "Family Room",
        "Kitchen",
        "Bedroom 1",
        "Bedroom 2",
        "Bedroom 3",
        "Bedroom 4",
        "Bathrooms",
        "Ensuite",
        "Laundry",
        "Stairs",
        "Handrails",
        "Doors",
        "Windows",
        "Ceiling"
    ];

    public static Ensuite: string[] = [
        "Shower Recess",
        "Bath",
        "Floor",
        "Walls",
        "Ceiling",
        "Breech Combo",
        "Bath Outlet",
        "Shower Screen",
        "Cabinets",
        "Mirrors",
        "Exhaust Fan",
        "IXL Tastic",
        "Sealants",
        "Basins",
        "Mixer Taps",
        "Shower Rose",
        "Windows",
        "Doors",
        "Toilet Roll Holder",
        "Towel Rail",
        "Toilet",
        "Ventilation"
    ];

    public static External: string[] = [
        "Driveways and Paths",
        "Walls",
        "Expansion joints",
        "Windows",
        "Window Placement",
        "Doors",
        "Fascia",
        "Eaves",
        "Flashings",
        "Roof",
        "Skylights",
        "Vents",
        "Valleys",
        "Down Pipes",
        "Drainage",
        "Pointing",
        "Gutters",
        "Chimney",
        "Sub Floor Ventilation",
        "Deck",
        "Pergola",
        "Porch",
        "Balcony",
        "Steps",
        "Handrails",
        "Roof Space",
        "Stumps",
        "Retaining Walls",
        "Garage/Car Port"
    ];

    public static Internal_delap: string[] = [
        "Entry/Hallway",
        "Lounge Room",
        "Family Room",
        "Dining Room",
        "Kitchen",
        "Bedroom 1",
        "Bedroom 2",
        "Bedroom 3",
        "Bedroom 4",
        "Bathrooms",
        "Ensuite",
        "Laundry",
        "Stairs",
        "Handrails"
    ];

    public static FrameStage_subfloor_slab: string[] = [
        "Slab",
        "Floor Height",
        "Stumps",
        "Bearers",
        "Joists",
        "Clearance",
        "Ant Capping for brick piers/termite protection for slabs",
        "Subfloor Ventilation",
        "Footings"
    ];

    public static FrameStage_walls_beams: string[] = [
        "Setout",
        "Walls",
        "Windows",
        "Door Openings",
        "Plumb",
        "Support Points",
        "Lintels",
        "Beams",
        "Joists",
        "Brackets Fixings",
        "Bracing",
        "Flashing",
        "Plumbing",
        "Electrical",
        "Tie Down Straps",
        "Weep Holes",
        "Cavity Columns"
    ];

    public static FrameStage_roof: string[] = [
        "Trusses/Layout",
        "Bracing",
        "Brackets Fixings",
        "Support Points",
        "Joists",
        "Triple L Grips",
        "Fascia",
        "Gutters",
        "Collar Ties/Rafters",
        "Roof Members",
        "Roof Cladding",
        "Underpurlins",
        "Roof Beams",
        "Strapping"
    ];

    public static Lockup_external: string[] = [
        "Roof",
        "External Walls",
        "Windows",
        "Doors",
        "Fascia",
        "Gutters",
        "Downpipes",
        "Eaves",
        "Flashings"
    ];

    public static Lockup_internal: string[] = [
        "Internal Walls",
        "Ceilings",
        "Waterproofing",
        "Insulation",
        "Plumbing",
        "Electrical"
    ];

    public static Pre_slab: string[] = [
        "Build Orientation",
        "Site Gradient",
        "General Soil Type",
        "Footings",
        "Piers",
        "Damp-proofing Membrane",
        "Steel Placement & Fixing",
        "Steel Sizing/Lapping",
        "Trench Mesh & Steel Reinforcing"
    ];

    public static Pre_floor: string[] = [
        "Build Orientation",
        "Site Gradient",
        "Footings",
        "Piers/Stumps",
        "Foundation walls",
        "Damp proof course",
        "Bearers",
        "Joists",
        "Blocking",
        "Fixings"
    ];

    public static Pre_slab_services: string[] = [
        "Drainage",
        "Plumbing",
        "Electrical",
        "Electrical Meter Box",
        "Storm Water Pipe System",
        "Termite Protection/Barrier"
    ];

    // public static Internal_delap: string[] = [
    //     "Slab",
    //     "Floor Height",
    //     "Stumps",
    //     "Bearers",
    //     "Joists",
    //     "Clearance",
    //     "Ant Capping for brick piers/termite protection for slabs",
    //     "Subfloor Ventilation",
    //     "Setout",
    //     "Walls",
    //     "Windows",
    //     "Door Openings",
    //     "Plumb",
    //     "Support Points",
    //     "Lintels",
    //     "Beams",
    //     "Brackets Fixings",
    //     "Bracing",
    //     "Flashing",
    //     "Plumbing",
    //     "Electrical",
    //     "Trusses/Layout",
    //     "Triple L Grips",
    //     "Fascia",
    //     "Gutters",
    //     "Collar Ties/Rafters",
    //     "Roof Members",
    //     "Roof Cladding"
    // ];
}