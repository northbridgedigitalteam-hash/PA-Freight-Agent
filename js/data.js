// ============================================
// FREIGHT ASSISTANT - PERISHABLE COMMODITY DATABASE
// South African Export Focus - Citrus First
// ============================================

// Citrus Database - Starting with your most frequent shipments
const commodities = [
    {
        // ========== ORANGES ==========
        id: "citrus_oranges",
        hs_code: "080510",
        hs_chapter: "08",
        hs_description: "Oranges, fresh or dried",
        
        // Names
        common_name: "Oranges",
        scientific_name: "Citrus × sinensis",
        afrikaans_name: "Lemoene",
        varieties: ["Navel", "Valencia", "Cara Cara", "Blood Orange"],
        trade_names: ["Export Oranges", "Table Oranges"],
        
        // Category & Type
        category: "fruit",
        subcategory: "citrus",
        perishability_level: "High",
        ethylene_production: "Low",
        ethylene_sensitivity: "High",
        
        // PPECB YELLOW CARD DATA - CRITICAL
        ppecb: {
            yellow_card_ref: "CT-SO-001",
            protocol_version: "v4.2 (2024)",
            loading_protocol: "Pre-cooled containers mandatory",
            inspection_points: ["Orchard", "Packhouse", "Load-out"],
            certification: ["Phytosanitary", "Cold Treatment", "Origin"],
            notes: "Palletized loading only - no bulk"
        },
        
        // TEMPERATURE & STORAGE - PPECB STANDARDS
        temperature: {
            pulp_temp_range: "2-4°C",
            transit_temp: "2-4°C",
            storage_temp: "2-4°C",
            humidity: "85-90% RH",
            max_storage_days: "8-12 weeks",
            chilling_injury_threshold: "<2°C",
            heat_damage_threshold: ">25°C",
            respiration_rate: "Low"
        },
        
        // TREATMENTS BY DESTINATION - PPECB REQUIREMENTS
        treatments: {
            "EU": {
                required: "Cold Treatment",
                protocol: "16 days continuous at ≤2.2°C",
                pulp_temp: "≤2.2°C before treatment",
                pre_cooling: "MANDATORY - Pulp ≤5°C before loading",
                documentation: ["Phytosanitary", "Cold Treatment Certificate", "TRACES-NT"],
                pp_ref: "EU CT Protocol Annex IV",
                notes: "Fruit must be free from frost. 5 probe placement required.",
                inspectors: ["PPECB Approved", "EUREPGAP certified"]
            },
            "USA": {
                required: "Cold Treatment OR Fumigation",
                protocol: "Option 1: 22 days at ≤0°C OR Option 2: 24 days at ≤1.1°C",
                pulp_temp: "≤3.3°C for cold treatment",
                pre_cooling: "RECOMMENDED - Pulp ≤7°C before loading",
                documentation: ["Phytosanitary", "Treatment Certificate", "APHIS Permit"],
                pp_ref: "USDA 7CFR 319",
                notes: "Methyl Bromide fumigation alternative available",
                inspectors: ["PPECB Approved", "USDA accredited"]
            },
            "China": {
                required: "Cold Treatment",
                protocol: "18 days at ≤1.1°C",
                pulp_temp: "≤4°C before treatment",
                pre_cooling: "MANDATORY - Pulp ≤7°C before loading",
                documentation: ["Phytosanitary", "Cold Treatment Certificate", "GACC Approval"],
                pp_ref: "GACC Protocol SA-CT-001",
                notes: "Pre-inspection by Chinese officials required",
                inspectors: ["PPECB", "GACC Approved"]
            },
            "Middle East": {
                required: "Cold Treatment (recommended) OR No Treatment",
                protocol: "14 days at ≤2°C (if treating)",
                pulp_temp: "≤5°C",
                pre_cooling: "RECOMMENDED",
                documentation: ["Phytosanitary", "Health Certificate"],
                pp_ref: "GCC Standard 1234",
                notes: "Treatment not always required - check import permit",
                inspectors: ["PPECB"]
            },
            "Japan": {
                required: "Fumigation (MB) + Cold Treatment",
                protocol: "Fumigation + 18 days at ≤2°C",
                pulp_temp: "≤2°C",
                pre_cooling: "MANDATORY",
                documentation: ["Phytosanitary", "Fumigation Certificate", "MAFF Approval"],
                pp_ref: "MAFF Plant Protection Act",
                notes: "Most stringent protocol - dual treatment required",
                inspectors: ["PPECB", "JICA Approved"]
            }
        },
        
        // QUALITY STANDARDS
        quality: {
            sizing: {
                standard: "Count per 15kg carton",
                grades: ["56", "72", "88", "100", "113", "138", "163"],
                sizing_method: "Diameter in mm",
                tolerance: "±5mm per size"
            },
            brix: {
                minimum: "10.5° Brix",
                optimum: "12-14° Brix",
                acid_ratio: "8:1 to 14:1",
                maturity_index: "Color break ≥30%"
            },
            defects: {
                max_total: "5%",
                max_decay: "1%",
                max_mechanical: "3%",
                skin_requirements: "Smooth, no blemishes >2cm",
                color: "Minimum 30% blush (except green permitted varieties)"
            },
            packaging: {
                primary: "15kg telescopic carton",
                internal: "Tissue wrap or tray pack",
                palletization: "Euro pallet - 96 cartons",
                marking: "HS code, variety, count, grower code"
            }
        },
        
        // SEASONALITY - SA SPECIFIC
        seasonality: {
            northern_hemisphere: "May to November",
            southern_hemisphere: "November to April",
            peak_months: ["June", "July", "August"],
            regions: ["Eastern Cape", "Limpopo", "Mpumalanga", "Western Cape"],
            harvest_windows: {
                "Navel": "May - September",
                "Valencia": "July - November",
                "Midknight": "June - October"
            }
        },
        
        // SHIPPING SPECIFICS
        shipping: {
            container_type: "40' High Cube Reefer",
            pallet_config: "Euro (120x80cm) - 10 high",
            cartons_per_container: "960-1000",
            weight_per_container: "14.5-15 tons",
            loading_notes: "Load pre-cooled fruit only. Monitor pulp temps during load.",
            ventilation: "25% open, air circulation front to back",
            stowage: "Away from heat sources. No mixed loads with ethylene producers."
        },
        
        // SPECIAL NOTES
        special_notes: [
            "CITRUS BLACK SPOT (CBS) sensitive - maintain strict orchard protocols",
            "Post-harvest fungicide (Imazalil) treatment recommended",
            "No mixed loads with apples, bananas, or avocados",
            "Record pulp temperatures hourly during loading",
            "Cold room holding before loading max 48 hours"
        ],
        
        // RELATED CODES
        related_codes: [
            { code: "080520", description: "Mandarins, Clementines" },
            { code: "080540", description: "Grapefruit" },
            { code: "080550", description: "Lemons and Limes" }
        ]
    },
    
    // ========== TEMPLATE FOR NEXT COMMODITY ==========
    // We'll add Grapefruit, Soft Citrus, Lemons here next
    {
        id: "citrus_grapefruit",
        hs_code: "080540",
        hs_chapter: "08",
        hs_description: "Grapefruit, fresh",
        common_name: "Grapefruit",
        scientific_name: "Citrus × paradisi",
        category: "fruit",
        subcategory: "citrus",
        // ... (Will complete after oranges is working)
        treatments: {}
    }
];

