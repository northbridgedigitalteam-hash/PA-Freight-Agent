// ============================================
// RSS NEWS FEED MANAGER FOR PAXI
// ============================================

class NewsManager {
    constructor() {
        this.newsSources = {
            freshplaza: {
                name: 'FreshPlaza Africa',
                url: 'https://www.freshplaza.com/africa/rss/',
                color: 'success',
                icon: 'bi-globe'
            },
            knewnagel: {
                name: 'Kuehne+Nagel News',
                url: 'https://mykn.kuehne-nagel.com/news/rss/',
                color: 'primary',
                icon: 'bi-truck'
            }
        };
        
        this.allNews = [];
        this.cacheDuration = 30 * 60 * 1000; // 30 minutes cache
        this.lastUpdate = null;
    }

    // Load all news feeds
    async loadAllNews() {
        try {
            console.log('Loading news feeds...');
            
            // Show loading states
            this.showLoading('freshplaza');
            this.showLoading('kn');
            this.showLoading('all');
            
            // Load FreshPlaza news
            const freshplazaNews = await this.fetchRSS(this.newsSources.freshplaza.url, 'freshplaza');
            
            // Try to load Kuehne+Nagel news
            let knNews = [];
            try {
                knNews = await this.fetchRSS(this.newsSources.knewnagel.url, 'knewnagel');
            } catch (error) {
                console.warn('Failed to load Kuehne+Nagel RSS, using fallback:', error);
                knNews = this.getFallbackKNNews();
            }
            
            // Combine and sort by date
            this.allNews = [...freshplazaNews, ...knNews]
                .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
                .slice(0, 20); // Limit to 20 articles
            
            // Update display
            this.displayNewsBySource('freshplaza', freshplazaNews.slice(0, 6));
            this.displayNewsBySource('kn', knNews.slice(0, 6));
            this.displayAllNews(this.allNews.slice(0, 12));
            
            this.lastUpdate = new Date();
            this.updateLastUpdateTime();
            
        } catch (error) {
            console.error('Error loading news:', error);
            this.showError('Failed to load news feeds. Please try again later.');
        }
    }

