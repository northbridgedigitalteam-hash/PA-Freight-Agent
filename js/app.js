// ============================================
// PAXI MAIN APPLICATION
// ============================================

// Global state
let allCommodities = [];
let currentSearchResults = [];
let currentCategory = 'all';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const resultsContainer = document.getElementById('resultsContainer');
const commodityCount = document.getElementById('commodityCount');
const transitTable = document.getElementById('transitTable');

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    console.log('PAXI Export Assistant initializing...');
    
    // Load CSV data
    await loadCommodityData();
    
    // Initialize event listeners
    setupEventListeners();
    
    // Load transit times
    loadTransitTimes();
    
    // Show initial results
    performSearch('');
});

// Load commodity data from CSV
async function loadCommodityData() {
    try {
        allCommodities = await csvLoader.loadCSV();
        
        // Update UI with counts
        updateStats();
        
        // Populate category filter
        populateCategories();
        
    } catch (error) {
        console.error('Failed to load commodity data:', error);
        showError('Failed to load commodity database. Please refresh the page.');
    }
}

// Update statistics display
function updateStats() {
    if (!allCommodities || allCommodities.length === 0) return;
    
    // Update commodity count
    commodityCount.textContent = `${allCommodities.length} commodities`;
    
    // Count unique varieties (if available in your CSV)
    const varieties = new Set();
    allCommodities.forEach(c => {
        if (c.Variety_Code) varieties.add(c.Variety_Code);
        if (c.Variety_Name) varieties.add(c.Variety_Name);
    });
    
    // Update other stats if elements exist
    const totalCommodities = document.getElementById('totalCommodities');
    const totalVarieties = document.getElementById('totalVarieties');
    
    if (totalCommodities) totalCommodities.textContent = allCommodities.length;
    if (totalVarieties) totalVarieties.textContent = varieties.size;
}

// Populate category filter dropdown
function populateCategories() {
    if (!allCommodities || allCommodities.length === 0) return;
    
    const categories = csvLoader.getCategories();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search input with debounce
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
    
    // Category filter
    categoryFilter.addEventListener('change', function() {
        currentCategory = this.value;
        performSearch(searchInput.value);
    });
    
    // Enter key to search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
}

