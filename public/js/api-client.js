/**
 * API Client for SparkDeck
 * Handles all API communication and data fetching
 */

class ApiClient {
    constructor() {
        this.baseUrl = '/api';
        this.cache = new Map();
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
    }
    
    async getIdeas(params = {}) {
        const cacheKey = `ideas_${JSON.stringify(params)}`;
        
        // Check cache
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }
        
        try {
            // Build query string
            const queryString = new URLSearchParams(params).toString();
            const url = `${this.baseUrl}/ideas${queryString ? `?${queryString}` : ''}`;
            
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'max-age=300'
                }
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cache the response
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            return data;
            
        } catch (error) {
            console.error('Failed to fetch ideas:', error);
            
            // Return fallback data if available
            return this.getFallbackIdeas();
        }
    }
    
    async submitIdea(ideaData) {
        try {
            const response = await fetch(`${this.baseUrl}/ideas/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ideaData)
            });
            
            if (!response.ok) {
                throw new Error(`Submission failed: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Failed to submit idea:', error);
            throw error;
        }
    }
    
    async getIdeaStats() {
        const cacheKey = 'stats';
        
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/stats`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Stats API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            return data;
            
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            
            // Return fallback stats
            return {
                totalIdeas: 25,
                totalCategories: 8,
                avgRating: 4.3,
                lastUpdated: new Date().toISOString()
            };
        }
    }
    
    async subscribeNewsletter(email) {
        try {
            const response = await fetch(`${this.baseUrl}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            if (!response.ok) {
                throw new Error(`Subscription failed: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Failed to subscribe:', error);
            throw error;
        }
    }
    
    getFallbackIdeas() {
        // Return minimal fallback data
        return [
            {
                id: 1,
                title: "Sample Startup Idea",
                category: "tech",
                description: "This is a sample idea loaded from fallback data.",
                rating: 4.0,
                complexity: 2
            }
        ];
    }
    
    isCacheValid(key) {
        if (!this.cache.has(key)) return false;
        
        const cached = this.cache.get(key);
        const age = Date.now() - cached.timestamp;
        
        return age < this.cacheDuration;
    }
    
    clearCache() {
        this.cache.clear();
    }
    
    // Real-time updates via WebSocket (optional)
    connectWebSocket() {
        if (this.socket) return;
        
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
            console.log('WebSocket connected');
            this.socket.send(JSON.stringify({ type: 'subscribe', channel: 'ideas' }));
        };
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
        };
        
        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
            this.socket = null;
            
            // Attempt to reconnect
            setTimeout(() => this.connectWebSocket(), 5000);
        };
    }
    
    handleWebSocketMessage(data) {
        switch(data.type) {
            case 'idea_added':
                // TODO: Handle new idea
                break;
            case 'idea_updated':
                // TODO: Handle updated idea
                break;
            case 'stats_updated':
                // TODO: Handle updated stats
                break;
        }
    }
}

// Export for use in main app
if (typeof module !== 'undefined') {
    module.exports = ApiClient;
}