@echo off
title hacklyrics WhatsApp Bot Setup
color 0A

echo.
echo ============================================
echo  🎵 hacklyrics WhatsApp Bot Setup
echo ============================================
echo  Creator: hacklyrics
echo  YouTube: youtube.com/@hacklyrics
echo  GitHub: github.com/flashanish
echo ============================================
echo.

echo [1/4] 📋 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo 📥 Please download and install Node.js from: https://nodejs.org/
    echo ✅ Then rerun this setup script.
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed!
)

echo.
echo [2/4] 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    echo 💡 Try running as Administrator
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installed successfully!
)

echo.
echo [3/4] 📂 Creating required directories...
if not exist "session\" mkdir session
if not exist "database\" mkdir database
if not exist "XeonMedia\audio\" mkdir XeonMedia\audio
echo ✅ Directories created!

echo.
echo [4/4] 🎯 Setup complete!
echo.
echo ============================================
echo  ✅ hacklyrics WhatsApp Bot Ready!
echo ============================================
echo.
echo 🚀 To start the bot, run:
echo    node hacklyrics-full.js
echo.
echo 📱 Connection methods available:
echo    1. QR Code (scan with phone)
echo    2. Pairing Code (enter phone number)
echo.
echo 🎵 Bot Features:
echo    ✅ YouTube Music Download
echo    ✅ Group Management
echo    ✅ Sticker Creation
echo    ✅ Media Conversion
echo    ✅ Bug/Crash Features
echo    ✅ Database Management
echo.
echo 📞 Support:
echo    YouTube: youtube.com/@hacklyrics
echo    WhatsApp: +977 9811216964
echo.
echo Press any key to start the bot now...
pause >nul

echo.
echo 🚀 Starting hacklyrics WhatsApp Bot...
node hacklyrics-full.js

pause
