Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "          hacklyrics WhatsApp Bot Setup" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking if Node.js is installed..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    Write-Host "Node.js is installed! Version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opening Node.js download page..." -ForegroundColor Cyan
    Start-Process "https://nodejs.org/"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "       Dependencies installed successfully!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Starting hacklyrics Bot..." -ForegroundColor Cyan
Write-Host ""

npm start

Read-Host "Press Enter to exit"
