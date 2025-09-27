# GitHub Repository Setup Guide

This guide will help you upload your Productivity Analyzer Chrome Extension to GitHub.

## Prerequisites

1. **Git Installation**: Download and install Git from [git-scm.com](https://git-scm.com/)
2. **GitHub Account**: Create a free account at [github.com](https://github.com/)
3. **GitHub CLI (Optional)**: For easier command-line operations

## Method 1: Using GitHub Desktop (Recommended for Beginners)

### Step 1: Install GitHub Desktop
1. Download GitHub Desktop from [desktop.github.com](https://desktop.github.com/)
2. Install and sign in with your GitHub account

### Step 2: Create Repository
1. Open GitHub Desktop
2. Click "Create a new repository on GitHub"
3. Fill in the details:
   - **Name**: `productivity-analyzer-chrome-extension`
   - **Description**: `A comprehensive Chrome extension that tracks and analyzes your browsing productivity with detailed insights, visualizations, and goal tracking.`
   - **Visibility**: Public (recommended) or Private
   - **Local path**: Choose the parent directory (not the extension folder itself)
4. Click "Create repository"

### Step 3: Add Files
1. In GitHub Desktop, you'll see the new repository
2. Copy all files from `chrome-extension-productivity` folder into the repository folder
3. GitHub Desktop will detect the new files
4. Add a commit message like "Initial commit: Productivity Analyzer Chrome Extension"
5. Click "Commit to main"
6. Click "Publish repository"

## Method 2: Using Command Line

### Step 1: Install Git
1. Download Git from [git-scm.com](https://git-scm.com/)
2. Install with default settings
3. Restart your terminal/command prompt

### Step 2: Initialize Repository
Open Command Prompt or PowerShell in the project directory and run:

```bash
# Navigate to your project directory
cd chrome-extension-productivity

# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Productivity Analyzer Chrome Extension"
```

### Step 3: Create GitHub Repository
1. Go to [github.com](https://github.com/)
2. Click "New repository" (green button)
3. Fill in details:
   - **Repository name**: `productivity-analyzer-chrome-extension`
   - **Description**: `A comprehensive Chrome extension that tracks and analyzes your browsing productivity with detailed insights, visualizations, and goal tracking.`
   - **Visibility**: Public (recommended)
   - **Don't** initialize with README (we already have one)
4. Click "Create repository"

### Step 4: Connect and Push
```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/productivity-analyzer-chrome-extension.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## Method 3: Using GitHub Web Interface

### Step 1: Create Repository
1. Go to [github.com](https://github.com/)
2. Click "New repository"
3. Fill in the details as above
4. Click "Create repository"

### Step 2: Upload Files
1. Click "uploading an existing file"
2. Drag and drop all files from your `chrome-extension-productivity` folder
3. Add commit message: "Initial commit: Productivity Analyzer Chrome Extension"
4. Click "Commit changes"

## Repository Structure

Your GitHub repository should contain:

```
productivity-analyzer-chrome-extension/
├── .gitignore
├── LICENSE
├── README.md
├── INSTALL.md
├── GITHUB_SETUP.md
├── package.json
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.css
├── popup.js
├── options.html
├── options.css
├── options.js
└── icons/
    └── icon.svg
```

## Post-Upload Steps

### 1. Update Repository Description
- Go to your repository on GitHub
- Click the gear icon next to "About"
- Add a description and website URL if you have one

### 2. Add Topics/Tags
- Click the gear icon next to "About"
- Add topics like: `chrome-extension`, `productivity`, `time-tracking`, `analytics`, `javascript`

### 3. Create Releases
1. Go to "Releases" in your repository
2. Click "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `Productivity Analyzer v1.0.0`
5. Add release notes describing the features
6. Upload the extension as a ZIP file

### 4. Enable Issues and Discussions
- Go to repository Settings
- Enable Issues and Discussions for community feedback

## Sharing Your Extension

### For Users to Install:
1. They can download the ZIP file from your repository
2. Extract it to their computer
3. Follow the installation guide in `INSTALL.md`

### For Developers:
1. They can clone your repository
2. Load it as an unpacked extension in Chrome
3. Contribute improvements via pull requests

## Maintenance

### Regular Updates:
1. Make changes to your local files
2. Commit changes: `git add . && git commit -m "Description of changes"`
3. Push to GitHub: `git push origin main`
4. Create new releases for major updates

### Community Management:
- Respond to issues and pull requests
- Update documentation as needed
- Consider adding a contributing guide

## Troubleshooting

### Git Not Found Error:
- Make sure Git is installed and added to your PATH
- Restart your terminal after installation

### Permission Denied:
- Check your GitHub credentials
- Use Personal Access Token instead of password

### Files Not Uploading:
- Check file size limits (GitHub has a 100MB limit per file)
- Ensure all files are in the correct directory

---

**Your Chrome extension is now ready to share with the world! 🚀**

Remember to keep your repository updated and engage with the community for feedback and contributions.
