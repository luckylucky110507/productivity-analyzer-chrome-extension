@echo off
echo Setting up Git repository for Productivity Analyzer Chrome Extension...
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    echo Then restart this script
    pause
    exit /b 1
)

echo Git is installed. Proceeding with repository setup...
echo.

REM Initialize Git repository
echo Initializing Git repository...
git init

REM Add all files
echo Adding files to repository...
git add .

REM Create initial commit
echo Creating initial commit...
git commit -m "Initial commit: Productivity Analyzer Chrome Extension"

echo.
echo Repository setup complete!
echo.
echo Next steps:
echo 1. Go to https://github.com and create a new repository
echo 2. Copy the repository URL
echo 3. Run the following commands:
echo    git remote add origin YOUR_REPOSITORY_URL
echo    git branch -M main
echo    git push -u origin main
echo.
echo Or use GitHub Desktop for easier setup (see GITHUB_SETUP.md)
echo.
pause