    // Fetch RSS feed
    async fetchRSS(url, source) {
        try {
            // Use CORS proxy to avoid CORS issues
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const response = await fetch(`${proxyUrl}${encodeURIComponent(url)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            return this.parseRSS(text, source);
            
        } catch (error) {
            console.error(`Error fetching RSS from ${source}:`, error);
            return [];
        }
    }

    // Parse RSS XML
    parseRSS(xmlText, source) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const items = xmlDoc.getElementsByTagName('item');
        const news = [];
        
        for (let i = 0; i < Math.min(items.length, 10); i++) {
            const item = items[i];
            
            const title = item.getElementsByTagName('title')[0]?.textContent || 'No title';
            const link = item.getElementsByTagName('link')[0]?.textContent || '#';
            const description = item.getElementsByTagName('description')[0]?.textContent || '';
            const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || new Date().toISOString();
            const content = item.getElementsByTagName('content:encoded')[0]?.textContent || description;
            
            // Extract image from content
            const imageMatch = content.match(/<img[^>]+src="([^">]+)"/);
            const image = imageMatch ? imageMatch[1] : this.getDefaultImage(source);
            
            news.push({
                id: `news_${source}_${i}_${Date.now()}`,
                title: this.cleanText(title),
                link: link,
                description: this.cleanText(description),
                excerpt: this.getExcerpt(this.cleanText(description), 150),
                image: image,
                source: source,
                sourceName: this.newsSources[source]?.name || source,
                pubDate: pubDate,
                formattedDate: this.formatDate(pubDate),
                color: this.newsSources[source]?.color || 'secondary',
                icon: this.newsSources[source]?.icon || 'bi-newspaper'
            });
        }
        
        return news;
    }

    // Display news by source
    displayNewsBySource(source, news) {
        const containerId = `${source}News`;
        const container = document.getElementById(containerId);
        
        if (!container) return;
        
        if (news.length === 0) {
            container.innerHTML = this.getNoNewsHTML(source);
            return;
        }
        
        let html = '';
        news.forEach((item, index) => {
            html += this.createNewsCard(item, index);
        });
        
        container.innerHTML = html;
        this.attachNewsClickHandlers(source);
    }

    // Display all news mixed
    displayAllNews(news) {
        const container = document.getElementById('allNews');
        
        if (!container) return;
        
        if (news.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-newspaper display-4 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">No news available at the moment.</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        news.forEach((item, index) => {
            html += this.createNewsCard(item, index);
        });
        
        container.innerHTML = html;
        this.attachNewsClickHandlers('all');
    }

    // Create news card HTML
    createNewsCard(newsItem, index) {
        return `
            <div class="col-md-6 col-lg-4">
                <div class="news-card card h-100 animate-in" 
                     style="animation-delay: ${index * 0.1}s"
                     data-news-id="${newsItem.id}">
                    
                    ${newsItem.image ? `
                    <img src="${newsItem.image}" class="news-image" alt="${newsItem.title}">
                    ` : ''}
                    
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-${newsItem.color}">${newsItem.sourceName}</span>
                            <small class="text-muted">${newsItem.formattedDate}</small>
                        </div>
                        
                        <h6 class="news-title mb-2">${newsItem.title}</h6>
                        
                        <p class="news-excerpt mb-3 flex-grow-1">${newsItem.excerpt}</p>
                        
                        <div class="mt-auto">
                            <button class="btn btn-sm btn-outline-${newsItem.color} w-100 read-more-btn">
                                <i class="bi ${newsItem.icon}"></i> Read Article
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Attach click handlers to news cards
    attachNewsClickHandlers(source) {
        const cards = document.querySelectorAll(`#${source}News .news-card`);
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('read-more-btn')) {
                    const newsId = card.getAttribute('data-news-id');
                    this.showNewsDetails(newsId);
                }
            });
            
            const readMoreBtn = card.querySelector('.read-more-btn');
            if (readMoreBtn) {
                readMoreBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const newsId = card.getAttribute('data-news-id');
                    this.showNewsDetails(newsId);
                });
            }
        });
    }

    // Show news article details in modal
    showNewsDetails(newsId) {
        const newsItem = this.allNews.find(item => item.id === newsId);
        if (!newsItem) return;
        
        // Set modal title
        document.getElementById('newsModalTitle').textContent = newsItem.title;
        
        // Build modal content
        let content = '';
        
        if (newsItem.image) {
            content += `
                <div class="text-center mb-4">
                    <img src="${newsItem.image}" class="img-fluid rounded" alt="${newsItem.title}" 
                         style="max-height: 300px; object-fit: cover;">
                </div>
            `;
        }
        
        content += `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-${newsItem.color}">${newsItem.sourceName}</span>
                <small class="text-muted"><i class="bi bi-calendar"></i> ${newsItem.formattedDate}</small>
            </div>
            
            <div class="news-content mb-4">
                ${newsItem.description || newsItem.excerpt}
            </div>
        `;
        
        // Set modal content
        document.getElementById('newsModalBody').innerHTML = content;
        
        // Set full article link
        const readFullBtn = document.getElementById('readFullArticle');
        readFullBtn.href = newsItem.link;
        readFullBtn.classList.remove('btn-success', 'btn-primary', 'btn-info');
        readFullBtn.classList.add(`btn-${newsItem.color}`);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('newsModal'));
        modal.show();
    }

    // Utility functions
    cleanText(text) {
        return text
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&nbsp;/g, ' ') // Replace &nbsp;
            .replace(/&amp;/g, '&') // Replace &amp;
            .replace(/&lt;/g, '<') // Replace &lt;
            .replace(/&gt;/g, '>') // Replace &gt;
            .replace(/&quot;/g, '"') // Replace &quot;
            .replace(/&#39;/g, "'") // Replace &#39;
            .trim();
    }

    getExcerpt(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            if (diffMins < 60) {
                return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
            } else if (diffHours < 24) {
                return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
            } else if (diffDays < 7) {
                return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
            } else {
                return date.toLocaleDateString('en-ZA', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
            }
        } catch (error) {
            return 'Recent';
        }
    }

    getDefaultImage(source) {
        const defaultImages = {
            freshplaza: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            knewnagel: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        };
        return defaultImages[source] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    }

    getNoNewsHTML(source) {
        return `
            <div class="col-12 text-center py-5">
                <i class="bi bi-wifi-off display-4 text-muted opacity-50"></i>
                <p class="mt-3 text-muted">Unable to load ${this.newsSources[source]?.name || source} news.</p>
                <button class="btn btn-sm btn-outline-secondary" onclick="window.newsManager.loadAllNews()">
                    <i class="bi bi-arrow-clockwise"></i> Retry
                </button>
            </div>
        `;
    }

    showLoading(source) {
        const container = document.getElementById(`${source}News`);
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading news...</span>
                    </div>
                    <p class="mt-3 text-muted">Loading ${this.newsSources[source]?.name || source} news...</p>
                </div>
            `;
        }
    }

    showError(message) {
        // Show error in all news containers
        ['freshplaza', 'kn', 'all'].forEach(source => {
            const container = document.getElementById(`${source}News`);
            if (container) {
                container.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle"></i> ${message}
                        </div>
                    </div>
                `;
            }
        });
    }

    getFallbackKNNews() {
        // Fallback news for Kuehne+Nagel if RSS fails
        return [
            {
                id: 'kn_fallback_1',
                title: 'Kuehne+Nagel Expands Perishable Logistics Network',
                link: 'https://mykn.kuehne-nagel.com/news/',
                description: 'Global logistics provider enhances cold chain capabilities for perishable goods.',
                excerpt: 'Kuehne+Nagel announces expansion of temperature-controlled logistics network...',
                image: this.getDefaultImage('knewnagel'),
                source: 'knewnagel',
                sourceName: 'Kuehne+Nagel News',
                pubDate: new Date().toISOString(),
                formattedDate: 'Recent',
                color: 'primary',
                icon: 'bi-truck'
            },
            {
                id: 'kn_fallback_2',
                title: 'Digital Solutions for Cold Chain Management',
                link: 'https://mykn.kuehne-nagel.com/news/',
                description: 'New digital platform launched for real-time temperature monitoring.',
                excerpt: 'Innovative tracking solutions for perishable cargo transportation...',
                image: this.getDefaultImage('knewnagel'),
                source: 'knewnagel',
                sourceName: 'Kuehne+Nagel News',
                pubDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                formattedDate: '1 day ago',
                color: 'primary',
                icon: 'bi-truck'
            }
        ];
    }

    updateLastUpdateTime() {
        if (this.lastUpdate) {
            const timeString = this.lastUpdate.toLocaleTimeString('en-ZA', {
                hour: '2-digit',
                minute: '2-digit'
            });
            // You could display this somewhere if needed
        }
    }

    // Public refresh method
    refreshNews() {
        this.loadAllNews();
    }
}

// Create global instance
window.newsManager = new NewsManager();

// Global refresh function
window.refreshNews = function() {
    window.newsManager.refreshNews();
};
