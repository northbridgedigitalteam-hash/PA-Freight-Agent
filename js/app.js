// ============================================
// PAXI - MAIN APPLICATION
// ============================================

// Global State
let currentSearchResults = [];
let currentCommodityDetail = null;

// DOM Elements
const commoditySearch = document.getElementById('commoditySearch');
const commodityResults = document.getElementById('commodityResults');
const routesTable = document.getElementById('routesTable');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('PAXI Export Assistant v2.0 initialized');
    
    // Initialize components
    initStats();
    initSearch();
    initTransitCalculator();
    initResources();
    initEventListeners();
    
    // Set default date
    document.getElementById('loadingDate').value = new Date().toISOString().split('T')[0];
});

// Initialize Statistics
function initStats() {
    document.getElementById('totalCommodities').textContent = commodities.length;
    document.getElementById('totalDestinations').textContent = countUniqueDestinations();
    document.getElementById('totalRoutes').textContent = transitTimes.routes.length;
    document.getElementById('activeExports').textContent = commodities.length * 2; // Example calculation
}

// Count unique destinations
function countUniqueDestinations() {
    const dests = new Set();
    commodities.forEach(commodity => {
        Object.keys(commodity.treatments || {}).forEach(dest => dests.add(dest));
    });
    return dests.size;
}

// Initialize Search
function initSearch() {
    // Hero search
    document.getElementById('heroSearch').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch(this.value);
    });
    
    // Main search
    commoditySearch.addEventListener('input', debounce(function(e) {
        performSearch(e.target.value.trim());
    }, 300));
    
    // Filter buttons
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            applyFilter(filter);
            updateFilterButtons(this);
        });
    });
    
    // Quick filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            const search = this.getAttribute('data-search');
            commoditySearch.value = search;
            performSearch(search);
        });
    });
}

// Initialize Transit Calculator
function initTransitCalculator() {
    // Populate routes table
    populateRoutesTable();
}

// Initialize Resources
function initResources() {
    populateResourceLinks();
}

// Initialize Event Listeners
function initEventListeners() {
    // Clear search
    window.clearSearch = function() {
        commoditySearch.value = '';
        performSearch('');
        commoditySearch.focus();
    };
    
    // Hero search
    window.heroSearch = function() {
        const query = document.getElementById('heroSearch').value;
        if (query) {
            document.getElementById('commoditySearch').value = query;
            performSearch(query);
            document.getElementById('commodity-database').scrollIntoView({ behavior: 'smooth' });
        }
    };
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Perform Search
function performSearch(query) {
    if (!query) {
        showEmptyState();
        return;
    }
    
    query = query.toLowerCase();
    const results = commodities.filter(commodity => {
        return (
            commodity.hs_code.includes(query) ||
            commodity.common_name.toLowerCase().includes(query) ||
            commodity.scientific_name.toLowerCase().includes(query) ||
            commodity.afrikaans_name.toLowerCase().includes(query) ||
            commodity.hs_description.toLowerCase().includes(query) ||
            (commodity.varieties && commodity.varieties.some(v => v.toLowerCase().includes(query))) ||
            (commodity.treatments && Object.keys(commodity.treatments).some(d => d.toLowerCase().includes(query)))
        );
    });
    
    currentSearchResults = results;
    displaySearchResults(results, query);
}

// Apply Filter
function applyFilter(filter) {
    let results;
    if (filter === 'all') {
        results = commodities;
    } else if (filter === 'citrus') {
        results = commodities.filter(c => c.subcategory === 'citrus');
    } else {
        results = commodities.filter(c => c.category === filter);
    }
    
    currentSearchResults = results;
    displaySearchResults(results, filter);
}

// Update Filter Buttons
function updateFilterButtons(activeButton) {
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.classList.remove('active', 'btn-success');
        btn.classList.add('btn-outline-success');
    });
    activeButton.classList.add('active', 'btn-success');
    activeButton.classList.remove('btn-outline-success');
}

