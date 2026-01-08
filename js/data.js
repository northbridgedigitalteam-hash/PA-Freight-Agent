// HS Code Database for South African Perishable Exports
const hsCodes = [
    {
        code: "080510",
        description: "Oranges, fresh or dried",
        category: "fruit",
        duty: "Free",
        temperature: "2-4°C",
        humidity: "85-90%",
        requirements: ["Phytosanitary Certificate", "Cold Treatment Certificate", "MRL Compliance"],
        specialNotes: "EU: 16 days cold treatment at ≤2°C. USA: Fumigation required.",
        destinations: ["EU", "USA", "China", "Middle East"],
        season: "May-November",
        shelfLife: "6-8 weeks",
        packaging: "Carton boxes, 15kg"
    },
    {
        code: "080610",
        description: "Table grapes, fresh",
        category: "fruit",
        duty: "Varies",
        temperature: "0-1°C",
        humidity: "90-95%",
        requirements: ["Phytosanitary Certificate", "SO2 Pads", "Quality Inspection"],
        specialNotes: "Pre-cooling essential. Use SO2 pads for mold prevention.",
        destinations: ["EU", "UK", "China", "Canada"],
        season: "November-April",
        shelfLife: "2-3 months",
        packaging: "Plastic clamshells, 4.5kg"
    },
    {
        code: "060310",
        description: "Cut flowers, fresh",
        category: "flower",
        duty: "10-15%",
        temperature: "5-8°C",
        humidity: "85-90%",
        requirements: ["Phytosanitary Certificate", "Cold Chain Certificate", "Vase Life Test"],
        specialNotes: "Use refrigerated containers. Ethylene sensitive.",
        destinations: ["EU", "Netherlands", "UK", "USA"],
        season: "Year-round",
        shelfLife: "14-21 days",
        packaging: "Hydration boxes, bunched"
    },
    {
        code: "080440",
        description: "Avocados (Hass), fresh",
        category: "fruit",
        duty: "Free",
        temperature: "5-7°C",
        humidity: "85-90%",
        requirements: ["Phytosanitary Certificate", "Maturity Certificate", "Cold Treatment"],
        specialNotes: "Dry matter >23%. EU requires cold treatment for certain origins.",
        destinations: ["EU", "UK", "China", "Middle East"],
        season: "March-September",
        shelfLife: "3-4 weeks",
        packaging: "Single layer cartons, 4kg"
    },
    {
        code: "020230",
        description: "Beef, bone-in, chilled",
        category: "meat",
        duty: "Varies",
        temperature: "-1 to 0°C",
        humidity: "85-90%",
        requirements: ["Veterinary Certificate", "Halal Certificate (if applicable)", "Origin Certificate"],
        specialNotes: "FMD-free zone certification required for EU. HACCP mandatory.",
        destinations: ["EU", "China", "Middle East", "SADC"],
        season: "Year-round",
        shelfLife: "90 days",
        packaging: "Vacuum packed, master carton"
    },
    {
        code: "030269",
        description: "Hake, frozen, whole",
        category: "meat",
        duty: "6-12%",
        temperature: "-18°C or below",
        humidity: "N/A",
        requirements: ["Health Certificate", "Catch Certificate", "Freezing Certificate"],
        specialNotes: "IUU compliance required. MSC certification preferred for EU.",
        destinations: ["EU", "Australia", "USA", "West Africa"],
        season: "Year-round",
        shelfLife: "24 months",
        packaging: "Block frozen, PE bags, carton"
    },
    {
        code: "070190",
        description: "Potatoes, fresh",
        category: "vegetable",
        duty: "Free",
        temperature: "4-6°C",
        humidity: "85-90%",
        requirements: ["Phytosanitary Certificate", "Seed Potato Certificate", "Soil Free Certificate"],
        specialNotes: "EU requires PCN freedom. Sprout inhibitors recommended.",
        destinations: ["SADC", "Middle East", "Indian Ocean Islands"],
        season: "Year-round",
        shelfLife: "6-9 months",
        packaging: "Mesh bags, 10kg, palletized"
    },
    {
        code: "220421",
        description: "Wine, in containers ≤2L",
        category: "other",
        duty: "Varies",
        temperature: "12-16°C",
        humidity: "60-70%",
        requirements: ["Certificate of Origin", "Analysis Certificate", "Fumigation Certificate"],
        specialNotes: "Avoid temperature fluctuations. US requires TTB label approval.",
        destinations: ["EU", "UK", "USA", "China"],
        season: "Year-round",
        shelfLife: "Indefinite",
        packaging: "Glass bottles, wooden cases"
    },
    {
        code: "070960",
        description: "Peppers (Capsicum), fresh",
        category: "vegetable",
        duty: "8-12%",
        temperature: "7-10°C",
        humidity: "90-95%",
        requirements: ["Phytosanitary Certificate", "Pesticide Residue Report"],
        specialNotes: "Chilling sensitive. Maintain above 7°C.",
        destinations: ["EU", "Middle East", "SADC"],
        season: "September-April",
        shelfLife: "2-3 weeks",
        packaging: "Corrugated cartons, 5kg"
    },
    {
        code: "081050",
        description: "Blueberries, fresh",
        category: "fruit",
        duty: "Free",
        temperature: "0-1°C",
        humidity: "90-95%",
        requirements: ["Phytosanitary Certificate", "Cold Treatment", "Quality Inspection"],
        specialNotes: "High CO2 (10-12%) recommended for extended shelf life.",
        destinations: ["EU", "UK", "Middle East", "Asia"],
        season: "October-March",
        shelfLife: "4-6 weeks",
        packaging: "Plastic punnets, 125g, master carton"
    }
];

