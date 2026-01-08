// Main Application Logic

// DOM Elements
const hsSearchInput = document.getElementById('hsSearchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const hsResults = document.getElementById('hsResults');
const totalCodesElement = document.getElementById('totalCodes');
const activeCodesElement = document.getElementById('activeCodes');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    setupEventListeners();
    displayQuickSearchTips();
});

// Update statistics
function updateStats() {
    totalCodesElement.textContent = hsCodes.length;
    
    // Count active exports (simplified logic - all are active)
    activeCodesElement.textContent = hsCodes.length;
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    hsSearchInput.addEventListener('input', function(e) {
        performSearch(e.target.value.trim());
    });
    
    // Clear search button
    clearSearchBtn.addEventListener('click', function() {
        hsSearchInput.value = '';
        performSearch('');
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterByCategory(filter);
        });
    });
    
    // Quick tips
    displayQuickSearchTips();
}

// Perform search
function performSearch(query) {
    if (!query) {
        displayQuickSearchTips();
        return;
    }
    
    const results = hsCodes.filter(item => 
        item.code.includes(query) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.destinations.some(dest => dest.toLowerCase().includes(query.toLowerCase()))
    );
    
    displayResults(results, query);
}

// Filter by category
function filterByCategory(category) {
    const results = hsCodes.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
    );
    
    displayResults(results, `${category} exports`);
    
    // Update filter buttons state
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.remove('btn-outline-primary', 'btn-outline-success', 'btn-outline-danger', 'btn-outline-info');
            btn.classList.add('btn-primary');
        } else {
            const originalClass = getOriginalButtonClass(btn.getAttribute('data-filter'));
            btn.classList.remove('btn-primary');
            btn.classList.add(originalClass);
        }
    });
}

// Get original button class based on filter
function getOriginalButtonClass(filter) {
    const classes = {
        'fruit': 'btn-outline-primary',
        'flower': 'btn-outline-success',
        'meat': 'btn-outline-danger',
        'vegetable': 'btn-outline-info'
    };
    return classes[filter] || 'btn-outline-secondary';
}

// Display results
function displayResults(results, query) {
    if (results.length === 0) {
        hsResults.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i>
                No HS codes found for "${query}"
                <br><small>Try a different search term or check the spelling</small>
            </div>
        `;
        return;
    }
    
    let html = `<h6 class="text-muted mb-3">Found ${results.length} result(s) for "${query}"</h6>`;
    
    results.forEach(item => {
        html += createResultCard(item);
    });
    
    hsResults.innerHTML = html;
    
    // Add copy functionality to HS codes
    document.querySelectorAll('.copy-hs-code').forEach(button => {
        button.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            copyToClipboard(code);
        });
    });
}

// Create a result card
function createResultCard(item) {
    const tempClass = getTemperatureClass(item.temperature);
    
    return `
        <div class="hs-result-item" id="hs-${item.code}">
            <div class="row">
                <div class="col-md-8">
                    <h5>
                        <span class="badge bg-primary">${item.code}</span>
                        ${item.description}
                        <button class="btn btn-sm btn-outline-secondary copy-hs-code" data-code="${item.code}" title="Copy HS Code">
                            <i class="bi bi-copy"></i>
                        </button>
                    </h5>
                    <div class="mb-2">
                        <span class="badge bg-secondary">${item.category.toUpperCase()}</span>
                        <span class="temp-indicator ${tempClass}">
                            <i class="bi bi-thermometer-half"></i> ${item.temperature}
                        </span>
                        <span class="badge bg-info">${item.season}</span>
                    </div>
                    <p class="text-muted">${item.specialNotes}</p>
                </div>
                <div class="col-md-4">
                    <div class="card bg-light">
                        <div class="card-body p-3">
                            <h6><i class="bi bi-card-checklist"></i> Requirements</h6>
                            <div class="mb-2">
                                ${item.requirements.map(req => 
                                    `<span class="badge requirement-badge bg-warning text-dark">${req}</span>`
                                ).join('')}
                            </div>
                            <h6 class="mt-3"><i class="bi bi-globe"></i> Destinations</h6>
                            <div>
                                ${item.destinations.map(dest => 
                                    `<span class="badge requirement-badge bg-success">${dest}</span>`
                                ).join('')}
                            </div>
                            <div class="mt-3">
                                <small class="d-block"><strong>Duty:</strong> ${item.duty}</small>
                                <small class="d-block"><strong>Packaging:</strong> ${item.packaging}</small>
                                <small class="d-block"><strong>Shelf Life:</strong> ${item.shelfLife}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get temperature CSS class
function getTemperatureClass(tempStr) {
    if (tempStr.includes('-18') || tempStr.includes('frozen') || tempStr.includes('Frozen')) {
        return 'temp-frozen';
    } else if (tempStr.includes('0') || tempStr.includes('1') || tempStr.includes('2') || 
               tempStr.includes('3') || tempStr.includes('4') || tempStr.includes('chilled') || 
               tempStr.includes('Chilled')) {
        return 'temp-chilled';
    } else {
        return 'temp-ambient';
    }
}

// Display quick search tips
function displayQuickSearchTips() {
    hsResults.innerHTML = `
        <div class="text-center text-muted py-4">
            <i class="bi bi-search display-1 text-primary"></i>
            <h5 class="mt-3">HS Code Search</h5>
            <p class="mb-2">Enter HS code (e.g., <strong>080510</strong>) or commodity name</p>
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="card border-0 bg-light">
                        <div class="card-body">
                            <h6><i class="bi bi-lightning"></i> Quick Searches</h6>
                            <ul class="list-unstyled text-start">
                                <li><button class="btn btn-link btn-sm p-0" onclick="performSearch('citrus')">Citrus fruits</button></li>
                                <li><button class="btn btn-link btn-sm p-0" onclick="performSearch('grapes')">Table grapes</button></li>
                                <li><button class="btn btn-link btn-sm p-0" onclick="performSearch('flowers')">Cut flowers</button></li>
                                <li><button class="btn btn-link btn-sm p-0" onclick="performSearch('beef')">Beef products</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-0 bg-light">
                        <div class="card-body">
                            <h6><i class="bi bi-info-circle"></i> Tips</h6>
                            <ul class="list-unstyled text-start small">
                                <li>• Use category buttons for filtering</li>
                                <li>• Click HS code to copy</li>
                                <li>• Check temperature requirements</li>
                                <li>• Note seasonal restrictions</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary notification
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.zIndex = '9999';
        alert.innerHTML = `
            <i class="bi bi-check-circle"></i> Copied HS Code ${text} to clipboard!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
        
        // Remove after 3 seconds
        setTimeout(() => {
            alert.remove();
        }, 3000);
    });
}

// Make functions available globally for onclick events
window.performSearch = performSearch;
