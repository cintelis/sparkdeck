/**
 * SparkDeck - Main Application File
 * Handles core functionality, data management, and UI interactions
 */

class SparkDeckApp {
    constructor() {
        this.ideas = [];
        this.filteredIdeas = [];
        this.currentIndex = 0;
        this.currentCategory = 'all';
        this.currentView = 'carousel';
        this.currentSort = 'newest';
        
        this.initialize();
    }
    
    async initialize() {
        // Load configuration
        this.config = {
            apiUrl: '/api/ideas',
            itemsPerPage: 10,
            autoRotateInterval: 8000,
            enableAnalytics: true
        };
        
        // Initialize components
        this.initializeEventListeners();
        this.loadIdeas();
        this.updateStats();
        
        // Start auto-rotation for carousel
        this.startAutoRotate();
        
        console.log('🚀 SparkDeck initialized');
    }
    
    async loadIdeas() {
        try {
            // Show loading state
            this.showLoading(true);
            
            // In production, this would fetch from API
            // const response = await fetch(this.config.apiUrl);
            // this.ideas = await response.json();
            
            // For demo, use sample data
            this.ideas = await this.getSampleIdeas();
            this.filteredIdeas = [...this.ideas];
            
            // Render the ideas
            this.renderCarousel();
            this.renderGrid();
            this.renderIndicators();
            
            // Update stats
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading ideas:', error);
            this.showError('Failed to load ideas. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }
    
    async getSampleIdeas() {
        // Return sample data structure
        return [
            {
                id: 1,
                title: "Waitlist Manager Pro",
                subtitle: "Smart waitlist management for events, launches, and restaurants",
                category: "saas",
                complexity: 2,
                rating: 4.5,
                description: "A comprehensive waitlist management system that helps businesses manage sign-ups, send automated updates, and reduce no-shows.",
                features: [
                    "Automated email/SMS notifications",
                    "Real-time analytics dashboard",
                    "Calendar integration",
                    "Customizable booking forms"
                ],
                problem: "Businesses struggle with manual waitlist management and poor customer communication.",
                solution: "Automated system that manages waitlists and keeps customers informed.",
                tags: ["SaaS", "Events", "Restaurants", "Automation"],
                demoUrl: "/demo/waitlist-manager.html",
                color: "#6366f1",
                icon: "fas fa-list-ol",
                createdAt: "2024-01-15",
                updatedAt: "2024-01-20"
            },
            {
                id: 2,
                title: "Social Proof Notifications",
                subtitle: "Boost conversions with real-time purchase notifications",
                category: "saas",
                complexity: 1,
                rating: 4.2,
                description: "A widget for e-commerce sites that displays recent purchases and sign-ups to build trust and urgency.",
                features: [
                    "Customizable notification styles",
                    "Real-time updates",
                    "Analytics dashboard",
                    "Easy integration"
                ],
                problem: "E-commerce sites lack social proof to build customer trust.",
                solution: "Real-time notifications showing recent customer activity.",
                tags: ["SaaS", "E-commerce", "Social Proof", "Conversion"],
                demoUrl: "/demo/social-proof.html",
                color: "#10b981",
                icon: "fas fa-bell",
                createdAt: "2024-01-10",
                updatedAt: "2024-01-18"
            },
            {
                id: 3,
                title: "Home Inventory Manager",
                subtitle: "Insurance-ready home inventory management",
                category: "tech",
                complexity: 3,
                rating: 4.8,
                description: "Mobile-first app for cataloging household items with photos and receipts for insurance purposes.",
                features: [
                    "Room-by-room organization",
                    "Photo and receipt upload",
                    "PDF report generation",
                    "Cloud backup"
                ],
                problem: "Homeowners struggle to document possessions for insurance claims.",
                solution: "Easy-to-use app for organizing and documenting household items.",
                tags: ["Mobile", "Insurance", "Home", "Organization"],
                demoUrl: "/demo/home-inventory.html",
                color: "#f59e0b",
                icon: "fas fa-home",
                createdAt: "2024-01-05",
                updatedAt: "2024-01-12"
            },
            {
                id: 4,
                title: "AI Resume Builder",
                subtitle: "AI-powered resume optimization for job seekers",
                category: "ai",
                complexity: 3,
                rating: 4.6,
                description: "Intelligent resume builder that uses AI to optimize content for specific job descriptions.",
                features: [
                    "AI content suggestions",
                    "ATS optimization",
                    "Real-time feedback",
                    "Multiple template options"
                ],
                problem: "Job seekers struggle to tailor resumes for different positions.",
                solution: "AI-powered tool that optimizes resumes based on job descriptions.",
                tags: ["AI", "Career", "Productivity", "Recruitment"],
                demoUrl: "/demo/ai-resume.html",
                color: "#8b5cf6",
                icon: "fas fa-robot",
                createdAt: "2024-01-08",
                updatedAt: "2024-01-15"
            },
            {
                id: 5,
                title: "Voice-to-Code Assistant",
                subtitle: "Convert spoken ideas into working code",
                category: "ai",
                complexity: 4,
                rating: 4.9,
                description: "AI assistant that converts verbal descriptions of features into clean, production-ready code.",
                features: [
                    "Multiple language support",
                    "Code quality analysis",
                    "Integration with IDEs",
                    "Learning algorithms"
                ],
                problem: "Non-technical founders can't quickly prototype their ideas.",
                solution: "Voice interface that generates code from spoken requirements.",
                tags: ["AI", "Development", "Productivity", "Prototyping"],
                demoUrl: "/demo/voice-to-code.html",
                color: "#ef4444",
                icon: "fas fa-microphone",
                createdAt: "2024-01-12",
                updatedAt: "2024-01-20"
            }
        ];
    }
    
    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterByCategory(e.target.dataset.filter);
            });
        });
        
        // Carousel controls
        document.getElementById('prevBtn').addEventListener('click', () => this.prevIdea());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextIdea());
        
        // View toggles
        document.getElementById('gridViewBtn').addEventListener('click', () => this.switchView('grid'));
        document.getElementById('carouselViewBtn').addEventListener('click', () => this.switchView('carousel'));
        
        // Sort functionality
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortIdeas(e.target.value);
        });
        
        // Modal controls
        document.getElementById('modalCloseBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('modalPrevBtn').addEventListener('click', () => this.prevIdeaModal());
        document.getElementById('modalNextBtn').addEventListener('click', () => this.nextIdeaModal());
        
        // Submit idea modal
        document.getElementById('submitIdeaBtn').addEventListener('click', () => this.openSubmitModal());
        document.getElementById('submitModalCloseBtn').addEventListener('click', () => this.closeSubmitModal());
        document.getElementById('cancelSubmitBtn').addEventListener('click', () => this.closeSubmitModal());
        document.getElementById('ideaForm').addEventListener('submit', (e) => this.submitIdea(e));
        
        // Newsletter form
        document.getElementById('newsletterForm').addEventListener('submit', (e) => this.subscribeNewsletter(e));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    filterByCategory(category) {
        this.currentCategory = category;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.filter === category);
        });
        
        // Filter ideas
        if (category === 'all') {
            this.filteredIdeas = [...this.ideas];
        } else {
            this.filteredIdeas = this.ideas.filter(idea => idea.category === category);
        }
        
        // Reset to first idea
        this.currentIndex = 0;
        
        // Update views
        this.renderCarousel();
        this.renderGrid();
        this.renderIndicators();
        this.updateStats();
    }
    
    sortIdeas(sortType) {
        this.currentSort = sortType;
        
        switch (sortType) {
            case 'newest':
                this.filteredIdeas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                this.filteredIdeas.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'rating':
                this.filteredIdeas.sort((a, b) => b.rating - a.rating);
                break;
            case 'complexity':
                this.filteredIdeas.sort((a, b) => a.complexity - b.complexity);
                break;
        }
        
        this.renderCarousel();
        this.renderGrid();
        this.renderIndicators();
    }
    
    switchView(view) {
        this.currentView = view;
        
        // Update button states
        document.getElementById('gridViewBtn').classList.toggle('active', view === 'grid');
        document.getElementById('carouselViewBtn').classList.toggle('active', view === 'carousel');
        
        // Show/hide views
        document.getElementById('carouselTrack').parentElement.style.display = 
            view === 'carousel' ? 'block' : 'none';
        document.getElementById('gridView').style.display = 
            view === 'grid' ? 'block' : 'none';
        
        // Update indicators visibility
        document.getElementById('carouselIndicators').style.display = 
            view === 'carousel' ? 'flex' : 'none';
        document.querySelector('.carousel-controls').style.display = 
            view === 'carousel' ? 'flex' : 'none';
    }
    
    renderCarousel() {
        const track = document.getElementById('carouselTrack');
        track.innerHTML = '';
        
        this.filteredIdeas.forEach((idea, index) => {
            const card = this.createIdeaCard(idea, index);
            track.appendChild(card);
        });
        
        // Update track position
        this.updateCarouselPosition();
    }
    
    renderGrid() {
        const grid = document.getElementById('ideaGrid');
        grid.innerHTML = '';
        
        this.filteredIdeas.forEach((idea, index) => {
            const card = this.createIdeaCard(idea, index);
            card.classList.add('grid-item');
            grid.appendChild(card);
        });
    }
    
    renderIndicators() {
        const container = document.getElementById('carouselIndicators');
        container.innerHTML = '';
        
        this.filteredIdeas.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === this.currentIndex ? 'active' : ''}`;
            indicator.dataset.index = index;
            indicator.addEventListener('click', () => this.goToIdea(index));
            container.appendChild(indicator);
        });
    }
    
    createIdeaCard(idea, index) {
        const card = document.createElement('div');
        card.className = 'idea-card';
        card.dataset.index = index;
        
        // Format features list
        const featuresList = idea.features?.map(feature => 
            `<li><i class="fas fa-check"></i> ${feature}</li>`
        ).join('') || '';
        
        // Get complexity text
        const complexityText = this.getComplexityText(idea.complexity);
        
        card.innerHTML = `
            <div class="card-header" style="background: ${idea.color}">
                <div class="card-category">${idea.category.toUpperCase()}</div>
                <h3 class="card-title">${idea.title}</h3>
                <p class="card-subtitle">${idea.subtitle}</p>
            </div>
            <div class="card-body">
                <p class="card-description">${idea.description}</p>
                <ul class="card-features">${featuresList}</ul>
            </div>
            <div class="card-footer">
                <div class="card-meta">
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>${idea.rating}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-code-branch"></i>
                        <span>${complexityText}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${new Date(idea.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <button class="visit-btn" data-idea-id="${idea.id}">
                    <i class="fas fa-external-link-alt"></i> Visit Demo
                </button>
            </div>
        `;
        
        // Add click event to view idea details
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.visit-btn')) {
                this.viewIdeaDetails(index);
            }
        });
        
        // Add click event to visit button
        const visitBtn = card.querySelector('.visit-btn');
        visitBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.visitIdeaDemo(idea);
        });
        
        return card;
    }
    
    getComplexityText(level) {
        switch(level) {
            case 1: return 'Beginner';
            case 2: return 'Intermediate';
            case 3: return 'Advanced';
            case 4: return 'Expert';
            default: return 'Unknown';
        }
    }
    
    prevIdea() {
        this.currentIndex = (this.currentIndex - 1 + this.filteredIdeas.length) % this.filteredIdeas.length;
        this.updateCarouselPosition();
        this.updateIndicators();
    }
    
    nextIdea() {
        this.currentIndex = (this.currentIndex + 1) % this.filteredIdeas.length;
        this.updateCarouselPosition();
        this.updateIndicators();
    }
    
    goToIdea(index) {
        this.currentIndex = index;
        this.updateCarouselPosition();
        this.updateIndicators();
    }
    
    updateCarouselPosition() {
        const track = document.getElementById('carouselTrack');
        const cardWidth = 350; // Width of idea card + gap
        const offset = -this.currentIndex * cardWidth;
        track.style.transform = `translateX(${offset}px)`;
        
        // Update progress bar
        const progress = ((this.currentIndex + 1) / this.filteredIdeas.length) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
    }
    
    updateIndicators() {
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    viewIdeaDetails(index) {
        const idea = this.filteredIdeas[index];
        this.currentIndex = index;
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = this.createIdeaDetailHTML(idea);
        
        // Update modal navigation buttons
        document.getElementById('modalPrevBtn').style.display = 
            this.filteredIdeas.length > 1 ? 'flex' : 'none';
        document.getElementById('modalNextBtn').style.display = 
            this.filteredIdeas.length > 1 ? 'flex' : 'none';
        
        // Update visit button
        const visitBtn = document.getElementById('visitPageBtn');
        visitBtn.href = idea.demoUrl;
        visitBtn.innerHTML = `<i class="fas fa-external-link-alt"></i> Visit Demo Page`;
        
        // Show modal
        document.getElementById('ideaModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    createIdeaDetailHTML(idea) {
        const featuresList = idea.features?.map(feature => 
            `<li><i class="fas fa-check"></i> ${feature}</li>`
        ).join('') || '';
        
        const tags = idea.tags?.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('') || '';
        
        return `
            <div class="idea-detail">
                <div class="detail-header" style="background: ${idea.color}">
                    <div class="detail-category">${idea.category.toUpperCase()}</div>
                    <h2>${idea.title}</h2>
                    <p class="detail-subtitle">${idea.subtitle}</p>
                    <div class="detail-meta">
                        <span class="meta-item"><i class="fas fa-star"></i> ${idea.rating}/5</span>
                        <span class="meta-item"><i class="fas fa-code-branch"></i> ${this.getComplexityText(idea.complexity)}</span>
                        <span class="meta-item"><i class="fas fa-calendar"></i> ${new Date(idea.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="detail-content">
                    <div class="detail-section">
                        <h3><i class="fas fa-info-circle"></i> Description</h3>
                        <p>${idea.description}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-exclamation-circle"></i> Problem Statement</h3>
                        <p>${idea.problem || 'Not specified'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-lightbulb"></i> Solution</h3>
                        <p>${idea.solution || 'Not specified'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-list-check"></i> Key Features</h3>
                        <ul class="feature-list">${featuresList}</ul>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-tags"></i> Tags</h3>
                        <div class="tags-container">${tags}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    prevIdeaModal() {
        this.currentIndex = (this.currentIndex - 1 + this.filteredIdeas.length) % this.filteredIdeas.length;
        this.viewIdeaDetails(this.currentIndex);
    }
    
    nextIdeaModal() {
        this.currentIndex = (this.currentIndex + 1) % this.filteredIdeas.length;
        this.viewIdeaDetails(this.currentIndex);
    }
    
    closeModal() {
        document.getElementById('ideaModal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    visitIdeaDemo(idea) {
        // Track analytics event
        this.trackEvent('idea_visit', {
            idea_id: idea.id,
            idea_title: idea.title
        });
        
        // Open demo in new tab
        window.open(idea.demoUrl, '_blank');
    }
    
    openSubmitModal() {
        document.getElementById('submitModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeSubmitModal() {
        document.getElementById('submitModal').classList.remove('active');
        document.body.style.overflow = 'auto';
        document.getElementById('ideaForm').reset();
    }
    
    async submitIdea(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('ideaTitle').value,
            category: document.getElementById('ideaCategory').value,
            complexity: parseInt(document.getElementById('ideaComplexity').value),
            description: document.getElementById('ideaDescription').value,
            problem: document.getElementById('ideaProblem').value,
            solution: document.getElementById('ideaSolution').value,
            url: document.getElementById('ideaUrl').value,
            tags: document.getElementById('ideaTags').value.split(',').map(tag => tag.trim()),
            createdAt: new Date().toISOString(),
            rating: 0,
            status: 'pending'
        };
        
        // Here you would send to your backend API
        // await fetch('/api/ideas/submit', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
        
        // For demo, just show success message
        this.showToast('Idea submitted successfully! It will be reviewed soon.', 'success');
        this.closeSubmitModal();
        
        // Track submission
        this.trackEvent('idea_submitted', {
            category: formData.category,
            complexity: formData.complexity
        });
    }
    
    async subscribeNewsletter(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Here you would send to your newsletter service
        // await fetch('/api/newsletter/subscribe', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // });
        
        // For demo, just show success message
        this.showToast('Successfully subscribed to newsletter!', 'success');
        e.target.reset();
        
        this.trackEvent('newsletter_subscribed');
    }
    
    updateStats() {
        document.getElementById('totalIdeas').textContent = this.filteredIdeas.length;
        
        // Calculate unique categories
        const categories = new Set(this.filteredIdeas.map(idea => idea.category));
        document.getElementById('activeCategories').textContent = categories.size;
        
        // Calculate average rating
        const avgRating = this.filteredIdeas.length > 0 
            ? (this.filteredIdeas.reduce((sum, idea) => sum + idea.rating, 0) / this.filteredIdeas.length).toFixed(1)
            : '0.0';
        document.getElementById('avgRating').textContent = avgRating;
    }
    
    startAutoRotate() {
        setInterval(() => {
            if (this.currentView === 'carousel' && !this.isModalOpen()) {
                this.nextIdea();
            }
        }, this.config.autoRotateInterval);
    }
    
    isModalOpen() {
        return document.getElementById('ideaModal').classList.contains('active') ||
               document.getElementById('submitModal').classList.contains('active');
    }
    
    handleKeyboardNavigation(e) {
        if (this.isModalOpen()) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevIdea();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextIdea();
                break;
            case ' ':
                e.preventDefault();
                if (this.filteredIdeas[this.currentIndex]) {
                    this.viewIdeaDetails(this.currentIndex);
                }
                break;
            case 'Escape':
                this.closeModal();
                break;
        }
    }
    
    handleResize() {
        // Update carousel position on resize
        this.updateCarouselPosition();
    }
    
    showLoading(show) {
        // TODO: Implement loading state
    }
    
    showError(message) {
        // TODO: Implement error display
        console.error('Error:', message);
    }
    
    showToast(message, type = 'info') {
        // TODO: Implement toast notifications
        console.log(`${type.toUpperCase()}: ${message}`);
    }
    
    trackEvent(eventName, properties = {}) {
        if (this.config.enableAnalytics) {
            // TODO: Implement analytics tracking
            console.log('Event tracked:', eventName, properties);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sparkDeck = new SparkDeckApp();
});