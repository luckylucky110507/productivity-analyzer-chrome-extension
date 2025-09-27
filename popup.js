// Popup script for displaying productivity metrics
class PopupManager {
    constructor() {
        this.data = null;
        this.settings = null;
        this.init();
    }

    async init() {
        await this.loadSettings();
        await this.loadData();
        this.setupEventListeners();
        this.updateUI();
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['settings']);
            this.settings = result.settings || this.getDefaultSettings();
        } catch (error) {
            console.error('Error loading settings:', error);
            this.settings = this.getDefaultSettings();
        }
    }

    getDefaultSettings() {
        return {
            trackingEnabled: true,
            idleThreshold: 5,
            categories: {
                'productive': ['github.com', 'stackoverflow.com', 'docs.', 'learn.', 'tutorial'],
                'social': ['facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com'],
                'entertainment': ['youtube.com', 'netflix.com', 'twitch.tv', 'reddit.com'],
                'shopping': ['amazon.com', 'ebay.com', 'shopify.com', 'etsy.com'],
                'news': ['cnn.com', 'bbc.com', 'reuters.com', 'nytimes.com']
            },
            goals: {
                dailyProductiveTime: 480,
                maxSocialTime: 60,
                maxEntertainmentTime: 120
            }
        };
    }

    async loadData() {
        try {
            // Get today's data
            const today = new Date().toISOString().split('T')[0];
            const result = await chrome.storage.local.get([today]);
            this.data = result[today] || this.getEmptyData();
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = this.getEmptyData();
        }
    }

    getEmptyData() {
        return {
            sessions: [],
            totalTime: 0,
            categoryTime: {},
            productivityScore: 0
        };
    }

    setupEventListeners() {
        document.getElementById('viewDetails').addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
        });

        document.getElementById('openSettings').addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
        });
    }

    updateUI() {
        this.updateScore();
        this.updateTimeDisplay();
        this.updateCategoryBreakdown();
        this.updateGoals();
        this.updateTrend();
    }

    updateScore() {
        const score = Math.round(this.data.productivityScore * 100);
        const scoreElement = document.getElementById('todayScore');
        const scoreNumber = scoreElement.querySelector('.score-number');
        scoreNumber.textContent = score;

        // Update score circle color based on score
        if (score >= 80) {
            scoreElement.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        } else if (score >= 60) {
            scoreElement.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
        } else {
            scoreElement.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        }
    }

    updateTimeDisplay() {
        const totalMinutes = Math.round(this.data.totalTime / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        document.getElementById('totalTime').textContent = `${hours}h ${minutes}m`;
    }

    updateCategoryBreakdown() {
        const categoryList = document.getElementById('categoryList');
        categoryList.innerHTML = '';

        if (Object.keys(this.data.categoryTime).length === 0) {
            categoryList.innerHTML = '<p style="text-align: center; color: #6c757d; font-size: 12px;">No data yet</p>';
            return;
        }

        const totalTime = Object.values(this.data.categoryTime).reduce((a, b) => a + b, 0);
        const sortedCategories = Object.entries(this.data.categoryTime)
            .sort(([,a], [,b]) => b - a);

        // Find top category
        if (sortedCategories.length > 0) {
            const [topCategory, topTime] = sortedCategories[0];
            document.getElementById('topCategory').textContent = topCategory;
            document.getElementById('topCategoryTime').textContent = this.formatTime(topTime);
        }

        sortedCategories.forEach(([category, time]) => {
            const percentage = totalTime > 0 ? Math.round((time / totalTime) * 100) : 0;
            const formattedTime = this.formatTime(time);

            const categoryItem = document.createElement('div');
            categoryItem.className = `category-item ${category}`;
            categoryItem.innerHTML = `
                <div class="category-info">
                    <span class="category-name">${category}</span>
                    <span class="category-percentage">${percentage}%</span>
                </div>
                <span class="category-time">${formattedTime}</span>
            `;

            categoryList.appendChild(categoryItem);
        });
    }

    updateGoals() {
        const productiveTime = this.data.categoryTime.productive || 0;
        const socialTime = this.data.categoryTime.social || 0;
        
        const productiveMinutes = Math.round(productiveTime / 60000);
        const socialMinutes = Math.round(socialTime / 60000);

        // Update productive time goal
        const productiveProgress = Math.min(100, (productiveMinutes / this.settings.goals.dailyProductiveTime) * 100);
        document.getElementById('productiveProgress').style.width = `${productiveProgress}%`;
        document.getElementById('productiveText').textContent = `${productiveMinutes} / ${this.settings.goals.dailyProductiveTime} min`;

        // Update social media limit
        const socialProgress = Math.min(100, (socialMinutes / this.settings.goals.maxSocialTime) * 100);
        document.getElementById('socialProgress').style.width = `${socialProgress}%`;
        document.getElementById('socialText').textContent = `${socialMinutes} / ${this.settings.goals.maxSocialTime} min`;

        // Change progress bar color if over limit
        if (socialMinutes > this.settings.goals.maxSocialTime) {
            document.getElementById('socialProgress').style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
        }
    }

    async updateTrend() {
        try {
            // Get last 7 days of data
            const trendData = [];
            const today = new Date();
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];
                
                const result = await chrome.storage.local.get([dateString]);
                const dayData = result[dateString];
                const score = dayData ? Math.round(dayData.productivityScore * 100) : 0;
                trendData.push(score);
            }

            this.renderTrendChart(trendData);
        } catch (error) {
            console.error('Error loading trend data:', error);
        }
    }

    renderTrendChart(scores) {
        const trendChart = document.getElementById('trendChart');
        trendChart.innerHTML = '';

        scores.forEach((score, index) => {
            const bar = document.createElement('div');
            bar.className = 'trend-bar';
            if (index === scores.length - 1) {
                bar.classList.add('active');
            }
            
            const height = Math.max(10, score); // Minimum 10% height
            bar.style.height = `${height}%`;
            
            trendChart.appendChild(bar);
        });
    }

    formatTime(milliseconds) {
        const minutes = Math.round(milliseconds / 60000);
        if (minutes < 60) {
            return `${minutes}m`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}h ${remainingMinutes}m`;
        }
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});
