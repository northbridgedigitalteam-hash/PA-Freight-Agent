// ============================================
// FREIGHT ASSISTANT - MAIN APPLICATION
// Commodity Database with PPECB Protocols
// ============================================

// State Management
let currentCommodity = null;
let searchResults = [];

// DOM Elements
const hsSearchInput = document.getElementById('hsSearchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const hsResults = document.getElementById('hsResults');
const totalCodesElement = document.getElementById('totalCodes');
const activeCodesElement = document.getElementById('activeCodes');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('Freight Assistant v2.0 loaded');
    console.log('Commodities loaded:', commodities.length);
    
    updateStats();
    setupEventListeners();
    displayQuickSearchTips();
    
    // Auto-focus search box
    setTimeout(() => {
        hsSearchInput.focus();
    }, 500);
});

// Update Statistics
function updateStats() {
    totalCodesElement.textContent = commodities.length;
    activeCodesElement.textContent = commodities.filter(c => c.treatments && Object.keys(c.treatments).length > 0).length;
}

// Setup Event Listeners
function setupEventListeners() {
    // Search input with debounce (300ms delay)
    let searchTimeout;
    hsSearchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value.trim());
        }, 300);
    });
    
    // Clear search button
    clearSearchBtn.addEventListener('click', function() {
        hsSearchInput.value = '';
        performSearch('');
        hsSearchInput.focus();
    });
    
    // Enter key to search
    hsSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value.trim());
        }
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterByCategory(filter);
        });
    });
}

// Perform Search with Multiple Criteria
function performSearch(query) {
    if (!query) {
        displayQuickSearchTips();
        return;
    }
    
    query = query.toLowerCase();
    
    // Enhanced search across multiple fields
    const results = commodities.filter(item => {
        return (
            // HS Code search
            item.hs_code.includes(query) ||
            // Common name search
            item.common_name.toLowerCase().includes(query) ||
            // Scientific name search
            (item.scientific_name && item.scientific_name.toLowerCase().includes(query)) ||
            // Variety search
            (item.varieties && item.varieties.some(v => v.toLowerCase().includes(query))) ||
            // Description search
            item.hs_description.toLowerCase().includes(query) ||
            // Destination search in treatments
            (item.treatments && Object.keys(item.treatments).some(dest => dest.toLowerCase().includes(query))) ||
            // Treatment type search
            (item.treatments && Object.values(item.treatments).some(t => t.required.toLowerCase().includes(query)))
        );
    });
    
    searchResults = results;
    displaySearchResults(results, query);
}