// Carrier Information (Keep this from before)
const carriers = {
    "MSC": {
        si_cutoff_days: 3,
        perishable_docs: ["SI", "BL Draft", "Phytosanitary Copy", "Treatment Certificate"],
        contact: "si.capetown@msc.com",
        phone: "+27 21 123 4567",
        notes: "VGM submission 24h before loading. No fruit pulp >5°C at loading.",
        reefer_team: "reefers.za@msc.com"
    },
    "Maersk": {
        si_cutoff_days: 4,
        perishable_docs: ["SI", "VGM", "Export Declaration", "Treatment Certificates"],
        contact: "za.sidoc@maersk.com",
        phone: "+27 11 987 6543",
        notes: "Electronic BL only. Temperature settings must be set 48h pre-load.",
        reefer_team: "na.reefers@maersk.com"
    }
};

// Ports and Terminals
const ports = {
    "CPT": {
        name: "Cape Town",
        code: "ZACPT",
        terminals: {
            "DCT": "Dubai Ports Cape Town",
            "MCT": "Maersk Cape Town"
        },
        cold_stores: ["Fresh Produce Terminals", "Cool Carriers"],
        inspection_facilities: ["PPECB CPT Terminal", "Port Health"]
    },
    "DUR": {
        name: "Durban",
        code: "ZADUR",
        terminals: {
            "Pier 1": "Main Fruit Terminal",
            "Pier 2": "Multi-purpose"
        },
        cold_stores: ["Durban Cold Storage", "Transnet Perishables"],
        inspection_facilities: ["PPECB Durban", "Port Health Office"]
    }
};