// Carrier SI Cut-off Information
const carrierCutoffs = {
    "MSC": {
        daysBefore: 3,
        documents: ["Shipping Instructions", "Bill of Lading Draft", "Commercial Invoice", "Packing List"],
        contact: "si.capetown@msc.com",
        phone: "+27 21 123 4567",
        notes: "VGM submission 24 hours before loading"
    },
    "Maersk": {
        daysBefore: 4,
        documents: ["Shipping Instructions", "VGM Certificate", "Export Declaration", "Commercial Invoice"],
        contact: "za.sidoc@maersk.com",
        phone: "+27 11 987 6543",
        notes: "Electronic BL only. No amendments after cut-off."
    },
    "CMA CGM": {
        daysBefore: 3,
        documents: ["Shipping Instructions", "Packing List", "Certificate of Origin", "Commercial Invoice"],
        contact: "doc.cpt@cma-cgm.com",
        phone: "+27 21 555 1234",
        notes: "Phyto certificates must be original"
    },
    "Hapag-Lloyd": {
        daysBefore: 3,
        documents: ["Shipping Instructions", "BL Instructions", "Fumigation Certificate (if applicable)", "Invoice"],
        contact: "capetown.si@hlag.com",
        phone: "+27 21 333 7890",
        notes: "Temperature settings must be confirmed 48h before"
    },
    "SAFmarine": {
        daysBefore: 4,
        documents: ["Shipping Instructions", "Draft BL", "Export Permit", "Commercial Documents"],
        contact: "sisi@safmarine.com",
        phone: "+27 21 222 4567",
        notes: "Perishable bookings require pre-approval"
    }
};

// Port Information
const ports = {
    "CPT": { name: "Cape Town", code: "ZACPT", country: "South Africa" },
    "DUR": { name: "Durban", code: "ZADUR", country: "South Africa" },
    "JNB": { name: "Johannesburg (Air)", code: "FAJS", country: "South Africa" },
    "PLZ": { name: "Port Elizabeth", code: "ZAPLZ", country: "South Africa" },
    "NLH": { name: "Nelson Mandela Bay", code: "ZANMB", country: "South Africa" }
};