// Display Search Results
function displaySearchResults(results, query) {
    if (results.length === 0) {
        hsResults.innerHTML = `
            <div class="alert alert-warning animate__animated animate__fadeIn">
                <div class="d-flex">
                    <div class="me-3">
                        <i class="bi bi-search display-4 text-warning"></i>
                    </div>
                    <div>
                        <h5>No commodities found</h5>
                        <p class="mb-1">Your search "<strong>${query}</strong>" didn't match any commodities.</p>
                        <p class="mb-0 small">Try: <code>080510</code>, <code>oranges</code>, <code>citrus</code>, or <code>EU</code></p>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="text-success mb-0">
                <i class="bi bi-check-circle-fill"></i> Found ${results.length} commodity${results.length > 1 ? 's' : ''}
            </h6>
            <div class="text-muted small">
                <i class="bi bi-info-circle"></i> Click any result for detailed view
            </div>
        </div>
    `;
    
    results.forEach((item, index) => {
        html += createCommodityCard(item, index);
    });
    
    hsResults.innerHTML = html;
    
    // Add click handlers to each card
    document.querySelectorAll('.commodity-card').forEach(card => {
        card.addEventListener('click', function() {
            const commodityId = this.getAttribute('data-id');
            showCommodityDetail(commodityId);
        });
    });
}

// Create Commodity Card (Summary View)
function createCommodityCard(item, index) {
    const treatmentsCount = item.treatments ? Object.keys(item.treatments).length : 0;
    
    return `
        <div class="commodity-card card border-success mb-3 animate__animated animate__fadeInUp" 
             style="animation-delay: ${index * 0.1}s"
             data-id="${item.id}">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <div class="d-flex align-items-start mb-2">
                            <div class="me-3">
                                <span class="badge bg-success fs-6">${item.hs_code}</span>
                            </div>
                            <div>
                                <h5 class="card-title mb-1">${item.common_name}</h5>
                                <p class="card-text text-muted small mb-2">
                                    <i class="bi bi-flower1"></i> ${item.scientific_name || 'Scientific name not specified'}
                                </p>
                                <p class="card-text">${item.hs_description}</p>
                            </div>
                        </div>
                        
                        <div class="mb-2">
                            <span class="badge bg-info me-1">
                                <i class="bi bi-thermometer-half"></i> ${item.temperature?.pulp_temp_range || 'N/A'}
                            </span>
                            <span class="badge bg-warning text-dark me-1">
                                <i class="bi bi-shield-check"></i> ${treatmentsCount} destinations
                            </span>
                            <span class="badge bg-secondary me-1">
                                <i class="bi bi-calendar-event"></i> ${item.seasonality?.peak_months?.join(', ') || 'Year-round'}
                            </span>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="text-end">
                            <div class="mb-2">
                                <small class="text-muted d-block">PPECB Reference</small>
                                <code class="bg-light p-1 rounded">${item.ppecb?.yellow_card_ref || 'Not specified'}</code>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-outline-success">
                                    <i class="bi bi-arrow-right-circle"></i> View Details
                                </button>
                                <button class="btn btn-sm btn-outline-primary copy-hs-btn" 
                                        onclick="event.stopPropagation(); copyToClipboard('${item.hs_code}')">
                                    <i class="bi bi-copy"></i> Copy HS
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show Detailed Commodity View
function showCommodityDetail(commodityId) {
    const commodity = commodities.find(c => c.id === commodityId);
    if (!commodity) return;
    
    currentCommodity = commodity;
    
    // Create detailed HTML
    let html = `
        <div class="commodity-detail animate__animated animate__fadeIn">
            <!-- Back Button -->
            <div class="mb-4">
                <button class="btn btn-outline-secondary" onclick="showSearchResults()">
                    <i class="bi bi-arrow-left"></i> Back to Search
                </button>
            </div>
            
            <!-- Commodity Header -->
            <div class="card border-success mb-4">
                <div class="card-header bg-success text-white">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 class="mb-0">
                                <span class="badge bg-light text-dark fs-5 me-2">${commodity.hs_code}</span>
                                ${commodity.common_name}
                            </h4>
                            <p class="mb-0 small opacity-75">
                                ${commodity.scientific_name} • ${commodity.hs_description}
                            </p>
                        </div>
                        <button class="btn btn-light" onclick="printCommodityDetails()">
                            <i class="bi bi-printer"></i> Print
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <!-- Basic Info -->
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <h6><i class="bi bi-info-circle text-success"></i> Basic Information</h6>
                            <table class="table table-sm">
                                <tr>
                                    <th width="40%">Afrikaans Name:</th>
                                    <td>${commodity.afrikaans_name || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <th>Varieties:</th>
                                    <td>${commodity.varieties ? commodity.varieties.join(', ') : 'Not specified'}</td>
                                </tr>
                                <tr>
                                    <th>Category:</th>
                                    <td><span class="badge bg-success">${commodity.category}</span> / 
                                        <span class="badge bg-info">${commodity.subcategory}</span></td>
                                </tr>
                                <tr>
                                    <th>Season (SA):</th>
                                    <td>${commodity.seasonality?.northern_hemisphere || 'N/A'}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-md-6">
                            <h6><i class="bi bi-shield-check text-success"></i> PPECB Protocols</h6>
                            <div class="alert alert-light border-success">
                                <strong>Yellow Card:</strong> ${commodity.ppecb?.yellow_card_ref || 'Not specified'}<br>
                                <strong>Protocol:</strong> ${commodity.ppecb?.protocol_version || 'N/A'}<br>
                                <strong>Loading:</strong> ${commodity.ppecb?.loading_protocol || 'Standard protocol'}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Temperature & Storage -->
                    <div class="card mb-4 border-info">
                        <div class="card-header bg-info text-white">
                            <h6 class="mb-0"><i class="bi bi-thermometer-half"></i> Temperature & Storage Requirements</h6>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3 text-center">
                                    <div class="display-6 text-primary">${commodity.temperature?.pulp_temp_range || 'N/A'}</div>
                                    <small class="text-muted">Pulp Temperature Range</small>
                                </div>
                                <div class="col-md-3 text-center">
                                    <div class="display-6 text-success">${commodity.temperature?.humidity || 'N/A'}</div>
                                    <small class="text-muted">Relative Humidity</small>
                                </div>
                                <div class="col-md-3 text-center">
                                    <div class="display-6 text-warning">${commodity.temperature?.max_storage_days || 'N/A'}</div>
                                    <small class="text-muted">Max Storage Days</small>
                                </div>
                                <div class="col-md-3 text-center">
                                    <div class="display-6 text-danger">${commodity.temperature?.chilling_injury_threshold || 'N/A'}</div>
                                    <small class="text-muted">Chilling Injury Temp</small>
                                </div>
                            </div>
                            <div class="mt-3">
                                <strong>Notes:</strong> ${commodity.temperature?.notes || 'Maintain consistent temperature throughout transit'}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Destination Requirements -->
                    <h5 class="border-bottom pb-2 mb-3">
                        <i class="bi bi-globe text-success"></i> Destination-Specific Requirements
                    </h5>
                    
                    <div class="accordion" id="destinationAccordion">
    `;
    
    // Add each destination requirement
    if (commodity.treatments) {
        Object.entries(commodity.treatments).forEach(([dest, treatment], index) => {
            const destInfo = destinations[dest] || { full_name: dest };
            const isFirst = index === 0;
            
            html += `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button ${isFirst ? '' : 'collapsed'}" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#collapse${dest}${commodity.id}">
                            <span class="badge bg-primary me-2">${dest}</span>
                            ${destInfo.full_name}
                            <span class="ms-auto badge ${treatment.pre_cooling?.includes('MANDATORY') ? 'bg-danger' : 'bg-warning'}">
                                ${treatment.pre_cooling || 'Check pre-cooling'}
                            </span>
                        </button>
                    </h2>
                    <div id="collapse${dest}${commodity.id}" 
                         class="accordion-collapse collapse ${isFirst ? 'show' : ''}" 
                         data-bs-parent="#destinationAccordion">
                        <div class="accordion-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <table class="table table-sm">
                                        <tr>
                                            <th width="40%">Treatment Required:</th>
                                            <td><strong class="text-success">${treatment.required}</strong></td>
                                        </tr>
                                        <tr>
                                            <th>Protocol:</th>
                                            <td>${treatment.protocol}</td>
                                        </tr>
                                        <tr>
                                            <th>Pulp Temp:</th>
                                            <td><code>${treatment.pulp_temp}</code></td>
                                        </tr>
                                        <tr>
                                            <th>Pre-cooling:</th>
                                            <td>
                                                <span class="badge ${treatment.pre_cooling?.includes('MANDATORY') ? 'bg-danger' : 'bg-warning'}">
                                                    ${treatment.pre_cooling}
                                                </span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="col-md-6">
                                    <div class="alert alert-light border">
                                        <strong><i class="bi bi-file-text"></i> Required Documents:</strong>
                                        <ul class="mb-0 mt-2">
                                            ${treatment.documentation?.map(doc => `<li>${doc}</li>`).join('') || '<li>Standard documentation</li>'}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2">
                                <strong>Notes:</strong> ${treatment.notes || 'Standard protocol applies'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        html += `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i> No destination-specific requirements configured.
            </div>
        `;
    }
    
    html += `
                    </div> <!-- End accordion -->
                    
                    <!-- Quality Standards -->
                    <div class="card mt-4 border-warning">
                        <div class="card-header bg-warning text-dark">
                            <h6 class="mb-0"><i class="bi bi-clipboard-check"></i> Quality Standards</h6>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <strong>Sizing:</strong><br>
                                    ${commodity.quality?.sizing?.standard || 'N/A'}<br>
                                    <small class="text-muted">${commodity.quality?.sizing?.grades?.join(', ') || ''}</small>
                                </div>
                                <div class="col-md-4">
                                    <strong>Brix/Acid:</strong><br>
                                    Min: ${commodity.quality?.brix?.minimum || 'N/A'}<br>
                                    Optimum: ${commodity.quality?.brix?.optimum || 'N/A'}
                                </div>
                                <div class="col-md-4">
                                    <strong>Defects Allowed:</strong><br>
                                    Total: ${commodity.quality?.defects?.max_total || 'N/A'}<br>
                                    Decay: ${commodity.quality?.defects?.max_decay || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Special Notes -->
                    ${commodity.special_notes && commodity.special_notes.length > 0 ? `
                    <div class="alert alert-danger mt-4">
                        <h6><i class="bi bi-exclamation-octagon"></i> Special Notes & Warnings</h6>
                        <ul class="mb-0">
                            ${commodity.special_notes.map(note => `<li>${note}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    hsResults.innerHTML = html;
}

// Show Search Results Again
function showSearchResults() {
    displaySearchResults(searchResults, '');
}

// Filter by Category
function filterByCategory(category) {
    const results = commodities.filter(item => 
        item.category.toLowerCase() === category.toLowerCase() ||
        item.subcategory?.toLowerCase() === category.toLowerCase()
    );
    
    searchResults = results;
    displaySearchResults(results, category);
    
    // Update button states
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.remove('btn-outline-primary', 'btn-outline-success', 'btn-outline-danger', 'btn-outline-info');
            btn.classList.add('btn-success', 'text-white');
        } else {
            const originalClass = getOriginalButtonClass(btn.getAttribute('data-filter'));
            btn.classList.remove('btn-success', 'text-white');
            btn.classList.add(originalClass);
        }
    });
}

// Get Original Button Class
function getOriginalButtonClass(filter) {
    const classes = {
        'fruit': 'btn-outline-success',
        'flower': 'btn-outline-info',
        'meat': 'btn-outline-danger',
        'vegetable': 'btn-outline-warning'
    };
    return classes[filter] || 'btn-outline-secondary';
}

// Display Quick Search Tips
function displayQuickSearchTips() {
    hsResults.innerHTML = `
        <div class="text-center text-muted py-5 animate__animated animate__fadeIn">
            <i class="bi bi-search display-1 text-success opacity-50"></i>
            <h4 class="mt-4 text-success">Perishable Commodity Database</h4>
            <p class="lead">Search by HS code, commodity name, or destination</p>
            
            <div class="row mt-5">
                <div class="col-md-8 offset-md-2">
                    <div class="card border-success">
                        <div class="card-header bg-success text-white">
                            <i class="bi bi-lightbulb"></i> Quick Search Examples
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6><i class="bi bi-upc-scan"></i> By HS Code:</h6>
                                    <div class="d-flex flex-wrap gap-2 mb-3">
                                        <button class="btn btn-sm btn-outline-success" onclick="performSearch('080510')">080510 - Oranges</button>
                                        <button class="btn btn-sm btn-outline-success" onclick="performSearch('080540')">080540 - Grapefruit</button>
                                        <button class="btn btn-sm btn-outline-success" onclick="performSearch('080550')">080550 - Lemons</button>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h6><i class="bi bi-globe"></i> By Destination:</h6>
                                    <div class="d-flex flex-wrap gap-2 mb-3">
                                        <button class="btn btn-sm btn-outline-primary" onclick="performSearch('EU')">European Union</button>
                                        <button class="btn btn-sm btn-outline-primary" onclick="performSearch('US')">United States</button>
                                        <button class="btn btn-sm btn-outline-primary" onclick="performSearch('China')">China</button>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <p class="mb-0 small">
                                <i class="bi bi-info-circle"></i> This database includes PPECB Yellow Card protocols, 
                                temperature requirements, and destination-specific treatments.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show notification
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.zIndex = '9999';
        alert.style.minWidth = '300px';
        alert.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-check-circle-fill fs-4 me-3"></i>
                <div>
                    <strong>Copied!</strong><br>
                    <small>HS Code ${text} copied to clipboard</small>
                </div>
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
            </div>
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => alert.remove(), 3000);
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

// Print Commodity Details
function printCommodityDetails() {
    if (!currentCommodity) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>${currentCommodity.common_name} - Export Requirements</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none; }
                        .card { border: 1px solid #000 !important; }
                        .badge { border: 1px solid #000; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="mt-4">${currentCommodity.common_name} Export Requirements</h1>
                    <p class="text-muted">HS Code: ${currentCommodity.hs_code} | Generated: ${new Date().toLocaleDateString()}</p>
                    <hr>
                    <!-- Add print content here -->
                    <p>Print functionality will be completed in next update.</p>
                    <div class="mt-5 text-center text-muted small no-print">
                        <hr>
                        <p>SA Freight Assistant - Internal Use Only</p>
                    </div>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
}

// Make functions available globally
window.performSearch = performSearch;
window.copyToClipboard = copyToClipboard;
window.showSearchResults = showSearchResults;
