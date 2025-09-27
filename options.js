// Options page script for settings and data visualization
class OptionsManager {
    constructor() {
        this.settings = null;
        this.data = null;
        this.charts = {};
        this.init();
    }

    async init() {
        await this.loadSettings();
        await this.loadData();
        this.setupEventListeners();
        this.initializeTabs();
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
                maxEntertainmentTime: 120,
                productivityTarget: 75
            }
        };
    }

    async loadData() {
        try {
            // Get last 7 days of data
            const data = await chrome.storage.local.get();
            this.data = {};
            const today = new Date();
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];
                
                if (data[dateString]) {
                    this.data[dateString] = data[dateString];
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = {};
        }
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Settings form
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('resetSettings').addEventListener('click', () => {
            this.resetSettings();
        });

        // Category management
        this.setupCategoryListeners();

        // Data management
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('clearData').addEventListener('click', () => {
            this.clearData();
        });
    }

    setupCategoryListeners() {
        // Add domain buttons
        document.getElementById('addProductive').addEventListener('click', () => {
            this.addDomain('productive', document.getElementById('productiveInput').value);
        });

        document.getElementById('addSocial').addEventListener('click', () => {
            this.addDomain('social', document.getElementById('socialInput').value);
        });

        document.getElementById('addEntertainment').addEventListener('click', () => {
            this.addDomain('entertainment', document.getElementById('entertainmentInput').value);
        });

        // Remove domain buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-domain')) {
                const domainItem = e.target.closest('.domain-item');
                const domain = domainItem.querySelector('span').textContent;
                const category = domainItem.closest('.category-item').querySelector('h4').textContent.toLowerCase();
                this.removeDomain(category, domain);
            }
        });
    }

    initializeTabs() {
        // Show overview tab by default
        this.switchTab('overview');
    }

    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });

        // Show selected tab content
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Initialize charts if switching to overview
        if (tabName === 'overview') {
            setTimeout(() => {
                this.initializeCharts();
            }, 100);
        }
    }

    updateUI() {
        this.updateSettingsForm();
        this.updateCategoriesForm();
        this.updateGoalsForm();
    }

    updateSettingsForm() {
        document.getElementById('trackingEnabled').checked = this.settings.trackingEnabled;
        document.getElementById('idleDetection').checked = this.settings.idleDetection || true;
        document.getElementById('idleThreshold').value = this.settings.idleThreshold;
        document.getElementById('notifications').checked = this.settings.notifications || true;
        document.getElementById('theme').value = this.settings.theme || 'light';
        document.getElementById('timeFormat').value = this.settings.timeFormat || '12h';
    }

    updateCategoriesForm() {
        // Update category lists
        this.updateCategoryList('productive', this.settings.categories.productive);
        this.updateCategoryList('social', this.settings.categories.social);
        this.updateCategoryList('entertainment', this.settings.categories.entertainment);
    }

    updateCategoryList(category, domains) {
        const list = document.getElementById(`${category}List`);
        list.innerHTML = '';
        
        domains.forEach(domain => {
            const domainItem = document.createElement('div');
            domainItem.className = 'domain-item';
            domainItem.innerHTML = `
                <span>${domain}</span>
                <button class="remove-domain">×</button>
            `;
            list.appendChild(domainItem);
        });
    }

    updateGoalsForm() {
        document.getElementById('productiveGoal').value = this.settings.goals.dailyProductiveTime;
        document.getElementById('socialLimit').value = this.settings.goals.maxSocialTime;
        document.getElementById('entertainmentLimit').value = this.settings.goals.maxEntertainmentTime;
        document.getElementById('productivityTarget').value = this.settings.goals.productivityTarget;
    }

    addDomain(category, domain) {
        if (!domain.trim()) return;

        const cleanDomain = domain.trim().toLowerCase();
        if (!this.settings.categories[category].includes(cleanDomain)) {
            this.settings.categories[category].push(cleanDomain);
            this.updateCategoryList(category, this.settings.categories[category]);
            
            // Clear input
            document.getElementById(`${category}Input`).value = '';
        }
    }

    removeDomain(category, domain) {
        const index = this.settings.categories[category].indexOf(domain);
        if (index > -1) {
            this.settings.categories[category].splice(index, 1);
            this.updateCategoryList(category, this.settings.categories[category]);
        }
    }

    async saveSettings() {
        // Collect form data
        this.settings.trackingEnabled = document.getElementById('trackingEnabled').checked;
        this.settings.idleDetection = document.getElementById('idleDetection').checked;
        this.settings.idleThreshold = parseInt(document.getElementById('idleThreshold').value);
        this.settings.notifications = document.getElementById('notifications').checked;
        this.settings.theme = document.getElementById('theme').value;
        this.settings.timeFormat = document.getElementById('timeFormat').value;

        // Goals
        this.settings.goals.dailyProductiveTime = parseInt(document.getElementById('productiveGoal').value);
        this.settings.goals.maxSocialTime = parseInt(document.getElementById('socialLimit').value);
        this.settings.goals.maxEntertainmentTime = parseInt(document.getElementById('entertainmentLimit').value);
        this.settings.goals.productivityTarget = parseInt(document.getElementById('productivityTarget').value);

        try {
            await chrome.storage.sync.set({ settings: this.settings });
            this.showNotification('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('Error saving settings', 'error');
        }
    }

    async resetSettings() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            this.settings = this.getDefaultSettings();
            await chrome.storage.sync.set({ settings: this.settings });
            this.updateUI();
            this.showNotification('Settings reset to defaults', 'success');
        }
    }

    async exportData() {
        try {
            const allData = await chrome.storage.local.get();
            const dataStr = JSON.stringify(allData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `productivity-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            this.showNotification('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showNotification('Error exporting data', 'error');
        }
    }

    async clearData() {
        if (confirm('Are you sure you want to clear all productivity data? This action cannot be undone.')) {
            try {
                await chrome.storage.local.clear();
                this.data = {};
                this.updateOverview();
                this.showNotification('All data cleared', 'success');
            } catch (error) {
                console.error('Error clearing data:', error);
                this.showNotification('Error clearing data', 'error');
            }
        }
    }

    initializeCharts() {
        this.createTrendChart();
        this.createCategoryChart();
        this.updateOverview();
    }

    createTrendChart() {
        const ctx = document.getElementById('trendChart').getContext('2d');
        
        const dates = Object.keys(this.data).sort();
        const scores = dates.map(date => {
            const dayData = this.data[date];
            return dayData ? Math.round(dayData.productivityScore * 100) : 0;
        });

        if (this.charts.trend) {
            this.charts.trend.destroy();
        }

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates.map(date => new Date(date).toLocaleDateString()),
                datasets: [{
                    label: 'Productivity Score',
                    data: scores,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createCategoryChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        // Calculate total time by category for all days
        const categoryTotals = {};
        Object.values(this.data).forEach(dayData => {
            if (dayData.categoryTime) {
                Object.entries(dayData.categoryTime).forEach(([category, time]) => {
                    categoryTotals[category] = (categoryTotals[category] || 0) + time;
                });
            }
        });

        const categories = Object.keys(categoryTotals);
        const times = Object.values(categoryTotals).map(time => Math.round(time / 60000)); // Convert to minutes

        if (this.charts.category) {
            this.charts.category.destroy();
        }

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
                datasets: [{
                    data: times,
                    backgroundColor: [
                        '#27ae60', // Productive - Green
                        '#e74c3c', // Social - Red
                        '#f39c12', // Entertainment - Orange
                        '#9b59b6', // Shopping - Purple
                        '#3498db', // News - Blue
                        '#95a5a6'  // Other - Gray
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    updateOverview() {
        // Get today's data
        const today = new Date().toISOString().split('T')[0];
        const todayData = this.data[today] || { totalTime: 0, productivityScore: 0, categoryTime: {} };

        // Update today's score
        const score = Math.round(todayData.productivityScore * 100);
        document.getElementById('todayScore').textContent = `${score}%`;

        // Update today's time
        const totalMinutes = Math.round(todayData.totalTime / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        document.getElementById('todayTime').textContent = `${hours}h ${minutes}m`;

        // Update sites visited (simplified - count unique domains)
        const uniqueSites = new Set();
        Object.values(this.data).forEach(dayData => {
            if (dayData.sessions) {
                dayData.sessions.forEach(session => {
                    if (session.tabs) {
                        session.tabs.forEach(([tabId, tab]) => {
                            if (tab.domain) {
                                uniqueSites.add(tab.domain);
                            }
                        });
                    }
                });
            }
        });
        document.getElementById('todaySites').textContent = uniqueSites.size;

        // Update top sites
        this.updateTopSites();
    }

    updateTopSites() {
        const topSitesList = document.getElementById('topSites');
        topSitesList.innerHTML = '';

        // Calculate site usage
        const siteUsage = {};
        Object.values(this.data).forEach(dayData => {
            if (dayData.sessions) {
                dayData.sessions.forEach(session => {
                    if (session.tabs) {
                        session.tabs.forEach(([tabId, tab]) => {
                            if (tab.domain) {
                                siteUsage[tab.domain] = (siteUsage[tab.domain] || 0) + (tab.totalTime || 0);
                            }
                        });
                    }
                });
            }
        });

        // Sort by usage time
        const sortedSites = Object.entries(siteUsage)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        if (sortedSites.length === 0) {
            topSitesList.innerHTML = '<p style="text-align: center; color: #6c757d;">No data yet</p>';
            return;
        }

        sortedSites.forEach(([domain, time]) => {
            const siteItem = document.createElement('div');
            siteItem.className = 'site-item';
            
            const minutes = Math.round(time / 60000);
            siteItem.innerHTML = `
                <span class="site-name">${domain}</span>
                <span class="site-time">${minutes}m</span>
            `;
            
            topSitesList.appendChild(siteItem);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease'
        });

        if (type === 'success') {
            notification.style.background = '#27ae60';
        } else if (type === 'error') {
            notification.style.background = '#e74c3c';
        } else {
            notification.style.background = '#3498db';
        }

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize options page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OptionsManager();
});
