// Content script for tracking user activity on web pages
class ActivityTracker {
    constructor() {
        this.isActive = true;
        this.startTime = Date.now();
        this.lastActivity = Date.now();
        this.idleThreshold = 30000; // 30 seconds
        this.scrollThreshold = 100; // pixels
        this.keyboardThreshold = 3; // keystrokes
        
        this.scrollCount = 0;
        this.keyboardCount = 0;
        this.clickCount = 0;
        this.focusTime = 0;
        this.idleTime = 0;
        
        this.setupEventListeners();
        this.startActivityMonitoring();
    }

    setupEventListeners() {
        // Track user interactions
        document.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        document.addEventListener('keydown', this.handleKeyboard.bind(this), { passive: true });
        document.addEventListener('click', this.handleClick.bind(this), { passive: true });
        document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
        
        // Track focus changes
        window.addEventListener('focus', this.handleFocus.bind(this));
        window.addEventListener('blur', this.handleBlur.bind(this));
        
        // Track page visibility
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Track before page unload
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    startActivityMonitoring() {
        // Check for activity every 5 seconds
        setInterval(() => {
            this.checkActivity();
        }, 5000);
    }

    handleScroll() {
        if (!this.isActive) return;
        
        this.scrollCount++;
        this.updateActivity();
        
        // Send scroll data to background script
        this.sendActivityData('scroll', {
            scrollCount: this.scrollCount,
            scrollY: window.scrollY,
            documentHeight: document.documentElement.scrollHeight
        });
    }

    handleKeyboard(event) {
        if (!this.isActive) return;
        
        // Ignore certain keys that don't indicate meaningful activity
        const ignoredKeys = ['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (ignoredKeys.includes(event.key)) return;
        
        this.keyboardCount++;
        this.updateActivity();
        
        // Send keyboard data to background script
        this.sendActivityData('keyboard', {
            keyCount: this.keyboardCount,
            key: event.key,
            timestamp: Date.now()
        });
    }

    handleClick(event) {
        if (!this.isActive) return;
        
        this.clickCount++;
        this.updateActivity();
        
        // Send click data to background script
        this.sendActivityData('click', {
            clickCount: this.clickCount,
            target: event.target.tagName,
            x: event.clientX,
            y: event.clientY,
            timestamp: Date.now()
        });
    }

    handleMouseMove() {
        if (!this.isActive) return;
        this.updateActivity();
    }

    handleFocus() {
        this.isActive = true;
        this.startTime = Date.now();
        this.lastActivity = Date.now();
        
        this.sendActivityData('focus', {
            timestamp: Date.now(),
            url: window.location.href
        });
    }

    handleBlur() {
        this.isActive = false;
        this.calculateFocusTime();
        
        this.sendActivityData('blur', {
            timestamp: Date.now(),
            focusTime: this.focusTime,
            url: window.location.href
        });
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.isActive = false;
            this.calculateFocusTime();
        } else {
            this.isActive = true;
            this.startTime = Date.now();
            this.lastActivity = Date.now();
        }
        
        this.sendActivityData('visibility', {
            hidden: document.hidden,
            timestamp: Date.now(),
            url: window.location.href
        });
    }

    handleBeforeUnload() {
        this.calculateFocusTime();
        
        // Send final activity summary
        this.sendActivityData('unload', {
            totalFocusTime: this.focusTime,
            scrollCount: this.scrollCount,
            keyboardCount: this.keyboardCount,
            clickCount: this.clickCount,
            idleTime: this.idleTime,
            url: window.location.href,
            timestamp: Date.now()
        });
    }

    updateActivity() {
        this.lastActivity = Date.now();
        this.idleTime = 0;
    }

    checkActivity() {
        const now = Date.now();
        const timeSinceLastActivity = now - this.lastActivity;
        
        if (timeSinceLastActivity > this.idleThreshold) {
            this.idleTime += timeSinceLastActivity;
            this.isActive = false;
        } else {
            this.isActive = true;
        }
        
        // Calculate focus time
        this.calculateFocusTime();
    }

    calculateFocusTime() {
        if (this.isActive && this.startTime) {
            this.focusTime += Date.now() - this.startTime;
            this.startTime = Date.now();
        }
    }

    sendActivityData(type, data) {
        try {
            chrome.runtime.sendMessage({
                type: 'activityData',
                activityType: type,
                data: {
                    ...data,
                    url: window.location.href,
                    domain: window.location.hostname,
                    title: document.title,
                    timestamp: Date.now()
                }
            });
        } catch (error) {
            console.log('Error sending activity data:', error);
        }
    }

    // Analyze page content for productivity indicators
    analyzePageContent() {
        const content = {
            hasForms: document.querySelectorAll('form').length > 0,
            hasInputs: document.querySelectorAll('input, textarea').length > 0,
            hasCode: document.querySelectorAll('code, pre').length > 0,
            hasTutorials: this.hasTutorialContent(),
            hasDocumentation: this.hasDocumentationContent(),
            wordCount: this.getWordCount(),
            readingTime: this.estimateReadingTime(),
            hasVideos: document.querySelectorAll('video').length > 0,
            hasImages: document.querySelectorAll('img').length > 0,
            hasAds: this.detectAds()
        };

        this.sendActivityData('contentAnalysis', content);
        return content;
    }

    hasTutorialContent() {
        const tutorialKeywords = ['tutorial', 'guide', 'how to', 'learn', 'course', 'lesson'];
        const text = document.body.textContent.toLowerCase();
        return tutorialKeywords.some(keyword => text.includes(keyword));
    }

    hasDocumentationContent() {
        const docKeywords = ['api', 'documentation', 'docs', 'reference', 'manual'];
        const text = document.body.textContent.toLowerCase();
        return docKeywords.some(keyword => text.includes(keyword));
    }

    getWordCount() {
        const text = document.body.textContent;
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    estimateReadingTime() {
        const wordCount = this.getWordCount();
        const wordsPerMinute = 200; // Average reading speed
        return Math.ceil(wordCount / wordsPerMinute);
    }

    detectAds() {
        const adSelectors = [
            '[class*="ad"]',
            '[id*="ad"]',
            '[class*="banner"]',
            '[id*="banner"]',
            '[class*="sponsor"]',
            '[id*="sponsor"]'
        ];
        
        return adSelectors.some(selector => 
            document.querySelectorAll(selector).length > 0
        );
    }

    // Track time spent on specific elements
    trackElementFocus() {
        const focusableElements = document.querySelectorAll('input, textarea, [contenteditable]');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                this.sendActivityData('elementFocus', {
                    element: element.tagName,
                    type: element.type || 'text',
                    timestamp: Date.now()
                });
            });
        });
    }

    // Monitor page performance
    trackPerformance() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            this.sendActivityData('performance', {
                loadTime: loadTime,
                domReady: domReady,
                timestamp: Date.now()
            });
        }
    }
}

// Initialize activity tracker when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const tracker = new ActivityTracker();
        
        // Analyze page content after a short delay
        setTimeout(() => {
            tracker.analyzePageContent();
            tracker.trackElementFocus();
            tracker.trackPerformance();
        }, 2000);
    });
} else {
    const tracker = new ActivityTracker();
    
    // Analyze page content after a short delay
    setTimeout(() => {
        tracker.analyzePageContent();
        tracker.trackElementFocus();
        tracker.trackPerformance();
    }, 2000);
}
