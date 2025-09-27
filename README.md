# 📊 Productivity Analyzer Chrome Extension

A comprehensive Chrome extension that tracks and analyzes your browsing productivity with detailed insights, visualizations, and goal tracking.

## ✨ Features

### 🎯 Core Functionality
- **Real-time Activity Tracking**: Monitors your browsing behavior, time spent on websites, and user interactions
- **Smart Categorization**: Automatically categorizes websites into productive, social, entertainment, shopping, and news categories
- **Productivity Scoring**: Calculates a daily productivity score based on your browsing patterns
- **Idle Detection**: Stops tracking when you're away from your computer
- **Goal Setting**: Set daily goals for productive time and limits for distracting activities

### 📈 Analytics & Insights
- **Daily Overview**: View your productivity score, total time spent, and top categories
- **7-Day Trends**: Track your productivity trends over time with interactive charts
- **Category Breakdown**: See detailed time distribution across different website categories
- **Top Sites Analysis**: Identify your most visited websites and time spent on each
- **Performance Metrics**: Track page load times and user engagement patterns

### 🎨 User Interface
- **Modern Popup**: Clean, intuitive popup interface with real-time metrics
- **Comprehensive Settings**: Detailed options page for customization
- **Interactive Charts**: Beautiful visualizations using Chart.js
- **Responsive Design**: Works perfectly on different screen sizes
- **Dark/Light Theme**: Customizable appearance options

### 🔒 Privacy & Security
- **Local Data Storage**: All data is stored locally on your device
- **No External Servers**: No data is sent to external servers
- **User Control**: Full control over data collection and storage
- **Export/Import**: Export your data for backup or analysis

## 🚀 Installation

### From Source
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will be installed and ready to use

### Prerequisites
- Google Chrome browser (version 88 or higher)
- No additional dependencies required

## 📁 Project Structure

```
chrome-extension-productivity/
├── manifest.json          # Extension manifest
├── background.js          # Service worker for data collection
├── content.js            # Content script for page tracking
├── popup.html            # Popup interface
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── options.html          # Settings page
├── options.css           # Settings styles
├── options.js            # Settings functionality
├── icons/                # Extension icons
│   └── icon.svg          # SVG icon source
└── README.md             # This file
```

## 🛠️ Configuration

### Initial Setup
1. Click the extension icon in your browser toolbar
2. The extension will start tracking automatically
3. Visit the settings page to customize categories and goals

### Customizing Categories
1. Open the extension popup and click "Settings"
2. Navigate to the "Categories" tab
3. Add or remove domains for each category:
   - **Productive**: Work-related sites (GitHub, Stack Overflow, documentation)
   - **Social**: Social media platforms (Facebook, Twitter, Instagram)
   - **Entertainment**: Entertainment sites (YouTube, Netflix, Reddit)
   - **Shopping**: E-commerce sites (Amazon, eBay, online stores)
   - **News**: News and information sites (CNN, BBC, Reuters)

### Setting Goals
1. Go to the "Goals" tab in settings
2. Configure your daily targets:
   - **Productive Time Goal**: Target minutes for productive websites
   - **Social Media Limit**: Maximum minutes for social media
   - **Entertainment Limit**: Maximum minutes for entertainment
   - **Productivity Score Target**: Target daily productivity percentage

## 📊 Understanding Your Data

### Productivity Score
The productivity score (0-100%) is calculated based on:
- Time spent on productive websites (+100%)
- Time spent on social media (-50%)
- Time spent on entertainment (-30%)
- Time spent on shopping (-20%)
- Time spent on news (+10%)

### Categories
- **Productive**: Work, learning, and development websites
- **Social**: Social media and communication platforms
- **Entertainment**: Video streaming, gaming, and entertainment
- **Shopping**: E-commerce and online shopping
- **News**: News, blogs, and information sites
- **Uncategorized**: Sites that don't fit other categories

### Metrics Tracked
- **Time Spent**: Total time on each website and category
- **User Interactions**: Clicks, scrolls, keyboard input
- **Page Performance**: Load times and engagement metrics
- **Focus Time**: Active time vs. idle time
- **Session Data**: Detailed session information

## 🔧 Technical Details

### Architecture
- **Manifest V3**: Uses the latest Chrome extension API
- **Service Worker**: Background script for data processing
- **Content Scripts**: Page-level activity tracking
- **Chrome Storage API**: Local data persistence
- **Chart.js**: Data visualization library

### Data Storage
- **Chrome Storage Sync**: Settings and preferences
- **Chrome Storage Local**: Activity data and analytics
- **No External APIs**: All processing happens locally

### Permissions
- `activeTab`: Access current tab information
- `storage`: Store data locally
- `tabs`: Track tab changes and updates
- `idle`: Detect user idle state
- `alarms`: Schedule periodic data processing
- `unlimitedStorage`: Store large amounts of data

## 🎯 Use Cases

### Personal Productivity
- Track time spent on different types of websites
- Identify productivity patterns and distractions
- Set and monitor daily productivity goals
- Analyze browsing habits over time

### Time Management
- Understand where your time goes online
- Set limits for distracting activities
- Optimize your browsing for productivity
- Track progress toward goals

### Habit Building
- Monitor social media usage
- Track learning and development time
- Build awareness of online habits
- Create accountability for goals

## 🔄 Data Export/Import

### Exporting Data
1. Go to Settings > Data & Privacy
2. Click "Export Data"
3. Download your data as a JSON file

### Data Format
The exported data includes:
- Daily productivity scores
- Time spent by category
- Website visit history
- Session details
- User settings and preferences

## 🐛 Troubleshooting

### Common Issues
- **Extension not tracking**: Check if tracking is enabled in settings
- **Data not appearing**: Refresh the popup or wait a few minutes
- **Charts not loading**: Ensure you have an internet connection for Chart.js
- **Settings not saving**: Check Chrome storage permissions

### Reset Options
- **Reset Settings**: Restore default configuration
- **Clear Data**: Remove all stored data
- **Reinstall Extension**: Remove and reinstall if needed

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Make your changes
3. Test in Chrome developer mode
4. Submit a pull request

### Code Style
- Use modern JavaScript (ES6+)
- Follow Chrome extension best practices
- Maintain consistent code formatting
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Chart.js for beautiful data visualizations
- Chrome Extensions API for powerful browser integration
- Modern web standards for responsive design

## 📞 Support

For issues, questions, or feature requests:
1. Check the troubleshooting section
2. Review the settings and configuration
3. Create an issue in the repository
4. Contact the development team

---

**Happy Productivity Tracking! 🚀**

*Remember: The goal is not to eliminate all non-productive activities, but to be aware of your habits and make conscious choices about how you spend your time online.*