// Display Search Results
function displaySearchResults(results, query) {
    if (results.length === 0) {
        commodityResults.innerHTML = `
            <div class="text-center py-5 animate-in">
                <i class="bi bi-search display-1 text-muted opacity-50"></i>
                <h4 class="mt-3 text-muted">No commodities found</h4>
                <p>Your search for "${query}" didn't match any commodities.</p>
                <button class="btn btn-success mt-2" onclick="clearSearch()">
                    <i class="bi bi-arrow-clockwise"></i> Clear Search
                </button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="text-success mb-0">
                <i class="bi bi-check-circle"></i> ${results.length} commodity${results.length > 1 ? 'ies' : ''} found
            </h5>
            <small class="text-muted">Click any card for details</small>
        </div>
        
        <div class="row g-4">
    `;
    
    results.forEach((commodity, index) => {
        html += createCommodityCard(commodity, index);
    });
    
    html += '</div>';
    commodityResults.innerHTML = html;
    
    // Add click handlers
    document.querySelectorAll('.commodity-card').forEach(card => {
        card.addEventListener('click', function() {
            const commodityId = this.getAttribute('data-id');
            showCommodityDetail(commodityId);
        });
    });
}

// Create Commodity Card
function createCommodityCard(commodity, index) {
    const destCount = commodity.treatments ? Object.keys(commodity.treatments).length : 0;
    
    return `
        <div class="col-md-6 col-lg-4">
            <div class="commodity-card card h-100 animate-in" 
                 style="animation-delay: ${index * 0.1}s"
                 data-id="${commodity.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <span class="badge bg-success">${commodity.hs_code}</span>
                            <span class="badge bg-info ms-1">${commodity.subcategory}</span>
                        </div>
                        <button class="btn btn-sm btn-outline-success" 
                                onclick="event.stopPropagation(); copyToClipboard('${commodity.hs_code}')">
                            <i class="bi bi-copy"></i>
                        </button>
                    </div>
                    
                    <h5 class="card-title">${commodity.common_name}</h5>
                    <p class="card-text text-muted small">
                        <i class="bi bi-flower1"></i> ${commodity.scientific_name}
                    </p>
                    
                    <div class="mb-3">
                        <span class="temp-badge temp-chilled">
                            <i class="bi bi-thermometer-half"></i> ${commodity.temperature.pulp_temp_range}
                        </span>
                        <span class="badge bg-warning text-dark ms-2">
                            <i class="bi bi-globe"></i> ${destCount} dest.
                        </span>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <small class="text-muted">
                            <i class="bi bi-shield-check"></i> ${commodity.ppecb.yellow_card_ref}
                        </small>
                        <span class="badge bg-light text-success">
                            View Details <i class="bi bi-arrow-right"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show Empty State
function showEmptyState() {
    commodityResults.innerHTML = `
        <div class="text-center py-5">
            <i class="bi bi-database display-1 text-success opacity-25"></i>
            <h4 class="mt-3 text-success">Commodity Database</h4>
            <p class="text-muted">Search for commodities using HS codes, names, or destinations</p>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="card border-success">
                        <div class="card-body">
                            <h6><i class="bi bi-search"></i> Try Searching:</h6>
                            <div class="d-flex flex-wrap gap-2 mt-3">
                                <button class="btn btn-sm btn-outline-success" onclick="performSearch('080510')">080510</button>
                                <button class="btn btn-sm btn-outline-success" onclick="performSearch('oranges')">Oranges</button>
                                <button class="btn btn-sm btn-outline-success" onclick="performSearch('citrus')">Citrus</button>
                                <button class="btn btn-sm btn-outline-success" onclick="performSearch('EU')">EU</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-info">
                        <div class="card-body">
                            <h6><i class="bi bi-info-circle"></i> Database Info</h6>
                            <ul class="list-unstyled small mb-0">
                                <li><i class="bi bi-check-circle text-success"></i> ${commodities.length} commodities</li>
                                <li><i class="bi bi-check-circle text-success"></i> PPECB protocols included</li>
                                <li><i class="bi bi-check-circle text-success"></i> Destination-specific requirements</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show Commodity Detail
function showCommodityDetail(commodityId) {
    const commodity = commodities.find(c => c.id === commodityId);
    if (!commodity) return;
    
    currentCommodityDetail = commodity;
    
    // Create detail modal
    const modalHtml = createCommodityDetailModal(commodity);
    
    // Remove existing modal
    const existingModal = document.getElementById('commodityDetailModal');
    if (existingModal) existingModal.remove();
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('commodityDetailModal'));
    modal.show();
}

// Create Commodity Detail Modal
function createCommodityDetailModal(commodity) {
    let treatmentsHtml = '';
    if (commodity.treatments) {
        Object.entries(commodity.treatments).forEach(([dest, treatment]) => {
            treatmentsHtml += `
                <div class="card mb-2">
                    <div class="card-body">
                        <h6 class="card-title">
                            <span class="badge bg-primary">${dest}</span>
                            ${treatment.required}
                        </h6>
                        <p class="card-text small mb-1">
                            <strong>Protocol:</strong> ${treatment.protocol}
                        </p>
                        <p class="card-text small mb-1">
                            <strong>Pulp Temp:</strong> ${treatment.pulp_temp}
                        </p>
                        <p class="card-text small mb-0">
                            <strong>Pre-cooling:</strong> 
                            <span class="badge ${treatment.pre_cooling === 'MANDATORY' ? 'bg-danger' : 'bg-warning'}">
                                ${treatment.pre_cooling}
                            </span>
                        </p>
                    </div>
                </div>
            `;
        });
    }
    
    return `
        <div class="modal fade" id="commodityDetailModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-box-seam"></i> ${commodity.common_name}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <table class="table table-sm">
                                    <tr>
                                        <th>HS Code:</th>
                                        <td><span class="badge bg-success">${commodity.hs_code}</span></td>
                                    </tr>
                                    <tr>
                                        <th>Scientific Name:</th>
                                        <td>${commodity.scientific_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Afrikaans:</th>
                                        <td>${commodity.afrikaans_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Varieties:</th>
                                        <td>${commodity.varieties.join(', ')}</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <div class="card border-success">
                                    <div class="card-body">
                                        <h6><i class="bi bi-thermometer-half"></i> Temperature Requirements</h6>
                                        <p class="mb-1"><strong>Pulp Temp:</strong> ${commodity.temperature.pulp_temp_range}</p>
                                        <p class="mb-1"><strong>Transit Temp:</strong> ${commodity.temperature.transit_temp}</p>
                                        <p class="mb-1"><strong>Humidity:</strong> ${commodity.temperature.humidity}</p>
                                        <p class="mb-0"><strong>Max Storage:</strong> ${commodity.temperature.max_storage}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <h6 class="mt-4"><i class="bi bi-shield-check"></i> PPECB Protocols</h6>
                        <div class="alert alert-success">
                            <strong>Yellow Card:</strong> ${commodity.ppecb.yellow_card_ref}<br>
                            <strong>Protocol:</strong> ${commodity.ppecb.protocol_version}<br>
                            <strong>Loading:</strong> ${commodity.ppecb.loading_protocol}
                        </div>
                        
                        <h6 class="mt-4"><i class="bi bi-globe"></i> Destination Requirements</h6>
                        <div id="treatmentsList">
                            ${treatmentsHtml || '<p class="text-muted">No destination requirements configured.</p>'}
                        </div>
                        
                        <div class="mt-4 text-center">
                            <button class="btn btn-success" onclick="printCommodityDetails('${commodity.id}')">
                                <i class="bi bi-printer"></i> Print Details
                            </button>
                            <button class="btn btn-outline-success ms-2" 
                                    onclick="copyCommodityDetails('${commodity.id}')">
                                <i class="bi bi-clipboard"></i> Copy to Clipboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Populate Routes Table
function populateRoutesTable() {
    if (!routesTable) return;
    
    let html = '';
    transitTimes.routes.forEach(route => {
        const statusClass = getStatusClass(route.status);
        html += `
            <tr>
                <td>
                    <strong>${route.origin}</strong><br>
                    <i class="bi bi-arrow-right text-success"></i><br>
                    <strong>${route.destination}</strong>
                </td>
                <td><span class="badge bg-info">${route.carrier}</span></td>
                <td><strong class="text-success">${route.transit_days}</strong> days</td>
                <td>${route.frequency}</td>
                <td><span class="badge ${statusClass}">${route.status}</span></td>
            </tr>
        `;
    });
    
    routesTable.innerHTML = html;
}

// Get Status Class
function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'normal': return 'bg-success';
        case 'busy': return 'bg-warning';
        case 'congested': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

// Calculate Transit Time
window.calculateTransitTime = function() {
    const origin = document.getElementById('originPort').value;
    const destination = document.getElementById('destinationPort').value;
    const carrier = document.getElementById('carrierSelect').value;
    const loadingDate = document.getElementById('loadingDate').value;
    
    if (!origin || !destination) {
        alert('Please select both origin and destination ports');
        return;
    }
    
    // Find route
    let route = transitTimes.routes.find(r => 
        r.origin_code === origin && 
        r.destination_code === destination
    );
    
    if (carrier && route && route.carrier !== carrier) {
        route = transitTimes.routes.find(r => 
            r.origin_code === origin && 
            r.destination_code === destination &&
            r.carrier === carrier
        );
    }
    
    if (!route) {
        document.getElementById('routeDetails').innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i> No direct route found.
                Please check the routes table for available options.
            </div>
        `;
    } else {
        // Calculate dates
        const loadDate = new Date(loadingDate);
        const arrivalDate = new Date(loadDate);
        arrivalDate.setDate(arrivalDate.getDate() + route.transit_days);
        
        const congestion = transitTimes.portCongestion[destination] || { status: 'Normal', delay_days: 0 };
        
        document.getElementById('routeDetails').innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Route Information</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Route:</strong></td><td>${route.origin} → ${route.destination}</td></tr>
                        <tr><td><strong>Carrier:</strong></td><td>${route.carrier}</td></tr>
                        <tr><td><strong>Transit Time:</strong></td><td>${route.transit_days} days</td></tr>
                        <tr><td><strong>Frequency:</strong></td><td>${route.frequency}</td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6>Schedule</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Load Date:</strong></td><td>${loadDate.toDateString()}</td></tr>
                        <tr><td><strong>Arrival Date:</strong></td><td>${arrivalDate.toDateString()}</td></tr>
                        <tr><td><strong>Port Status:</strong></td>
                            <td><span class="badge ${getStatusClass(congestion.status)}">${congestion.status}</span>
                            ${congestion.delay_days > 0 ? `(+${congestion.delay_days} days)` : ''}</td>
                        </tr>
                    </table>
                </div>
            </div>
        `;
    }
    
    document.getElementById('transitResults').classList.remove('d-none');
};

// Populate Resource Links
function populateResourceLinks() {
    // PPECB Links
    const ppecbContainer = document.getElementById('ppecbLinks');
    if (ppecbContainer) {
        ppecbContainer.innerHTML = resourceLinks.ppecb.map(link => `
            <a href="${link.url}" target="_blank" class="d-block mb-2 p-2 border-start border-success border-3 bg-light text-decoration-none">
                <strong>${link.title}</strong><br>
                <small class="text-muted">${link.description}</small>
            </a>
        `).join('');
    }
    
    // Government Links
    const govContainer = document.getElementById('govLinks');
    if (govContainer) {
        govContainer.innerHTML = resourceLinks.nda.map(link => `
            <a href="${link.url}" target="_blank" class="d-block mb-2 p-2 border-start border-primary border-3 bg-light text-decoration-none">
                <strong>${link.title}</strong><br>
                <small class="text-muted">${link.description}</small>
            </a>
        `).join('');
    }
    
    // Carrier Links
    const carrierContainer = document.getElementById('carrierLinks');
    if (carrierContainer) {
        carrierContainer.innerHTML = resourceLinks.carriers.map(link => `
            <a href="${link.url}" target="_blank" class="d-block mb-2 p-2 border-start border-warning border-3 bg-light text-decoration-none">
                <strong>${link.title}</strong><br>
                <small class="text-muted">${link.description}</small>
            </a>
        `).join('');
    }
}

// Search Resources
window.searchResources = function() {
    const query = document.getElementById('resourceSearch').value.toLowerCase();
    if (!query) return;
    
    // Combine all resources
    const allResources = [
        ...resourceLinks.ppecb.map(r => ({...r, type: 'PPECB'})),
        ...resourceLinks.nda.map(r => ({...r, type: 'Government'})),
        ...resourceLinks.carriers.map(r => ({...r, type: 'Carrier'}))
    ];
    
    const results = allResources.filter(resource => 
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
        alert('No resources found for your search');
        return;
    }
    
    let html = '<h6>Search Results:</h6>';
    results.forEach(resource => {
        html += `
            <div class="card mb-2">
                <div class="card-body">
                    <h6>${resource.title}</h6>
                    <p class="small mb-2">${resource.description}</p>
                    <div class="d-flex justify-content-between">
                        <span class="badge bg-info">${resource.type}</span>
                        <a href="${resource.url}" target="_blank" class="btn btn-sm btn-success">
                            Visit <i class="bi bi-box-arrow-up-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Show in modal
    const modalHtml = `
        <div class="modal fade" id="resourceSearchModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-search"></i> Resource Search Results
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${html}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('resourceSearchModal');
    if (existingModal) existingModal.remove();
    
    // Add and show new modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('resourceSearchModal'));
    modal.show();
};

// Utility Functions
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show toast
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

window.printCommodityDetails = function(commodityId) {
    const commodity = commodities.find(c => c.id === commodityId);
    if (!commodity) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>${commodity.common_name} Export Requirements</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #198754; }
                    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f8f9fa; }
                    .badge { background: #198754; color: white; padding: 2px 8px; border-radius: 3px; }
                </style>
            </head>
            <body>
                <h1>${commodity.common_name} Export Requirements</h1>
                <p><strong>HS Code:</strong> <span class="badge">${commodity.hs_code}</span></p>
                <p><strong>Scientific Name:</strong> ${commodity.scientific_name}</p>
                
                <h3>Temperature Requirements</h3>
                <table>
                    <tr><th>Pulp Temperature</th><td>${commodity.temperature.pulp_temp_range}</td></tr>
                    <tr><th>Transit Temperature</th><td>${commodity.temperature.transit_temp}</td></tr>
                    <tr><th>Humidity</th><td>${commodity.temperature.humidity}</td></tr>
                    <tr><th>Max Storage</th><td>${commodity.temperature.max_storage}</td></tr>
                </table>
                
                <h3>PPECB Protocols</h3>
                <p><strong>Yellow Card:</strong> ${commodity.ppecb.yellow_card_ref}</p>
                <p><strong>Protocol Version:</strong> ${commodity.ppecb.protocol_version}</p>
                
                <h3>Destination Requirements</h3>
                ${Object.entries(commodity.treatments || {}).map(([dest, treatment]) => `
                    <h4>${dest}</h4>
                    <table>
                        <tr><th>Treatment Required</th><td>${treatment.required}</td></tr>
                        <tr><th>Protocol</th><td>${treatment.protocol}</td></tr>
                        <tr><th>Pulp Temperature</th><td>${treatment.pulp_temp}</td></tr>
                        <tr><th>Pre-cooling</th><td>${treatment.pre_cooling}</td></tr>
                    </table>
                `).join('')}
                
                <p class="footer">Generated by PAXI Export Assistant on ${new Date().toLocaleDateString()}</p>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
};

window.copyCommodityDetails = function(commodityId) {
    const commodity = commodities.find(c => c.id === commodityId);
    if (!commodity) return;
    
    let text = `${commodity.common_name} (${commodity.hs_code})\n`;
    text += `Scientific Name: ${commodity.scientific_name}\n`;
    text += `Temperature: ${commodity.temperature.pulp_temp_range}\n\n`;
    text += `PPECB Yellow Card: ${commodity.ppecb.yellow_card_ref}\n\n`;
    text += `Destination Requirements:\n`;
    
    Object.entries(commodity.treatments || {}).forEach(([dest, treatment]) => {
        text += `${dest}: ${treatment.required}\n`;
        text += `  Protocol: ${treatment.protocol}\n`;
        text += `  Pulp Temp: ${treatment.pulp_temp}\n`;
        text += `  Pre-cooling: ${treatment.pre_cooling}\n\n`;
    });
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Commodity details copied to clipboard!');
    });
};
