# PowerShell script to set up Git repository for Productivity Analyzer Chrome Extension

Write-Host "Setting up Git repository for Productivity Analyzer Chrome Extension..." -ForegroundColor Green
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/" -ForegroundColor Yellow
    Write-Host "Then restart this script" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Proceeding with repository setup..." -ForegroundColor Green
Write-Host ""

# Initialize Git repository
Write-Host "Initializing Git repository..." -ForegroundColor Cyan
git init

# Add all files
Write-Host "Adding files to repository..." -ForegroundColor Cyan
git add .

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit: Productivity Analyzer Chrome Extension"

Write-Host ""
Write-Host "Repository setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com and create a new repository" -ForegroundColor White
Write-Host "2. Copy the repository URL" -ForegroundColor White
Write-Host "3. Run the following commands:" -ForegroundColor White
Write-Host "   git remote add origin YOUR_REPOSITORY_URL" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "Or use GitHub Desktop for easier setup (see GITHUB_SETUP.md)" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
