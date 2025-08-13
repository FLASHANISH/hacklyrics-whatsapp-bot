#!/data/data/com.termux/files/usr/bin/bash

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
echo -e "${WHITE} 🎵 hacklyrics WhatsApp Bot Setup (Termux)${NC}"
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

# Step 1: Check Termux environment
print_step "1/7" "📱 Checking Termux environment..."
if [ ! -d "/data/data/com.termux" ]; then
    print_error "This script is designed for Termux on Android!"
    exit 1
fi
print_success "Termux environment detected!"

# Step 2: Update packages
print_step "2/7" "📋 Updating Termux packages..."
pkg update -y && pkg upgrade -y
print_success "Termux packages updated!"

# Step 3: Install required packages
print_step "3/7" "📦 Installing required packages..."
pkg install -y nodejs npm git python ffmpeg wget curl
print_success "Required packages installed!"

# Step 4: Setup storage access
print_step "4/7" "📂 Setting up storage access..."
echo -e "${BLUE}ℹ️  You may need to grant storage permission when prompted...${NC}"
termux-setup-storage
sleep 2
print_success "Storage access configured!"

# Step 5: Install Node.js packages
print_step "5/7" "🔧 Installing Node.js dependencies..."
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_success "Node.js dependencies installed!"
    else
        print_error "Failed to install dependencies!"
        echo -e "${YELLOW}💡 Retrying with legacy peer deps...${NC}"
        npm install --legacy-peer-deps
    fi
else
    print_error "package.json not found!"
    exit 1
fi

# Step 6: Create required directories
print_step "6/7" "📁 Creating required directories..."
mkdir -p session
mkdir -p database
mkdir -p XeonMedia/{audio,video,image,sticker,trash}
chmod 755 session database XeonMedia
print_success "Directories created!"

# Step 7: Setup Wake Lock (prevent Android from killing the process)
print_step "7/7" "🔋 Setting up Wake Lock..."
pkg install -y termux-api
echo -e "${BLUE}ℹ️  Installing Termux:API app is recommended to prevent process killing${NC}"
print_success "Setup complete!"

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${WHITE} ✅ hacklyrics Bot Setup Complete (Termux)${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""
echo -e "${GREEN}🚀 To start the bot:${NC}"
echo -e "${WHITE}   node hacklyrics-full.js${NC}"
echo ""
echo -e "${YELLOW}📱 Termux Tips:${NC}"
echo -e "${WHITE}   • Keep Termux in foreground to prevent killing${NC}"
echo -e "${WHITE}   • Install Termux:API for better performance${NC}"
echo -e "${WHITE}   • Use 'termux-wake-lock' to prevent sleep${NC}"
echo -e "${WHITE}   • Use 'Ctrl + C' to stop the bot${NC}"
echo ""
echo -e "${BLUE}📱 Connection methods:${NC}"
echo -e "${WHITE}   1. QR Code (recommended for mobile)${NC}"
echo -e "${WHITE}   2. Pairing Code${NC}"
echo ""
echo -e "${PURPLE}🎵 Features available:${NC}"
echo -e "${WHITE}   ✅ YouTube Music Download${NC}"
echo -e "${WHITE}   ✅ Group Management${NC}"
echo -e "${WHITE}   ✅ Sticker Creation${NC}"
echo -e "${WHITE}   ✅ Media Conversion${NC}"
echo -e "${WHITE}   ✅ All advanced features${NC}"
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
    echo -e "${YELLOW}💡 Keep Termux running in foreground!${NC}"
    echo ""
    # Enable wake lock to prevent process killing
    termux-wake-lock
    node hacklyrics-full.js
fi
