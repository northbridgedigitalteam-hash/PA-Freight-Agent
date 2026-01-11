// ============================================
// PAXI - MAIN APPLICATION
// ============================================

// Global state
let currentSearchResults = [];
let currentCategory = 'all';
let currentCommodityDetail = null;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const resultsContainer = document.getElementById('resultsContainer');
const commodityCount = document.getElementById('commodityCount');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('PAXI Export Assistant v3.0 initializing...');
    
    // Update statistics
    updateStatistics();
    
    // Load news feeds
    if (window.newsFeed) {
        window.newsFeed.loadAll();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Show initial view
    showWelcomeView();
});

// Update statistics display
function updateStatistics() {
    if (!window.commodityDatabase) return;
    
    const stats = window.commodityDatabase.getStats();
    commodityCount.textContent = `${stats.total} Commodities`;
    
    // Update category filter options
    updateCategoryFilter(stats.categories);
}

// Update category filter with actual categories
function updateCategoryFilter(categories) {
    if (!categoryFilter) return;
    
    // Clear existing options except "All Categories"
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    
    // Add category options
    Object.keys(categories).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} (${categories[category]})`;
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
    
    // Category filter change
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
    
    // Focus search input on page load
    setTimeout(() => {
        searchInput.focus();
    }, 500);
}

// Perform search
function performSearch(query) {
    if (!window.commodityDatabase) {
        showError('Commodity database not loaded');
        return;
    }
    
    const results = window.commodityDatabase.search(query, currentCategory);
    currentSearchResults = results;
    
    if (results.length === 0) {
        showNoResults(query);
    } else {
        displayResults(results);
    }
}

// Display search results
function displayResults(results) {
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
            const commodityId = this.getAttribute('data-id');
            showCommodityDetail(commodityId);
        });
    });
}

// Create commodity card
function createCommodityCard(commodity, index) {
    const destCount = commodity.destinations ? Object.keys(commodity.destinations).length : 0;
    
    return `
        <div class="col-md-6 col-lg-4">
            <div class="commodity-card card h-100 animate-in" 
                 style="animation-delay: ${index * 0.1}s"
                 data-id="${commodity.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <span class="badge bg-success">${commodity.hs_code}</span>
                            <span class="badge bg-info ms-1">${commodity.category}</span>
                        </div>
                        <button class="btn btn-sm btn-outline-success" 
                                onclick="event.stopPropagation(); copyToClipboard('${commodity.hs_code}')"
                                title="Copy HS Code">
                            <i class="bi bi-copy"></i>
                        </button>
                    </div>
                    
                    <h5 class="card-title">${commodity.common_name}</h5>
                    
                    <p class="card-text text-muted small mb-3">
                        <i class="bi bi-flower1"></i> ${commodity.scientific_name}
                    </p>
                    
                    ${commodity.technical && commodity.technical.temperature ? `
                    <div class="mb-3">
                        <span class="temp-badge temp-chilled">
                            <i class="bi bi-thermometer-half"></i> ${commodity.technical.temperature.pulp_range}
                        </span>
                        <span class="badge bg-warning text-dark ms-2">
                            <i class="bi bi-globe"></i> ${destCount} destinations
                        </span>
                    </div>
                    ` : ''}
                    
                    ${commodity.varieties && commodity.varieties.length > 0 ? `
                    <p class="card-text small mb-2">
                        <strong>Varieties:</strong> ${commodity.varieties.map(v => v.name).slice(0, 2).join(', ')}
                        ${commodity.varieties.length > 2 ? '...' : ''}
                    </p>
                    ` : ''}
                    
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <small class="text-muted">
                            <i class="bi bi-box-seam"></i> ${commodity.hs_description.substring(0, 30)}...
                        </small>
                        <span class="badge bg-light text-success">
                            Details <i class="bi bi-arrow-right"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show commodity detail modal
function showCommodityDetail(commodityId) {
    const commodity = window.commodityDatabase.getById(commodityId);
    if (!commodity) {
        showError('Commodity not found');
        return;
    }
    
    currentCommodityDetail = commodity;
    
    // Build modal content
    let modalContent = buildCommodityDetailHTML(commodity);
    
    // Set modal content
    document.getElementById('modalTitle').textContent = `${commodity.common_name} - Complete Export Intelligence`;
    document.getElementById('modalBody').innerHTML = modalContent;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('commodityModal'));
    modal.show();
}

