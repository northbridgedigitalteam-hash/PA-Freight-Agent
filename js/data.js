// ============================================
// PAXI - COMPLETE COMMODITY DATABASE
// South African Perishable Exports
// ============================================

// Core Commodities Database
const commodities = [
    {
        id: "citrus_oranges",
        hs_code: "080510",
        hs_chapter: "08",
        hs_description: "Oranges, fresh or dried",
        common_name: "Oranges",
        scientific_name: "Citrus × sinensis",
        afrikaans_name: "Lemoene",
        varieties: ["Navel", "Valencia", "Cara Cara", "Blood Orange"],
        category: "fruit",
        subcategory: "citrus",
        
        ppecb: {
            yellow_card_ref: "CT-SO-001",
            protocol_version: "v4.2 (2024)",
            loading_protocol: "Pre-cooled containers mandatory",
            docs: ["Phytosanitary", "Cold Treatment Certificate", "Origin Certificate"]
        },
        
        temperature: {
            pulp_temp_range: "2-4°C",
            transit_temp: "2-4°C",
            humidity: "85-90% RH",
            max_storage: "8-12 weeks"
        },
        
        treatments: {
            "EU": {
                required: "Cold Treatment",
                protocol: "16 days at ≤2.2°C",
                pulp_temp: "≤2.2°C",
                pre_cooling: "MANDATORY",
                notes: "TRACES-NT required, 5 probe placement"
            },
            "USA": {
                required: "Cold Treatment",
                protocol: "22 days at ≤0°C or 24 days at ≤1.1°C",
                pulp_temp: "≤3.3°C",
                pre_cooling: "RECOMMENDED"
            },
            "China": {
                required: "Cold Treatment",
                protocol: "18 days at ≤1.1°C",
                pulp_temp: "≤4°C",
                pre_cooling: "MANDATORY"
            }
        }
    },
    
    {
        id: "citrus_grapefruit",
        hs_code: "080540",
        hs_chapter: "08",
        hs_description: "Grapefruit, fresh",
        common_name: "Grapefruit",
        scientific_name: "Citrus × paradisi",
        afrikaans_name: "Pompelmoes",
        varieties: ["Star Ruby", "Ruby Red", "Marsh Seedless"],
        category: "fruit",
        subcategory: "citrus",
        
        ppecb: {
            yellow_card_ref: "CT-SG-002",
            protocol_version: "v4.1 (2024)",
            loading_protocol: "Pre-cooling recommended",
            docs: ["Phytosanitary", "Cold Treatment Certificate"]
        },
        
        temperature: {
            pulp_temp_range: "10-12°C",
            transit_temp: "10-12°C",
            humidity: "85-90% RH",
            max_storage: "6-8 weeks",
            notes: "Chilling sensitive - do not store below 10°C"
        },
        
        treatments: {
            "EU": {
                required: "Cold Treatment",
                protocol: "16 days at ≤2.2°C",
                pulp_temp: "≤2.2°C",
                pre_cooling: "RECOMMENDED"
            },
            "USA": {
                required: "Cold Treatment",
                protocol: "22 days at ≤0°C",
                pulp_temp: "≤2.2°C",
                pre_cooling: "RECOMMENDED"
            }
        }
    },
    
    {
        id: "citrus_lemon",
        hs_code: "080550",
        hs_chapter: "08",
        hs_description: "Lemons and limes, fresh",
        common_name: "Lemons",
        scientific_name: "Citrus limon",
        afrikaans_name: "Suerlemoene",
        varieties: ["Eureka", "Lisbon", "Fino"],
        category: "fruit",
        subcategory: "citrus",
        
        ppecb: {
            yellow_card_ref: "CT-SL-003",
            protocol_version: "v4.0 (2024)",
            loading_protocol: "Standard refrigerated loading",
            docs: ["Phytosanitary", "Treatment Certificate"]
        },
        
        temperature: {
            pulp_temp_range: "8-10°C",
            transit_temp: "8-10°C",
            humidity: "85-90% RH",
            max_storage: "3-4 months"
        },
        
        treatments: {
            "EU": {
                required: "Cold Treatment",
                protocol: "16 days at ≤2.2°C",
                pulp_temp: "≤2.2°C",
                pre_cooling: "RECOMMENDED"
            },
            "Middle East": {
                required: "None",
                protocol: "No treatment required",
                pulp_temp: "8-10°C",
                pre_cooling: "OPTIONAL"
            }
        }
    },
    
    {
        id: "citrus_soft",
        hs_code: "080520",
        hs_chapter: "08",
        hs_description: "Mandarins, clementines, wilkings and similar citrus hybrids, fresh",
        common_name: "Soft Citrus",
        scientific_name: "Citrus reticulata",
        afrikaans_name: "Naartjies",
        varieties: ["Nova", "Nadorcott", "Tango", "Orri"],
        category: "fruit",
        subcategory: "citrus",
        
        ppecb: {
            yellow_card_ref: "CT-SC-004",
            protocol_version: "v4.2 (2024)",
            loading_protocol: "Handle carefully - delicate fruit",
            docs: ["Phytosanitary", "Cold Treatment Certificate", "Quality Certificate"]
        },
        
        temperature: {
            pulp_temp_range: "4-6°C",
            transit_temp: "4-6°C",
            humidity: "90-95% RH",
            max_storage: "4-6 weeks"
        },
        
        treatments: {
            "EU": {
                required: "Cold Treatment",
                protocol: "16 days at ≤2.2°C",
                pulp_temp: "≤2.2°C",
                pre_cooling: "MANDATORY"
            },
            "China": {
                required: "Cold Treatment",
                protocol: "18 days at ≤1.1°C",
                pulp_temp: "≤4°C",
                pre_cooling: "MANDATORY"
            }
        }
    }
];

