// ============================================
// PAXI - EXPERT COMMODITY DATABASE
// Manually curated from PPECB, DALRRD, and industry expertise
// ============================================

const commodityDatabase = {
    // Statistics
    stats: {
        total: 0,
        categories: {},
        destinations: {}
    },

    // Core Commodity Data
    commodities: [
        {
            // ========== ORANGES ==========
            id: "citrus_oranges",
            hs_code: "080510",
            hs_description: "Oranges, fresh or dried",
            common_name: "Oranges",
            scientific_name: "Citrus × sinensis",
            afrikaans_name: "Lemoene",
            category: "citrus",
            subcategory: "citrus_fruit",
            
            // Varieties
            varieties: [
                { code: "NVL", name: "Navel", season: "May-September" },
                { code: "VLN", name: "Valencia", season: "July-November" },
                { code: "CRC", name: "Cara Cara", season: "June-October" },
                { code: "BLO", name: "Blood Orange", season: "July-October" }
            ],
            
            // Technical Specifications
            technical: {
                temperature: {
                    pulp_range: "2-4°C",
                    transit: "2-4°C",
                    storage: "2-4°C",
                    chilling_injury: "<2°C",
                    heat_damage: ">25°C",
                    source: "PPECB Yellow Card CT-SO-001"
                },
                humidity: "85-90% RH",
                shelf_life: "8-12 weeks",
                ethylene: "Sensitive",
                respiration: "Low",
                packaging: "15kg telescopic carton, palletized (96 cartons/pallet)"
            },
            
            // Quality Standards
            quality: {
                brix: {
                    minimum: "10.5°",
                    optimum: "12-14°",
                    acid_ratio: "8:1 to 14:1"
                },
                sizing: {
                    method: "Diameter in mm",
                    grades: ["56", "72", "88", "100", "113", "138", "163"],
                    tolerance: "±5mm"
                },
                defects: {
                    max_total: "5%",
                    max_decay: "1%",
                    max_mechanical: "3%",
                    color_requirement: "Minimum 30% blush"
                }
            },
            
            // Destination Requirements
            destinations: {
                "EU": {
                    treatment: {
                        type: "Cold Treatment",
                        protocol: "16 days continuous at ≤2.2°C",
                        duration: "16 days",
                        pulp_temp: "≤2.2°C before treatment",
                        pre_cooling: "MANDATORY - Pulp ≤5°C before loading",
                        ppecb_ref: "CT-SO-001",
                        notes: "5 temperature probes required. Fruit must be free from frost."
                    },
                    documents: [
                        "Phytosanitary Certificate (original)",
                        "Cold Treatment Certificate",
                        "TRACES-NT reference",
                        "Commercial Invoice (3 copies)",
                        "Packing List",
                        "Certificate of Origin"
                    ],
                    special_requirements: [
                        "CBS (Citrus Black Spot) FREEDOM REQUIRED",
                        "Check PUC on PhytClean database: https://phytclean.agric.za",
                        "Pre-inspection by PPECB mandatory",
                        "Fruit fly monitoring in orchard required",
                        "Maintain treatment records for 2 years"
                    ],
                    inspection_points: ["Orchard", "Packhouse", "Load-out"],
                    entry_ports: ["Rotterdam", "Antwerp", "Southampton", "Bremerhaven"],
                    clearance_time: "24-48 hours",
                    dalrrd_link: "https://www.dalrrd.gov.za/export-procedures/eu-citrus"
                },
                
                "USA": {
                    treatment: {
                        type: "Cold Treatment OR Fumigation",
                        protocol: "Option 1: 22 days at ≤0°C OR Option 2: 24 days at ≤1.1°C",
                        duration: "22-24 days",
                        pulp_temp: "≤3.3°C for cold treatment",
                        pre_cooling: "RECOMMENDED",
                        notes: "Methyl Bromide fumigation alternative available. APHIS permit required."
                    },
                    documents: [
                        "Phytosanitary Certificate",
                        "Treatment Certificate",
                        "APHIS Import Permit",
                        "Commercial Invoice",
                        "Packing List",
                        "FDA Prior Notice"
                    ],
                    special_requirements: [
                        "Fruit fly area freedom certification",
                        "Port of entry inspection by FDA/CBP",
                        "Methyl Bromide alternatives: Phosphine or Cold Treatment",
                        "Temperature recording devices mandatory"
                    ],
                    inspection_points: ["Packhouse", "Load-out"],
                    entry_ports: ["Philadelphia", "Wilmington", "Port Newark", "Long Beach"],
                    clearance_time: "72+ hours (FDA inspection)",
                    dalrrd_link: "https://www.dalrrd.gov.za/export-procedures/usa-citrus"
                },
                
                "China": {
                    treatment: {
                        type: "Cold Treatment",
                        protocol: "18 days at ≤1.1°C",
                        duration: "18 days",
                        pulp_temp: "≤4°C before treatment",
                        pre_cooling: "MANDATORY",
                        ppecb_ref: "GACC Protocol SA-CT-001"
                    },
                    documents: [
                        "Phytosanitary Certificate",
                        "Cold Treatment Certificate",
                        "GACC Approval Certificate",
                        "Commercial Invoice",
                        "Packing List",
                        "Bill of Lading"
                    ],
                    special_requirements: [
                        "Pre-inspection by Chinese officials (AQSIQ)",
                        "Orchard and packhouse registration with GACC",
                        "Maximum residue limits (MRLs) strictly enforced",
                        "Specific packaging requirements (bilingual labeling)"
                    ],
                    inspection_points: ["Orchard", "Packhouse", "Pre-loading"],
                    entry_ports: ["Shanghai", "Guangzhou", "Dalian", "Tianjin"],
                    clearance_time: "48-72 hours",
                    dalrrd_link: "https://www.dalrrd.gov.za/export-procedures/china-citrus"
                },
                
                "Middle East": {
                    treatment: {
                        type: "Cold Treatment (recommended) OR None",
                        protocol: "14 days at ≤2°C (if treating)",
                        duration: "14 days",
                        pulp_temp: "≤5°C",
                        pre_cooling: "RECOMMENDED",
                        notes: "Treatment not always required - check specific import permit"
                    },
                    documents: [
                        "Phytosanitary Certificate",
                        "Health Certificate",
                        "Commercial Invoice",
                        "Certificate of Origin",
                        "Halal Certificate (if required)"
                    ],
                    special_requirements: [
                        "Country-specific import permits required",
                        "Saudi Arabia: SASO certification",
                        "UAE: ESMA approval",
                        "Qatar: Ministry of Public Health approval"
                    ],
                    inspection_points: ["Packhouse"],
                    entry_ports: ["Jebel Ali", "Dammam", "Doha", "Sohar"],
                    clearance_time: "12-24 hours",
                    dalrrd_link: "https://www.dalrrd.gov.za/export-procedures/middle-east"
                }
            },
            
            // Operational Notes
            operational_notes: {
                cbs_management: "CRITICAL: CBS freedom required for EU, USA, China. Use PhytClean database to verify PUC status.",
                puc_verification: "Verify Producer Unit Code (PUC) with DALRRD database before export.",
                seasonal_restrictions: "Main season: May to November (Northern Hemisphere markets)",
                sa_provinces: ["Eastern Cape", "Limpopo", "Mpumalanga", "Western Cape"],
                common_issues: [
                    "Frost damage during cold treatment",
                    "CBS detection at destination ports",
                    "Temperature fluctuations during transit",
                    "Documentation errors causing delays"
                ],
                best_practices: [
                    "Maintain pulp temperature records hourly during loading",
                    "Use pre-cooled containers only",
                    "Ensure proper ventilation (25% open)",
                    "No mixed loads with ethylene producers"
                ]
            },
            
            // Resources
            resources: {
                phytclean: "https://phytclean.agric.za",
                ppecb_protocol: "https://ppecb.com/cold-treatment/",
                dalrrd_procedures: "https://www.dalrrd.gov.za/export-procedures/",
                sars_hs: "https://www.sars.gov.za/customs-and-excise/tariff-information/"
            }
        },
        
        {
            // ========== GRAPEFRUIT ==========
            id: "citrus_grapefruit",
            hs_code: "080540",
            hs_description: "Grapefruit, fresh",
            common_name: "Grapefruit",
            scientific_name: "Citrus × paradisi",
            afrikaans_name: "Pompelmoes",
            category: "citrus",
            subcategory: "citrus_fruit",
            
            varieties: [
                { code: "SRB", name: "Star Ruby", season: "March-September" },
                { code: "RRD", name: "Ruby Red", season: "April-October" },
                { code: "MRS", name: "Marsh Seedless", season: "May-November" }
            ],
            
            technical: {
                temperature: {
                    pulp_range: "10-12°C",
                    transit: "10-12°C",
                    storage: "10-12°C",
                    chilling_injury: "<10°C",
                    heat_damage: ">30°C",
                    source: "PPECB Yellow Card CT-SG-002"
                },
                humidity: "85-90% RH",
                shelf_life: "6-8 weeks",
                ethylene: "Sensitive",
                packaging: "10-15kg carton, palletized"
            },
            
            destinations: {
                "EU": {
                    treatment: {
                        type: "Cold Treatment",
                        protocol: "16 days at ≤2.2°C",
                        pre_cooling: "RECOMMENDED",
                        notes: "Some varieties exempt - check specific protocol"
                    },
                    special_requirements: [
                        "Chilling sensitive - maintain above 10°C",
                        "Specific variety restrictions apply",
                        "Brix requirements vary by market"
                    ]
                }
            }
        },
        
        {
            // ========== LEMONS ==========
            id: "citrus_lemon",
            hs_code: "080550",
            hs_description: "Lemons and limes, fresh",
            common_name: "Lemons",
            scientific_name: "Citrus limon",
            afrikaans_name: "Suerlemoene",
            category: "citrus",
            subcategory: "citrus_fruit",
            
            technical: {
                temperature: {
                    pulp_range: "8-10°C",
                    transit: "8-10°C",
                    storage: "8-10°C",
                    source: "PPECB Yellow Card CT-SL-003"
                },
                shelf_life: "3-4 months",
                packaging: "10kg carton"
            }
        },
        
        {
            // ========== TABLE GRAPES ==========
            id: "fruit_grapes",
            hs_code: "080610",
            hs_description: "Grapes, fresh",
            common_name: "Table Grapes",
            scientific_name: "Vitis vinifera",
            afrikaans_name: "Tafeldruiwe",
            category: "deciduous",
            subcategory: "grapes",
            
            technical: {
                temperature: {
                    pulp_range: "-0.5 to 0°C",
                    transit: "-0.5 to 0°C",
                    storage: "-0.5 to 0°C",
                    source: "PPECB Protocol FR-GR-102"
                },
                humidity: "90-95% RH"
            },
            
            destinations: {
                "EU": {
                    treatment: {
                        type: "Cold Treatment + SO2",
                        protocol: "16 days at ≤0.55°C with SO2 pads",
                        notes: "SO2 pads required throughout transit"
                    },
                    special_requirements: [
                        "Use 1 SO2 pad per 4.5kg carton",
                        "Rapid pre-cooling essential",
                        "Very low tolerance for temperature fluctuation"
                    ]
                }
            }
        },
        
        {
            // ========== AVOCADOS ==========
            id: "fruit_avocado",
            hs_code: "080440",
            hs_description: "Avocados, fresh or dried",
            common_name: "Avocados",
            scientific_name: "Persea americana",
            afrikaans_name: "Avokado's",
            category: "subtropical",
            subcategory: "avocados",
            
            technical: {
                temperature: {
                    pulp_range: "5-7°C",
                    transit: "5-7°C",
                    storage: "5-7°C",
                    chilling_injury: "<5°C",
                    ripening: ">7°C",
                    source: "PPECB Protocol FR-AV-103"
                }
            },
            
            destinations: {
                "EU": {
                    special_requirements: [
                        "Dry matter >23% required",
                        "Single layer packing only",
                        "Ethylene sensitive - separate from other fruit"
                    ]
                }
            }
        }
    ],

    // Search Function
    search: function(query, category = 'all') {
        const searchTerm = query.toLowerCase().trim();
        
        return this.commodities.filter(commodity => {
            // Category filter
            if (category !== 'all' && commodity.category !== category) {
                return false;
            }
            
            // Empty search returns all
            if (!searchTerm) {
                return true;
            }
            
            // Search across multiple fields
            return (
                commodity.hs_code.includes(searchTerm) ||
                commodity.common_name.toLowerCase().includes(searchTerm) ||
                commodity.scientific_name.toLowerCase().includes(searchTerm) ||
                commodity.hs_description.toLowerCase().includes(searchTerm) ||
                (commodity.varieties && commodity.varieties.some(v => 
                    v.name.toLowerCase().includes(searchTerm) || 
                    v.code.toLowerCase().includes(searchTerm)
                )) ||
                // Search in destinations
                (commodity.destinations && Object.keys(commodity.destinations).some(dest => 
                    dest.toLowerCase().includes(searchTerm)
                )) ||
                // Search in treatment types
                (commodity.destinations && Object.values(commodity.destinations).some(dest => 
                    dest.treatment && dest.treatment.type.toLowerCase().includes(searchTerm)
                )) ||
                // Search in special requirements
                (commodity.destinations && Object.values(commodity.destinations).some(dest => 
                    dest.special_requirements && dest.special_requirements.some(req => 
                        req.toLowerCase().includes(searchTerm)
                    )
                )) ||
                // Search CBS specifically
                (commodity.operational_notes && 
                 commodity.operational_notes.cbs_management.toLowerCase().includes(searchTerm))
            );
        });
    },

    // Get commodity by HS code
    getByHSCode: function(hsCode) {
        return this.commodities.find(c => c.hs_code === hsCode);
    },

    // Get commodity by ID
    getById: function(id) {
        return this.commodities.find(c => c.id === id);
    },

    // Get all categories
    getCategories: function() {
        const categories = new Set();
        this.commodities.forEach(c => categories.add(c.category));
        return Array.from(categories);
    },

    // Get all destinations
    getAllDestinations: function() {
        const destinations = new Set();
        this.commodities.forEach(c => {
            if (c.destinations) {
                Object.keys(c.destinations).forEach(dest => destinations.add(dest));
            }
        });
        return Array.from(destinations);
    },

    // Get statistics
    getStats: function() {
        const categories = {};
        const destinations = new Set();
        
        this.commodities.forEach(commodity => {
            // Count categories
            categories[commodity.category] = (categories[commodity.category] || 0) + 1;
            
            // Collect destinations
            if (commodity.destinations) {
                Object.keys(commodity.destinations).forEach(dest => destinations.add(dest));
            }
        });
        
        return {
            total: this.commodities.length,
            categories: categories,
            destinations: Array.from(destinations)
        };
    },

    // Initialize
    init: function() {
        const stats = this.getStats();
        this.stats = stats;
        console.log(`PAXI Commodity Database loaded: ${stats.total} commodities`);
        return this.commodities;
    }
};

// Initialize database
commodityDatabase.init();

// Export to global scope
window.commodityDatabase = commodityDatabase;
