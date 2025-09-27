// Background service worker for productivity tracking
class ProductivityTracker {
  constructor() {
    this.isTracking = false;
    this.currentSession = null;
    this.idleThreshold = 300000; // 5 minutes in milliseconds
    this.lastActivity = Date.now();
    this.setupEventListeners();
    this.initializeStorage();
  }

  setupEventListeners() {
    // Track tab changes
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabChange(activeInfo.tabId);
    });

    // Track tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.handleTabUpdate(tabId, tab);
      }
    });

    // Track window focus changes
    chrome.windows.onFocusChanged.addListener((windowId) => {
      this.handleWindowFocusChange(windowId);
    });

    // Track idle state
    chrome.idle.onStateChanged.addListener((newState) => {
      this.handleIdleStateChange(newState);
    });

    // Periodic data processing
    chrome.alarms.create('processData', { periodInMinutes: 1 });
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'processData') {
        this.processCollectedData();
      }
    });

    // Start tracking when extension is installed/enabled
    this.startTracking();
  }

  async initializeStorage() {
    const defaultSettings = {
      trackingEnabled: true,
      idleThreshold: 5, // minutes
      categories: {
        'productive': ['github.com', 'stackoverflow.com', 'docs.', 'learn.', 'tutorial'],
        'social': ['facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com'],
        'entertainment': ['youtube.com', 'netflix.com', 'twitch.tv', 'reddit.com'],
        'shopping': ['amazon.com', 'ebay.com', 'shopify.com', 'etsy.com'],
        'news': ['cnn.com', 'bbc.com', 'reuters.com', 'nytimes.com']
      },
      goals: {
        dailyProductiveTime: 480, // 8 hours in minutes
        maxSocialTime: 60, // 1 hour in minutes
        maxEntertainmentTime: 120 // 2 hours in minutes
      }
    };

    const result = await chrome.storage.sync.get(['settings']);
    if (!result.settings) {
      await chrome.storage.sync.set({ settings: defaultSettings });
    }
  }

  startTracking() {
    this.isTracking = true;
    this.currentSession = {
      startTime: Date.now(),
      tabs: new Map(),
      totalTime: 0,
      categoryTime: {},
      productivityScore: 0
    };
  }

  stopTracking() {
    this.isTracking = false;
    if (this.currentSession) {
      this.saveSession();
      this.currentSession = null;
    }
  }

  async handleTabChange(tabId) {
    if (!this.isTracking) return;

    const now = Date.now();
    const timeSpent = now - this.lastActivity;

    // Save time spent on previous tab
    if (this.currentSession.activeTabId) {
      this.updateTabTime(this.currentSession.activeTabId, timeSpent);
    }

    // Set new active tab
    this.currentSession.activeTabId = tabId;
    this.lastActivity = now;

    // Get tab info
    try {
      const tab = await chrome.tabs.get(tabId);
      this.categorizeAndTrack(tab);
    } catch (error) {
      console.log('Error getting tab info:', error);
    }
  }

  async handleTabUpdate(tabId, tab) {
    if (!this.isTracking || !tab.url) return;

    this.categorizeAndTrack(tab);
  }

  handleWindowFocusChange(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      // Browser lost focus
      this.handleIdleStateChange('idle');
    } else {
      // Browser gained focus
      this.handleIdleStateChange('active');
    }
  }

  handleIdleStateChange(newState) {
    if (newState === 'idle') {
      this.stopTracking();
    } else if (newState === 'active' && !this.isTracking) {
      this.startTracking();
    }
  }

  categorizeAndTrack(tab) {
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      return;
    }

    const domain = new URL(tab.url).hostname;
    const category = this.categorizeDomain(domain);
    
    if (!this.currentSession.tabs.has(tab.id)) {
      this.currentSession.tabs.set(tab.id, {
        url: tab.url,
        domain: domain,
        category: category,
        title: tab.title,
        startTime: Date.now(),
        totalTime: 0
      });
    }

    this.currentSession.activeTabId = tab.id;
  }

  categorizeDomain(domain) {
    const settings = chrome.storage.sync.get(['settings']);
    // This will be updated when we get settings
    return 'uncategorized';
  }

  updateTabTime(tabId, timeSpent) {
    if (!this.currentSession.tabs.has(tabId)) return;

    const tab = this.currentSession.tabs.get(tabId);
    tab.totalTime += timeSpent;
    this.currentSession.tabs.set(tabId, tab);

    // Update category time
    if (!this.currentSession.categoryTime[tab.category]) {
      this.currentSession.categoryTime[tab.category] = 0;
    }
    this.currentSession.categoryTime[tab.category] += timeSpent;
  }

  async processCollectedData() {
    if (!this.isTracking) return;

    const now = Date.now();
    const timeSpent = now - this.lastActivity;

    if (this.currentSession.activeTabId) {
      this.updateTabTime(this.currentSession.activeTabId, timeSpent);
    }

    this.lastActivity = now;
    this.calculateProductivityScore();
    await this.saveCurrentSession();
  }

  calculateProductivityScore() {
    const settings = chrome.storage.sync.get(['settings']);
    let score = 0;
    const totalTime = Object.values(this.currentSession.categoryTime).reduce((a, b) => a + b, 0);

    if (totalTime === 0) return;

    // Calculate score based on category weights
    const weights = {
      'productive': 1.0,
      'social': -0.5,
      'entertainment': -0.3,
      'shopping': -0.2,
      'news': 0.1,
      'uncategorized': 0.0
    };

    for (const [category, time] of Object.entries(this.currentSession.categoryTime)) {
      const percentage = time / totalTime;
      score += percentage * (weights[category] || 0);
    }

    this.currentSession.productivityScore = Math.max(0, Math.min(1, score));
  }

  async saveCurrentSession() {
    const sessionData = {
      ...this.currentSession,
      tabs: Array.from(this.currentSession.tabs.entries()),
      timestamp: Date.now()
    };

    // Save to daily data
    const today = new Date().toISOString().split('T')[0];
    const dailyData = await chrome.storage.local.get([today]) || {};
    
    if (!dailyData[today]) {
      dailyData[today] = {
        sessions: [],
        totalTime: 0,
        categoryTime: {},
        productivityScore: 0
      };
    }

    dailyData[today].sessions.push(sessionData);
    dailyData[today].totalTime += this.currentSession.totalTime;
    
    // Update daily category time
    for (const [category, time] of Object.entries(this.currentSession.categoryTime)) {
      if (!dailyData[today].categoryTime[category]) {
        dailyData[today].categoryTime[category] = 0;
      }
      dailyData[today].categoryTime[category] += time;
    }

    // Calculate daily productivity score
    const totalDailyTime = Object.values(dailyData[today].categoryTime).reduce((a, b) => a + b, 0);
    if (totalDailyTime > 0) {
      const weights = {
        'productive': 1.0,
        'social': -0.5,
        'entertainment': -0.3,
        'shopping': -0.2,
        'news': 0.1,
        'uncategorized': 0.0
      };
      
      let dailyScore = 0;
      for (const [category, time] of Object.entries(dailyData[today].categoryTime)) {
        const percentage = time / totalDailyTime;
        dailyScore += percentage * (weights[category] || 0);
      }
      dailyData[today].productivityScore = Math.max(0, Math.min(1, dailyScore));
    }

    await chrome.storage.local.set(dailyData);
  }

  async saveSession() {
    if (!this.currentSession) return;
    await this.saveCurrentSession();
  }

  async getProductivityData(days = 7) {
    const data = await chrome.storage.local.get();
    const result = {};
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      if (data[dateString]) {
        result[dateString] = data[dateString];
      }
    }
    
    return result;
  }
}

// Initialize the tracker
const tracker = new ProductivityTracker();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductivityTracker;
}
