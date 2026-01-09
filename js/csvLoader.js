// ============================================
// CSV LOADER FOR PAXI
// Loads and processes your single CSV file
// ============================================

class CSVLoader {
    constructor() {
        this.commodities = [];
        this.loaded = false;
        this.csvPath = 'js/data/commodities.csv'; // Path to your CSV file
    }

    // Load CSV file from server
    async loadCSV() {
        try {
            console.log('Loading CSV data from:', this.csvPath);
            
            const response = await fetch(this.csvPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const csvText = await response.text();
            this.commodities = this.parseCSV(csvText);
            this.loaded = true;
            
            console.log(`Loaded ${this.commodities.length} commodities from CSV`);
            return this.commodities;
            
        } catch (error) {
            console.error('Error loading CSV:', error);
            return this.loadSampleData();
        }
    }

    // Parse CSV text to JSON
    parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) return [];
        
        const headers = this.detectHeaders(lines[0]);
        const commodities = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === 0) continue;
            
            const commodity = {};
            headers.forEach((header, index) => {
                if (index < values.length) {
                    commodity[header] = values[index].trim();
                }
            });
            
            commodity.id = this.generateId(commodity);
            commodities.push(commodity);
        }
        
        return commodities;
    }

    detectHeaders(firstLine) {
        if (firstLine.includes('"')) {
            return this.parseCSVLine(firstLine).map(h => h.trim().replace(/"/g, ''));
        }
        return firstLine.split(',').map(h => h.trim());
    }

    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current);
        return values;
    }

    generateId(commodity) {
        if (commodity.HS_Code) {
            return `commodity_${commodity.HS_Code}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        return `commodity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    loadSampleData() {
        console.log('Loading sample data (CSV not available)');
        return [
            {
                id: 'sample_1',
                HS_Code: '080510',
                Commodity_Name: 'Oranges',
                Scientific_Name: 'Citrus × sinensis',
                Category: 'citrus',
                Temperature: '2-4°C',
                Destination_EU: 'Cold Treatment required',
                Destination_USA: 'Fumigation or Cold Treatment',
                PPECB_Ref: 'CT-SO-001'
            },
            {
                id: 'sample_2',
                HS_Code: '080610',
                Commodity_Name: 'Table Grapes',
                Scientific_Name: 'Vitis vinifera',
                Category: 'deciduous',
                Temperature: '-0.5 to 0°C',
                Destination_EU: 'Cold Treatment + SO2 pads',
                Destination_USA: 'Cold Treatment',
                PPECB_Ref: 'FR-GR-102'
            }
        ];
    }

    searchCommodities(query, category = 'all') {
        if (!this.loaded || this.commodities.length === 0) {
            return [];
        }
        
        const searchTerm = query.toLowerCase().trim();
        
        return this.commodities.filter(commodity => {
            if (category !== 'all' && commodity.Category !== category) {
                return false;
            }
            
            if (!searchTerm) {
                return true;
            }
            
            return (
                (commodity.HS_Code && commodity.HS_Code.includes(searchTerm)) ||
                (commodity.Commodity_Name && commodity.Commodity_Name.toLowerCase().includes(searchTerm)) ||
                (commodity.Scientific_Name && commodity.Scientific_Name.toLowerCase().includes(searchTerm)) ||
                (commodity.Variety_Code && commodity.Variety_Code.toLowerCase().includes(searchTerm)) ||
                (commodity.Destination_EU && commodity.Destination_EU.toLowerCase().includes(searchTerm)) ||
                (commodity.Destination_USA && commodity.Destination_USA.toLowerCase().includes(searchTerm)) ||
                (commodity.Destination_China && commodity.Destination_China.toLowerCase().includes(searchTerm))
            );
        });
    }

    getCommodityByHSCode(hsCode) {
        return this.commodities.find(c => c.HS_Code === hsCode);
    }

    getCategories() {
        const categories = new Set();
        this.commodities.forEach(c => {
            if (c.Category) categories.add(c.Category);
        });
        return Array.from(categories);
    }

    getStats() {
        return {
            total: this.commodities.length,
            categories: this.getCategories().length,
        };
    }
}

// Create global instance
window.csvLoader = new CSVLoader();
