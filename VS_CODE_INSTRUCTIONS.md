# 🚀 How to Run hacklyrics Bot in VS Code

## 📋 Prerequisites
- VS Code is already open ✅
- Node.js is installed ✅
- All dependencies installed ✅

## 🎯 Easy Ways to Run the Bot in VS Code:

### Method 1: Using VS Code Terminal (Recommended)
1. **Open Terminal in VS Code:**
   - Press `Ctrl + `` (backtick) or
   - Go to `View` > `Terminal`

2. **Run any of these commands:**
   ```bash
   # Complete Bot (All Features)
   npm run complete
   
   # Enhanced Bot with QR Code
   npm run enhanced
   
   # Working Bot (Stable)
   npm run working
   
   # Launcher Menu
   npm start
   ```

### Method 2: Using VS Code Tasks
1. **Press `Ctrl + Shift + P`**
2. **Type: "Tasks: Run Task"**
3. **Select from:**
   - 🚀 Start Complete Bot
   - 🎵 Start Enhanced Bot  
   - 🛠️ Start Working Bot
   - 🧹 Clear Session
   - 📦 Install Dependencies
   - 🧪 Test Connection

### Method 3: Using Debug/Run Configuration
1. **Press `F5` or `Ctrl + F5`**
2. **Select from configurations:**
   - 🚀 Complete hacklyrics Bot
   - 🎵 Enhanced Bot (QR)
   - 🔐 Enhanced Bot (Pairing)
   - 🛠️ Working Bot
   - 📱 Original QR Bot
   - 🎯 Launcher Menu

### Method 4: Using NPM Scripts Panel
1. **Open NPM Scripts panel in Explorer**
2. **Click the play button next to any script:**
   - complete
   - enhanced
   - working
   - start (launcher)
   - clear-session
   - test

## 🔧 Quick Setup Commands:

```bash
# Install dependencies
npm install

# Clear old session
npm run clear-session

# Run complete bot
npm run complete
```

## 🎯 Recommended Flow:

1. **First time setup:**
   ```bash
   npm install
   npm run clear-session
   npm run complete
   ```

2. **Choose connection method:**
   - Option 1: QR Code (Fast)
   - Option 2: Pairing Code (Secure)

3. **Bot will show:**
   ```
   ╔══════════════════════════════════════════════╗
   ║            🎉 BOT FULLY OPERATIONAL!         ║
   ║  ✅ YouTube Search & Download                ║
   ║  📱 QR Code Generation/Reading               ║
   ║  🤖 AI Message Processing                    ║
   ║  📊 Enhanced Commands                        ║
   ╚══════════════════════════════════════════════╝
   ```

## 🐛 Troubleshooting:

### If you get connection errors:
```bash
npm run clear-session
npm run working
```

### If dependencies are missing:
```bash
npm install --force
```

### To test connection:
```bash
npm run test
```

## 📱 Bot Features Available:

### 📺 YouTube Commands:
- `.ytsearch <query>` - Search YouTube videos
- `.song <query/url>` - Download audio
- `.ytinfo <url>` - Get video information

### 📱 QR Code Commands:
- `.qr <text>` - Generate QR code
- `.readqr` - Read QR from image

### 🤖 Bot Commands:
- `.menu` - Show all commands
- `.info` - Bot information
- `.ping` - Test response
- `.owner` - Owner contact

## 🎊 Success!
Once running, send `.menu` in WhatsApp to see all available commands!

---
*Created by hacklyrics | YouTube: @hacklyrics | GitHub: @flashsanu*
