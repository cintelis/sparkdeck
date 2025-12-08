/**
 * Carousel Component
 * Handles carousel-specific functionality and animations
 */

class Carousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.track = this.container.querySelector('.carousel-track');
        this.items = Array.from(this.track.children);
        this.currentIndex = 0;
        this.isAnimating = false;
        this.animationDuration = 500;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updatePosition();
    }
    
    setupEventListeners() {
        // Touch events for mobile swipe
        this.track.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.track.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.track.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Mouse events for desktop drag
        this.track.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.track.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.track.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.track.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        // Prevent image drag
        this.track.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', e => e.preventDefault());
        });
    }
    
    next() {
        if (this.isAnimating) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.slideTo(this.currentIndex);
    }
    
    prev() {
        if (this.isAnimating) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.slideTo(this.currentIndex);
    }
    
    goTo(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.currentIndex = index;
        this.slideTo(this.currentIndex);
    }
    
    slideTo(index) {
        this.isAnimating = true;
        
        // Calculate position
        const itemWidth = this.items[0].getBoundingClientRect().width;
        const position = -index * itemWidth;
        
        // Animate
        this.track.style.transition = `transform ${this.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        this.track.style.transform = `translateX(${position}px)`;
        
        // Update active state
        this.updateActiveItem();
        
        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, this.animationDuration);
    }
    
    updatePosition() {
        const itemWidth = this.items[0].getBoundingClientRect().width;
        const position = -this.currentIndex * itemWidth;
        this.track.style.transform = `translateX(${position}px)`;
    }
    
    updateActiveItem() {
        this.items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
            item.setAttribute('aria-hidden', index !== this.currentIndex);
        });
    }
    
    // Touch handlers for swipe
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.isDragging = true;
        this.track.style.transition = 'none';
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const diffX = touchX - this.touchStartX;
        const diffY = touchY - this.touchStartY;
        
        // Only prevent vertical scrolling if horizontal swipe is detected
        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();
        }
        
        const itemWidth = this.items[0].getBoundingClientRect().width;
        const dragPercentage = diffX / itemWidth;
        const currentPosition = -this.currentIndex * itemWidth;
        const dragPosition = currentPosition + diffX;
        
        this.track.style.transform = `translateX(${dragPosition}px)`;
    }
    
    handleTouchEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchEndX - this.touchStartX;
        const threshold = 50; // Minimum swipe distance
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                this.prev();
            } else {
                this.next();
            }
        } else {
            this.slideTo(this.currentIndex);
        }
    }
    
    // Mouse handlers for drag
    handleMouseDown(e) {
        e.preventDefault();
        this.mouseStartX = e.clientX;
        this.isMouseDown = true;
        this.track.style.transition = 'none';
        this.track.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (!this.isMouseDown) return;
        
        const mouseX = e.clientX;
        const diffX = mouseX - this.mouseStartX;
        
        const itemWidth = this.items[0].getBoundingClientRect().width;
        const currentPosition = -this.currentIndex * itemWidth;
        const dragPosition = currentPosition + diffX;
        
        this.track.style.transform = `translateX(${dragPosition}px)`;
    }
    
    handleMouseUp(e) {
        if (!this.isMouseDown) return;
        
        this.isMouseDown = false;
        this.track.style.cursor = 'grab';
        
        const mouseEndX = e.clientX;
        const diffX = mouseEndX - this.mouseStartX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                this.prev();
            } else {
                this.next();
            }
        } else {
            this.slideTo(this.currentIndex);
        }
    }
    
    // Responsive handling
    handleResize() {
        this.updatePosition();
    }
}

// Export for use in main app
if (typeof module !== 'undefined') {
    module.exports = Carousel;
}