// Perform search
function performSearch(query) {
    if (!csvLoader.loaded) {
        resultsContainer.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i> Database still loading...
            </div>
        `;
        return;
    }
    
    const results = csvLoader.searchCommodities(query, currentCategory);
    currentSearchResults = results;
    
    if (results.length === 0) {
        displayNoResults(query);
    } else {
        displayResults(results, query);
    }
}

// Display search results
function displayResults(results, query) {
    let html = `
        <div class="row g-4">
    `;
    
    results.forEach((commodity, index) => {
        html += createCommodityCard(commodity, index);
    });
    
    html += `</div>`;
    resultsContainer.innerHTML = html;
    
    // Add click handlers to cards
    document.querySelectorAll('.commodity-card').forEach(card => {
        card.addEventListener('click', function() {
            const hsCode = this.getAttribute('data-hs');
            showCommodityDetail(hsCode);
        });
    });
}

// Create commodity card HTML
function createCommodityCard(commodity, index) {
    const hsCode = commodity.HS_Code || 'N/A';
    const name = commodity.Commodity_Name || 'Unnamed Commodity';
    const category = commodity.Category || 'uncategorized';
    const sciName = commodity.Scientific_Name || '';
    
    return `
        <div class="col-md-6 col-lg-4">
            <div class="commodity-card card h-100 animate-in" 
                 style="animation-delay: ${index * 0.1}s"
                 data-hs="${hsCode}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <span class="badge bg-success">${hsCode}</span>
                            <span class="badge bg-info ms-1">${category}</span>
                        </div>
                        <button class="btn btn-sm btn-outline-success" 
                                onclick="event.stopPropagation(); copyToClipboard('${hsCode}')"
                                title="Copy HS Code">
                            <i class="bi bi-copy"></i>
                        </button>
                    </div>
                    
                    <h5 class="card-title">${name}</h5>
                    
                    ${sciName ? `
                    <p class="card-text text-muted small mb-3">
                        <i class="bi bi-flower1"></i> ${sciName}
                    </p>
                    ` : ''}
                    
                    ${commodity.Variety_Name ? `
                    <p class="card-text small mb-2">
                        <strong>Variety:</strong> ${commodity.Variety_Name}
                        ${commodity.Variety_Code ? `(${commodity.Variety_Code})` : ''}
                    </p>
                    ` : ''}
                    
                    ${commodity.Temperature ? `
                    <div class="mb-3">
                        <span class="badge bg-warning text-dark">
                            <i class="bi bi-thermometer-half"></i> ${commodity.Temperature}
                        </span>
                    </div>
                    ` : ''}
                    
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        ${commodity.PPECB_Ref ? `
                        <small class="text-muted">
                            <i class="bi bi-shield-check"></i> ${commodity.PPECB_Ref}
                        </small>
                        ` : '<div></div>'}
                        <span class="badge bg-light text-success">
                            Details <i class="bi bi-arrow-right"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Display no results message
function displayNoResults(query) {
    resultsContainer.innerHTML = `
        <div class="text-center py-5">
            <i class="bi bi-search display-1 text-muted opacity-50"></i>
            <h4 class="mt-3 text-muted">No commodities found</h4>
            <p>${query ? `Your search for "${query}" didn't match any commodities.` : 'No commodities in database.'}</p>
            
            <div class="mt-4">
                <button class="btn btn-success" onclick="clearSearch()">
                    <i class="bi bi-arrow-clockwise"></i> Clear Search
                </button>
            </div>
        </div>
    `;
}

// Show commodity detail modal
function showCommodityDetail(hsCode) {
    const commodity = csvLoader.getCommodityByHSCode(hsCode);
    if (!commodity) {
        alert('Commodity not found');
        return;
    }
    
    // Build modal content based on your CSV structure
    let modalContent = `
        <div class="row">
            <div class="col-md-6">
                <table class="table table-sm">
                    <tr><th>HS Code:</th><td><span class="badge bg-success">${commodity.HS_Code || 'N/A'}</span></td></tr>
                    <tr><th>Commodity:</th><td>${commodity.Commodity_Name || 'N/A'}</td></tr>
                    <tr><th>Scientific Name:</th><td>${commodity.Scientific_Name || 'N/A'}</td></tr>
                    <tr><th>Category:</th><td>${commodity.Category || 'N/A'}</td></tr>
                    ${commodity.Variety_Name ? `<tr><th>Variety:</th><td>${commodity.Variety_Name} (${commodity.Variety_Code || ''})</td></tr>` : ''}
                </table>
            </div>
            <div class="col-md-6">
    `;
    
    // Add temperature info if available
    if (commodity.Temperature) {
        modalContent += `
            <div class="alert alert-warning">
                <h6><i class="bi bi-thermometer-half"></i> Temperature Requirements</h6>
                <p class="mb-0">${commodity.Temperature}</p>
            </div>
        `;
    }
    
    // Add PPECB reference if available
    if (commodity.PPECB_Ref) {
        modalContent += `
            <div class="alert alert-success">
                <h6><i class="bi bi-shield-check"></i> PPECB Reference</h6>
                <p class="mb-0">${commodity.PPECB_Ref}</p>
            </div>
        `;
    }
    
    modalContent += `</div></div>`;
    
    // Add destination requirements if available
    const destinations = ['EU', 'USA', 'China', 'Middle_East', 'Japan', 'UK'];
    const destinationContent = destinations
        .filter(dest => commodity[`Destination_${dest}`])
        .map(dest => `
            <div class="alert alert-info">
                <h6><i class="bi bi-globe"></i> ${dest.replace('_', ' ')} Requirements</h6>
                <p class="mb-0">${commodity[`Destination_${dest}`]}</p>
            </div>
        `).join('');
    
    if (destinationContent) {
        modalContent += `
            <div class="mt-4">
                <h6>Destination Requirements</h6>
                ${destinationContent}
            </div>
        `;
    }
    
    // Set modal content
    document.getElementById('modalTitle').textContent = `${commodity.Commodity_Name || 'Commodity'} Details`;
    document.getElementById('modalBody').innerHTML = modalContent;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('commodityModal'));
    modal.show();
}

// Load transit times
function loadTransitTimes() {
    if (!transitTable) return;
    
    const transitData = [
        { from: 'Cape Town', to: 'Rotterdam', days: '18-20', carriers: 'MSC, Maersk', status: 'Normal' },
        { from: 'Cape Town', to: 'Antwerp', days: '19-21', carriers: 'Maersk, CMA CGM', status: 'Normal' },
        { from: 'Cape Town', to: 'Jebel Ali', days: '14-16', carriers: 'MSC, Hapag-Lloyd', status: 'Busy' },
        { from: 'Cape Town', to: 'Shanghai', days: '28-30', carriers: 'Maersk, MSC', status: 'Congested' },
        { from: 'Cape Town', to: 'Philadelphia', days: '24-26', carriers: 'MSC, Maersk', status: 'Normal' },
        { from: 'Durban', to: 'Rotterdam', days: '22-24', carriers: 'CMA CGM, MSC', status: 'Normal' },
        { from: 'Durban', to: 'Singapore', days: '12-14', carriers: 'All carriers', status: 'Normal' }
    ];
    
    let html = '';
    transitData.forEach(route => {
        const statusClass = getStatusClass(route.status);
        html += `
            <tr>
                <td>${route.from}</td>
                <td>${route.to}</td>
                <td><strong class="text-success">${route.days}</strong> days</td>
                <td>${route.carriers}</td>
                <td><span class="badge ${statusClass}">${route.status}</span></td>
            </tr>
        `;
    });
    
    transitTable.innerHTML = html;
}

// Get status badge class
function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'normal': return 'bg-success';
        case 'busy': return 'bg-warning';
        case 'congested': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

// Utility functions
window.clearSearch = function() {
    searchInput.value = '';
    currentCategory = 'all';
    categoryFilter.value = 'all';
    performSearch('');
};

window.quickSearch = function(query) {
    searchInput.value = query;
    performSearch(query);
};

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show toast notification
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.innerHTML = `
            <div class="toast show" role="alert">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto"><i class="bi bi-check-circle"></i> Copied!</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    HS Code <strong>${text}</strong> copied to clipboard
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    });
};

window.printCommodity = function() {
    window.print();
};

window.showError = function(message) {
    resultsContainer.innerHTML = `
        <div class="alert alert-danger">
            <i class="bi bi-exclamation-octagon"></i> ${message}
        </div>
    `;
};
