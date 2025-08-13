@echo off
echo ===============================================
echo          hacklyrics WhatsApp Bot Setup
echo ===============================================
echo.

echo Checking if Node.js is installed...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo After installation, run this script again.
    echo.
    echo Opening Node.js download page...
    start https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed!
echo.

echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ===============================================
echo       Dependencies installed successfully!
echo ===============================================
echo.
echo Starting hacklyrics Bot...
echo.

call npm start

pause