// Destination Codes
const destinations = {
    "EU": {
        full_name: "European Union",
        includes: ["Netherlands", "UK", "Germany", "France", "Spain", "Italy"],
        entry_ports: ["Rotterdam", "Antwerp", "Southampton", "Bremerhaven"],
        clearance_time: "24-48 hours"
    },
    "ME": {
        full_name: "Middle East",
        includes: ["UAE", "Saudi Arabia", "Qatar", "Oman", "Kuwait"],
        entry_ports: ["Jebel Ali", "Dammam", "Doha", "Sohar"],
        clearance_time: "12-24 hours"
    },
    "FEA": {
        full_name: "Far East Asia",
        includes: ["China", "Japan", "South Korea", "Taiwan"],
        entry_ports: ["Shanghai", "Yokohama", "Busan", "Kaohsiung"],
        clearance_time: "48-72 hours"
    },
    "SEA": {
        full_name: "Southeast Asia",
        includes: ["Singapore", "Malaysia", "Thailand", "Vietnam", "Philippines"],
        entry_ports: ["Singapore", "Port Klang", "Bangkok", "Ho Chi Minh"],
        clearance_time: "24-48 hours"
    },
    "US": {
        full_name: "United States",
        includes: ["East Coast", "West Coast", "Gulf"],
        entry_ports: ["Philadelphia", "Wilmington", "Port Newark", "Long Beach"],
        clearance_time: "72+ hours (FDA inspection)"
    }
};

// PPECB Treatment Codes Reference
const ppecbTreatments = {
    "CT": {
        code: "CT",
        name: "Cold Treatment",
        description: "Low temperature exposure for pest disinfestation",
        applicable_commodities: ["All citrus", "Apples", "Grapes", "Stone fruit"],
        common_durations: ["16 days", "18 days", "22 days", "24 days"]
    },
    "FUM": {
        code: "FUM",
        name: "Fumigation",
        description: "Chemical treatment (Methyl Bromide/Phosphine)",
        applicable_commodities: ["Citrus", "Deciduous fruit", "Vegetables"],
        common_durations: ["2 hours", "4 hours", "24 hours"]
    },
    "VH": {
        code: "VH",
        name: "Vapor Heat",
        description: "Heat treatment for fruit fly",
        applicable_commodities: ["Mangoes", "Papayas", "Lychees"],
        common_durations: ["4 hours", "6 hours"]
    }
};

// Export all data
window.commodities = commodities;
window.carriers = carriers;
window.ports = ports;
window.destinations = destinations;
window.ppecbTreatments = ppecbTreatments;
