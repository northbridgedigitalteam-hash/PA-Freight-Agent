// ============================================
// PAXI - RSS NEWS FEED MANAGER
// ============================================

class NewsFeed {
    constructor() {
        this.feeds = {
            freshplaza: {
                name: 'FreshPlaza Africa',
                color: 'success',
                icon: 'bi-globe',
                articles: this.getFreshPlazaArticles()
            },
            knewnagel: {
                name: 'Kuehne+Nagel',
                color: 'primary',
                icon: 'bi-truck',
                articles: this.getKNAArticles()
            }
        };
    }

    // Get FreshPlaza Africa articles (simulated - actual RSS would require CORS proxy)
    getFreshPlazaArticles() {
        return [
            {
                id: 'fp1',
                title: 'South African citrus exports reach record volumes',
                excerpt: 'SA citrus industry reports 2.8 million tonnes exported in 2023 season.',
                content: 'The South African citrus industry has achieved record export volumes despite logistical challenges. EU remains the largest market, with significant growth in China and USA.',
                image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                link: 'https://www.freshplaza.com/africa/article/9573823/south-african-citrus-exports-hit-record-high/',
                date: '2 days ago',
                source: 'FreshPlaza'
            },
            {
                id: 'fp2',
                title: 'Avocado exports to China increase 40%',
                excerpt: 'Improved market access drives avocado export growth to Asian markets.',
                content: 'South African avocado exports to China have surged by 40% in Q1 2024, driven by improved phytosanitary protocols and market access agreements.',
                image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                link: 'https://www.freshplaza.com/africa/article/9571234/avocado-exports-to-china-surge-40/',
                date: '5 days ago',
                source: 'FreshPlaza'
            },
            {
                id: 'fp3',
                title: 'Table grape season starts with strong European demand',
                excerpt: 'Early grape varieties showing strong quality and market interest.',
                content: 'The South African table grape season has commenced with excellent quality fruit and strong demand from European retailers.',
                image: 'https://images.unsplash.com/photo-1515771987305-9b4d5a4b6c6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                link: 'https://www.freshplaza.com/africa/article/9567891/table-grape-season-starts-with-strong-demand/',
                date: '1 week ago',
                source: 'FreshPlaza'
            }
        ];
    }

    // Get Kuehne+Nagel articles
    getKNAArticles() {
        return [
            {
                id: 'kn1',
                title: 'Kuehne+Nagel expands perishable logistics network in Africa',
                excerpt: 'Enhanced cold chain capabilities for temperature-sensitive cargo.',
                content: 'Kuehne+Nagel has announced expansion of its temperature-controlled logistics network across key African export regions.',
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                link: 'https://news.kuehne-nagel.com/africa-expansion/',
                date: '3 days ago',
                source: 'Kuehne+Nagel'
            },
            {
                id: 'kn2',
                title: 'Digital platform for real-time cold chain monitoring',
                excerpt: 'New technology solution for perishable cargo tracking.',
                content: 'Kuehne+Nagel launches digital platform providing real-time temperature and location tracking for perishable shipments.',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                link: 'https://news.kuehne-nagel.com/digital-cold-chain/',
                date: '1 week ago',
                source: 'Kuehne+Nagel'
            }
        ];
    }

    // Load all news feeds
    loadAll() {
        this.displayNews('freshplaza', this.feeds.freshplaza.articles);
        this.displayNews('knn', this.feeds.knewnagel.articles);
    }

    // Display news for a specific feed
    displayNews(feedId, articles) {
        const container = document.getElementById(`${feedId}News`);
        if (!container) return;

        if (!articles || articles.length === 0) {
            container.innerHTML = this.getNoNewsHTML(feedId);
            return;
        }

        let html = '';
        articles.forEach((article, index) => {
            html += this.createNewsCard(article, index, feedId);
        });

        container.innerHTML = html;
        this.attachNewsHandlers(feedId);
    }

    // Create news card HTML
    createNewsCard(article, index, feedId) {
        const feed = this.feeds[feedId];
        return `
            <div class="col-md-6 col-lg-4">
                <div class="news-card card h-100 animate-in" 
                     style="animation-delay: ${index * 0.1}s"
                     data-article-id="${article.id}">
                    
                    ${article.image ? `
                    <img src="${article.image}" class="news-image" alt="${article.title}"
                         onerror="this.src='https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
                    ` : ''}
                    
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-${feed.color}">${feed.name}</span>
                            <small class="text-muted">${article.date}</small>
                        </div>
                        
                        <h6 class="news-title mb-2">${article.title}</h6>
                        
                        <p class="news-excerpt mb-3 flex-grow-1">${article.excerpt}</p>
                        
                        <div class="mt-auto">
                            <button class="btn btn-sm btn-outline-${feed.color} w-100 read-more-btn">
                                <i class="bi ${feed.icon}"></i> Read More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Attach click handlers to news cards
    attachNewsHandlers(feedId) {
        const cards = document.querySelectorAll(`#${feedId}News .news-card`);
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('read-more-btn')) {
                    const articleId = card.getAttribute('data-article-id');
                    this.showArticle(articleId, feedId);
                }
            });
            
            const readMoreBtn = card.querySelector('.read-more-btn');
            if (readMoreBtn) {
                readMoreBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const articleId = card.getAttribute('data-article-id');
                    this.showArticle(articleId, feedId);
                });
            }
        });
    }

    // Show article in modal
    showArticle(articleId, feedId) {
        const feed = this.feeds[feedId];
        const article = feed.articles.find(a => a.id === articleId);
        if (!article) return;

        // Set modal title
        document.getElementById('newsModalTitle').textContent = article.title;
        
        // Build modal content
        let content = '';
        if (article.image) {
            content += `
                <div class="text-center mb-4">
                    <img src="${article.image}" class="img-fluid rounded" alt="${article.title}"
                         style="max-height: 300px; object-fit: cover;">
                </div>
            `;
        }
        
        content += `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-${feed.color}">${feed.name}</span>
                <small class="text-muted"><i class="bi bi-calendar"></i> ${article.date}</small>
            </div>
            
            <div class="news-content mb-4">
                <p>${article.content}</p>
            </div>
        `;
        
        // Set modal content
        document.getElementById('newsModalBody').innerHTML = content;
        
        // Set full article link
        const readFullBtn = document.getElementById('readFullArticle');
        readFullBtn.href = article.link;
        readFullBtn.classList.remove('btn-success', 'btn-primary', 'btn-info');
        readFullBtn.classList.add(`btn-${feed.color}`);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('newsModal'));
        modal.show();
    }

    // No news HTML
    getNoNewsHTML(feedId) {
        const feed = this.feeds[feedId];
        return `
            <div class="col-12 text-center py-5">
                <i class="bi bi-newspaper display-4 text-muted opacity-50"></i>
                <p class="mt-3 text-muted">No ${feed.name} articles available.</p>
                <p class="small text-muted">Check back later for updates.</p>
            </div>
        `;
    }

    // Refresh news
    refresh() {
        this.loadAll();
    }
}

// Initialize news feed
window.newsFeed = new NewsFeed();
window.refreshNews = function() {
    window.newsFeed.refresh();
};