// Transit Times Database
const transitTimes = {
    routes: [
        { origin: "Cape Town (CPT)", origin_code: "ZACPT", destination: "Rotterdam (RTM)", destination_code: "NLRTM", carrier: "MSC", transit_days: 18, frequency: "Weekly", status: "Normal" },
        { origin: "Cape Town (CPT)", origin_code: "ZACPT", destination: "Antwerp (ANT)", destination_code: "BEANR", carrier: "Maersk", transit_days: 20, frequency: "Weekly", status: "Normal" },
        { origin: "Cape Town (CPT)", origin_code: "ZACPT", destination: "Jebel Ali (JEA)", destination_code: "AEJEA", carrier: "MSC", transit_days: 14, frequency: "Twice Weekly", status: "Busy" },
        { origin: "Cape Town (CPT)", origin_code: "ZACPT", destination: "Shanghai (SHA)", destination_code: "CNSHA", carrier: "Maersk", transit_days: 28, frequency: "Weekly", status: "Congested" },
        { origin: "Cape Town (CPT)", origin_code: "ZACPT", destination: "Philadelphia (PHL)", destination_code: "USPHL", carrier: "MSC", transit_days: 25, frequency: "Weekly", status: "Normal" },
        { origin: "Durban (DUR)", origin_code: "ZADUR", destination: "Rotterdam (RTM)", destination_code: "NLRTM", carrier: "CMA CGM", transit_days: 22, frequency: "Weekly", status: "Normal" }
    ],
    portCongestion: {
        "NLRTM": { status: "Normal", delay_days: 0 },
        "BEANR": { status: "Normal", delay_days: 0 },
        "AEJEA": { status: "Busy", delay_days: 2 },
        "CNSHA": { status: "Congested", delay_days: 4 },
        "USPHL": { status: "Normal", delay_days: 1 }
    }
};

// Resource Links Database
const resourceLinks = {
    ppecb: [
        {
            title: "Cold Treatment Container Loading Protocols (Yellow Card)",
            url: "https://ppecb.com/docs/q25-cold-treatment-container-loading-protocols-yellow-card/",
            description: "Official PPECB Yellow Card for cold treatment procedures"
        },
        {
            title: "Phytosanitary Requirements for Fruit Exports",
            url: "https://ppecb.com/docs/phytosanitary-requirements/",
            description: "PPECB phytosanitary certification guidelines"
        }
    ],
    nda: [
        {
            title: "Export Regulations and Standards",
            url: "https://www.nda.gov.za/index.php/publication/524-export-regulations-and-standards",
            description: "Department of Agriculture export regulations"
        },
        {
            title: "Plant Health Requirements",
            url: "https://www.nda.gov.za/planthealth",
            description: "National plant health requirements"
        }
    ],
    carriers: [
        {
            title: "MSC Perishable Cargo Guidelines",
            url: "https://www.msc.com/en/perishables",
            description: "MSC specific requirements for perishables"
        },
        {
            title: "Maersk Reefer Services",
            url: "https://www.maersk.com/services/reefer",
            description: "Maersk reefer specifications"
        }
    ]
};

// Export all data
window.commodities = commodities;
window.transitTimes = transitTimes;
window.resourceLinks = resourceLinks;