// Build detailed commodity HTML
function buildCommodityDetailHTML(commodity) {
    let html = `
        <div class="commodity-detail">
            <!-- Header Section -->
            <div class="row mb-4">
                <div class="col-md-6">
                    <table class="table table-sm">
                        <tr><th>HS Code:</th><td><span class="badge bg-success">${commodity.hs_code}</span></td></tr>
                        <tr><th>Commodity:</th><td>${commodity.common_name}</td></tr>
                        <tr><th>Scientific Name:</th><td>${commodity.scientific_name}</td></tr>
                        <tr><th>Afrikaans:</th><td>${commodity.afrikaans_name}</td></tr>
                        <tr><th>Category:</th><td><span class="badge bg-info">${commodity.category}</span></td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <div class="alert alert-success">
                        <h6><i class="bi bi-shield-check"></i> Quick Actions</h6>
                        <div class="d-flex flex-wrap gap-2 mt-2">
                            <a href="https://phytclean.agric.za" target="_blank" class="btn btn-sm btn-warning">
                                <i class="bi bi-search"></i> Check CBS (PhytClean)
                            </a>
                            <a href="${commodity.resources?.dalrrd_procedures || 'https://www.dalrrd.gov.za/'}" target="_blank" class="btn btn-sm btn-info">
                                <i class="bi bi-file-text"></i> DALRRD Procedures
                            </a>
                            <a href="${commodity.resources?.ppecb_protocol || 'https://ppecb.com/'}" target="_blank" class="btn btn-sm btn-primary">
                                <i class="bi bi-snow"></i> PPECB Protocols
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Technical Requirements -->
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h6 class="mb-0"><i class="bi bi-thermometer-half"></i> Technical Requirements</h6>
                </div>
                <div class="card-body">
    `;
    
    if (commodity.technical) {
        html += `
            <div class="row">
                <div class="col-md-6">
                    <table class="table table-sm">
                        <tr><th>Pulp Temperature:</th><td>${commodity.technical.temperature?.pulp_range || 'N/A'}</td></tr>
                        <tr><th>Transit Temperature:</th><td>${commodity.technical.temperature?.transit || 'N/A'}</td></tr>
                        <tr><th>Storage Temperature:</th><td>${commodity.technical.temperature?.storage || 'N/A'}</td></tr>
                        <tr><th>Humidity:</th><td>${commodity.technical.humidity || 'N/A'}</td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <table class="table table-sm">
                        <tr><th>Shelf Life:</th><td>${commodity.technical.shelf_life || 'N/A'}</td></tr>
                        <tr><th>Packaging:</th><td>${commodity.technical.packaging || 'Standard'}</td></tr>
                        <tr><th>Ethylene:</th><td>${commodity.technical.ethylene || 'Check specific requirements'}</td></tr>
                        ${commodity.technical.temperature?.chilling_injury ? `
                        <tr><th>Chilling Injury:</th><td>${commodity.technical.temperature.chilling_injury}</td></tr>
                        ` : ''}
                    </table>
                </div>
            </div>
        `;
    }
    
    html += `</div></div>`;
    
    // Quality Standards
    if (commodity.quality) {
        html += `
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h6 class="mb-0"><i class="bi bi-clipboard-check"></i> Quality Standards</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        ${commodity.quality.brix ? `
                        <div class="col-md-4">
                            <h6>Brix/Acid</h6>
                            <p class="mb-1"><strong>Minimum:</strong> ${commodity.quality.brix.minimum}</p>
                            <p class="mb-0"><strong>Optimum:</strong> ${commodity.quality.brix.optimum}</p>
                        </div>
                        ` : ''}
                        
                        ${commodity.quality.sizing ? `
                        <div class="col-md-4">
                            <h6>Sizing</h6>
                            <p class="mb-1"><strong>Method:</strong> ${commodity.quality.sizing.method}</p>
                            <p class="mb-0"><strong>Grades:</strong> ${commodity.quality.sizing.grades.join(', ')}</p>
                        </div>
                        ` : ''}
                        
                        ${commodity.quality.defects ? `
                        <div class="col-md-4">
                            <h6>Defect Tolerance</h6>
                            <p class="mb-1"><strong>Total:</strong> ${commodity.quality.defects.max_total}</p>
                            <p class="mb-0"><strong>Decay:</strong> ${commodity.quality.defects.max_decay}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Destination Requirements
    if (commodity.destinations && Object.keys(commodity.destinations).length > 0) {
        html += `
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h6 class="mb-0"><i class="bi bi-globe"></i> Destination Requirements</h6>
                </div>
                <div class="card-body">
                    <div class="accordion" id="destinationAccordion">
        `;
        
        Object.entries(commodity.destinations).forEach(([country, data], index) => {
            const isFirst = index === 0;
            html += `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button ${isFirst ? '' : 'collapsed'}" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#collapse${country}${commodity.id}">
                            <span class="badge bg-primary me-2">${country}</span>
                            ${data.treatment?.type || 'Standard Requirements'}
                            ${data.treatment?.pre_cooling === 'MANDATORY' ? 
                              '<span class="badge bg-danger ms-2">Pre-cooling MANDATORY</span>' : ''}
                        </button>
                    </h2>
                    <div id="collapse${country}${commodity.id}" 
                         class="accordion-collapse collapse ${isFirst ? 'show' : ''}" 
                         data-bs-parent="#destinationAccordion">
                        <div class="accordion-body">
                            <!-- Treatment Information -->
                            ${data.treatment ? `
                            <div class="alert alert-treatment mb-3">
                                <h6><i class="bi bi-snow"></i> Treatment Required</h6>
                                <p class="mb-1"><strong>Type:</strong> ${data.treatment.type}</p>
                                <p class="mb-1"><strong>Protocol:</strong> ${data.treatment.protocol}</p>
                                ${data.treatment.duration ? `<p class="mb-1"><strong>Duration:</strong> ${data.treatment.duration}</p>` : ''}
                                ${data.treatment.pulp_temp ? `<p class="mb-1"><strong>Pulp Temp:</strong> ${data.treatment.pulp_temp}</p>` : ''}
                                ${data.treatment.pre_cooling ? `
                                <p class="mb-0">
                                    <strong>Pre-cooling:</strong> 
                                    <span class="badge ${data.treatment.pre_cooling === 'MANDATORY' ? 'bg-danger' : 'bg-warning'}">
                                        ${data.treatment.pre_cooling}
                                    </span>
                                </p>
                                ` : ''}
                            </div>
                            ` : ''}
                            
                            <!-- Documents Required -->
                            ${data.documents && data.documents.length > 0 ? `
                            <div class="alert alert-phyto mb-3">
                                <h6><i class="bi bi-file-text"></i> Required Documents</h6>
                                <ul class="mb-0">
                                    ${data.documents.map(doc => `<li>${doc}</li>`).join('')}
                                </ul>
                            </div>
                            ` : ''}
                            
                            <!-- Special Requirements -->
                            ${data.special_requirements && data.special_requirements.length > 0 ? `
                            <div class="alert alert-cbs">
                                <h6><i class="bi bi-exclamation-triangle"></i> Special Requirements & Notes</h6>
                                <ul class="mb-0">
                                    ${data.special_requirements.map(req => `<li>${req}</li>`).join('')}
                                </ul>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div></div></div>`;
    }
    
    // Operational Notes
    if (commodity.operational_notes) {
        html += `
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h6 class="mb-0"><i class="bi bi-lightbulb"></i> Operational Notes & Best Practices</h6>
                </div>
                <div class="card-body">
                    ${commodity.operational_notes.cbs_management ? `
                    <div class="alert alert-warning">
                        <h6><i class="bi bi-shield-exclamation"></i> CBS Management</h6>
                        <p class="mb-0">${commodity.operational_notes.cbs_management}</p>
                    </div>
                    ` : ''}
                    
                    <div class="row">
                        ${commodity.operational_notes.sa_provinces ? `
                        <div class="col-md-6">
                            <h6>SA Production Areas</h6>
                            <p>${commodity.operational_notes.sa_provinces.join(', ')}</p>
                        </div>
                        ` : ''}
                        
                        ${commodity.operational_notes.seasonal_restrictions ? `
                        <div class="col-md-6">
                            <h6>Seasonal Restrictions</h6>
                            <p>${commodity.operational_notes.seasonal_restrictions}</p>
                        </div>
                        ` : ''}
                    </div>
                    
                    ${commodity.operational_notes.best_practices && commodity.operational_notes.best_practices.length > 0 ? `
                    <div class="mt-3">
                        <h6>Best Practices</h6>
                        <ul>
                            ${commodity.operational_notes.best_practices.map(practice => `<li>${practice}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Varieties
    if (commodity.varieties && commodity.varieties.length > 0) {
        html += `
            <div class="card">
                <div class="card-header bg-light">
                    <h6 class="mb-0"><i class="bi bi-tags"></i> Varieties</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Season</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${commodity.varieties.map(variety => `
                                    <tr>
                                        <td><code>${variety.code}</code></td>
                                        <td>${variety.name}</td>
                                        <td>${variety.season || 'Varies'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
    
    return html;
}

// Show welcome view
function showWelcomeView() {
    const stats = window.commodityDatabase.getStats();
    
    resultsContainer.innerHTML = `
        <div class="text-center py-5">
            <i class="bi bi-database display-1 text-success opacity-25"></i>
            <h4 class="mt-3 text-success">Perishable Commodity Intelligence Database</h4>
            <p class="lead text-muted">Expert-curated export requirements for South African perishables</p>
            
            <div class="row mt-5">
                <div class="col-md-4">
                    <div class="card border-success">
                        <div class="card-body">
                            <h2 class="text-success">${stats.total}</h2>
                            <p class="text-muted mb-0">Commodities</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-info">
                        <div class="card-body">
                            <h2 class="text-info">${Object.keys(stats.categories).length}</h2>
                            <p class="text-muted mb-0">Categories</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-warning">
                        <div class="card-body">
                            <h2 class="text-warning">${stats.destinations.length}</h2>
                            <p class="text-muted mb-0">Destinations</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-5">
                <h6 class="text-muted mb-3">Quick Start Examples:</h6>
                <div class="d-flex flex-wrap justify-content-center gap-3">
                    <button class="btn btn-outline-success" onclick="quickSearch('oranges')">
                        <i class="bi bi-apple"></i> Search Oranges
                    </button>
                    <button class="btn btn-outline-info" onclick="quickSearch('EU')">
                        <i class="bi bi-globe-europe-africa"></i> EU Requirements
                    </button>
                    <button class="btn btn-outline-warning" onclick="quickSearch('cold treatment')">
                        <i class="bi bi-snow"></i> Cold Treatment
                    </button>
                    <button class="btn btn-outline-danger" onclick="quickSearch('CBS')">
                        <i class="bi bi-shield-exclamation"></i> CBS Check
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Show no results
function showNoResults(query) {
    resultsContainer.innerHTML = `
        <div class="text-center py-5">
            <i class="bi bi-search display-1 text-muted opacity-50"></i>
            <h4 class="mt-3 text-muted">No commodities found</h4>
            <p>Your search for "${query}" didn't match any commodities in our database.</p>
            <div class="mt-4">
                <button class="btn btn-success" onclick="clearSearch()">
                    <i class="bi bi-arrow-clockwise"></i> Clear Search
                </button>
            </div>
        </div>
    `;
}

// Show error message
function showError(message) {
    resultsContainer.innerHTML = `
        <div class="alert alert-danger">
            <i class="bi bi-exclamation-octagon"></i> ${message}
        </div>
    `;
}

// Utility functions
window.clearSearch = function() {
    searchInput.value = '';
    currentCategory = 'all';
    categoryFilter.value = 'all';
    showWelcomeView();
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

window.printCommodityDetails = function() {
    if (!currentCommodityDetail) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>${currentCommodityDetail.common_name} Export Requirements</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #198754; border-bottom: 2px solid #198754; padding-bottom: 10px; }
                    h3 { color: #0d6efd; margin-top: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f8f9fa; }
                    .badge { background: #198754; color: white; padding: 2px 8px; border-radius: 3px; }
                    .alert { padding: 10px; margin: 10px 0; border-radius: 5px; }
                    .alert-warning { background-color: #fff3cd; border: 1px solid #ffeaa7; }
                    .alert-info { background-color: #d1ecf1; border: 1px solid #bee5eb; }
                    .alert-danger { background-color: #f8d7da; border: 1px solid #f5c6cb; }
                </style>
            </head>
            <body>
                <h1>${currentCommodityDetail.common_name} Export Requirements</h1>
                <p><strong>HS Code:</strong> <span class="badge">${currentCommodityDetail.hs_code}</span></p>
                <p><strong>Scientific Name:</strong> ${currentCommodityDetail.scientific_name}</p>
                <hr>
                <!-- Add simplified print content here -->
                <p>Detailed print view would be implemented here.</p>
                <p class="footer">Generated by PAXI Export Assistant on ${new Date().toLocaleDateString()}</p>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
};
