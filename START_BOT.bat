@echo off
title hacklyrics WhatsApp Bot Launcher
color 0A

echo.
echo ============================================
echo        hacklyrics WhatsApp Bot Launcher
echo ============================================
echo.
echo Starting bot launcher...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not available!
    echo Please make sure Node.js is properly installed.
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js and npm are available
echo [INFO] Checking dependencies...

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo [INFO] Starting bot launcher...
echo.

REM Start the bot launcher
npm start

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Bot failed to start!
    echo.
    echo Try these solutions:
    echo 1. Run: npm install
    echo 2. Run: npm run clear-session
    echo 3. Check your internet connection
    echo.
    pause
    exit /b 1
)

echo.
echo Bot stopped.
pause
