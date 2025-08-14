#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Clear screen
clear

echo -e "${CYAN}============================================${NC}"
echo -e "${WHITE} 🎵 hacklyrics WhatsApp Bot Setup (Linux)${NC}"
echo -e "${CYAN}============================================${NC}"
echo -e "${PURPLE} Creator: hacklyrics${NC}"
echo -e "${BLUE} YouTube: youtube.com/@hacklyrics${NC}"
echo -e "${GREEN} GitHub: github.com/flashanish${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# Function to print step headers
print_step() {
    echo -e "${YELLOW}[$1] $2${NC}"
}

# Function to print success message
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error message
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Check if script is run as root (for system installs)
print_step "1/6" "🔐 Checking permissions..."
if [[ $EUID -eq 0 ]]; then
   echo -e "${YELLOW}⚠️  Running as root. This is fine for VPS/server installation.${NC}"
else
   echo -e "${BLUE}ℹ️  Running as regular user. Will use sudo when needed.${NC}"
fi

# Step 2: Update system
print_step "2/6" "📋 Updating system packages..."
if command -v apt-get &> /dev/null; then
    sudo apt-get update -y
    print_success "System updated!"
elif command -v yum &> /dev/null; then
    sudo yum update -y
    print_success "System updated!"
elif command -v pacman &> /dev/null; then
    sudo pacman -Sy
    print_success "System updated!"
else
    echo -e "${YELLOW}⚠️  Package manager not detected. Skipping system update.${NC}"
fi

# Step 3: Install Node.js
print_step "3/6" "📥 Installing Node.js..."
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing..."
    
    # For Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
        
    # For CentOS/RHEL
    elif command -v yum &> /dev/null; then
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs npm
        
    # For Arch Linux
    elif command -v pacman &> /dev/null; then
        sudo pacman -S nodejs npm --noconfirm
        
    else
        print_error "Could not install Node.js automatically."
        echo -e "${YELLOW}Please install Node.js manually from: https://nodejs.org/${NC}"
        exit 1
    fi
    
    if command -v node &> /dev/null; then
        print_success "Node.js installed successfully!"
        echo -e "${BLUE}Version: $(node --version)${NC}"
    else
        print_error "Node.js installation failed!"
        exit 1
    fi
else
    print_success "Node.js is already installed!"
    echo -e "${BLUE}Version: $(node --version)${NC}"
fi

# Step 4: Install additional dependencies
print_step "4/6" "🔧 Installing system dependencies..."
if command -v apt-get &> /dev/null; then
    sudo apt-get install -y git curl wget ffmpeg python3 python3-pip build-essential
elif command -v yum &> /dev/null; then
    sudo yum install -y git curl wget ffmpeg python3 python3-pip gcc-c++ make
elif command -v pacman &> /dev/null; then
    sudo pacman -S git curl wget ffmpeg python python-pip base-devel --noconfirm
fi
print_success "System dependencies installed!"

# Step 5: Install npm dependencies
print_step "5/6" "📦 Installing npm dependencies..."
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully!"
    else
        print_error "Failed to install dependencies!"
        echo -e "${YELLOW}💡 Try running: sudo npm install --unsafe-perm=true --allow-root${NC}"
        exit 1
    fi
else
    print_error "package.json not found!"
    exit 1
fi

# Step 6: Create required directories
print_step "6/6" "📂 Creating required directories..."
mkdir -p session
mkdir -p database
mkdir -p XeonMedia/audio
mkdir -p XeonMedia/video
mkdir -p XeonMedia/image
mkdir -p XeonMedia/sticker
mkdir -p XeonMedia/trash
chmod 755 session database XeonMedia
print_success "Directories created!"

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${WHITE} ✅ hacklyrics WhatsApp Bot Setup Complete!${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""
echo -e "${GREEN}🚀 To start the bot, run:${NC}"
echo -e "${WHITE}   node hacklyrics-full.js${NC}"
echo ""
echo -e "${BLUE}📱 Connection methods available:${NC}"
echo -e "${WHITE}   1. QR Code (scan with phone)${NC}"
echo -e "${WHITE}   2. Pairing Code (enter phone number)${NC}"
echo ""
echo -e "${PURPLE}🎵 Bot Features:${NC}"
echo -e "${WHITE}   ✅ YouTube Music Download${NC}"
echo -e "${WHITE}   ✅ Group Management${NC}"
echo -e "${WHITE}   ✅ Sticker Creation${NC}"
echo -e "${WHITE}   ✅ Media Conversion${NC}"
echo -e "${WHITE}   ✅ Bug/Crash Features${NC}"
echo -e "${WHITE}   ✅ Database Management${NC}"
echo ""
echo -e "${YELLOW}📞 Support:${NC}"
echo -e "${WHITE}   YouTube: youtube.com/@hacklyrics${NC}"
echo -e "${WHITE}   WhatsApp: +977 9811216964${NC}"
echo ""

# Ask if user wants to start the bot now
echo -e "${CYAN}Would you like to start the bot now? (y/n):${NC}"
read -r start_bot
if [[ $start_bot =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}🚀 Starting hacklyrics WhatsApp Bot...${NC}"
    echo ""
    node hacklyrics-full.js
fi
