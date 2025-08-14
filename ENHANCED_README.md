# 🚀 Enhanced hacklyrics WhatsApp Bot

A powerful, feature-rich WhatsApp Bot with YouTube integration, QR code functionality, and advanced automation capabilities!

![Bot Banner](https://img.shields.io/badge/hacklyrics-Bot-blue?style=for-the-badge&logo=whatsapp)
![Node.js](https://img.shields.io/badge/Node.js-16+-green?style=for-the-badge&logo=node.js)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

## ✨ Features

### 🎵 YouTube Integration
- YouTube video search with detailed results
- High-quality audio downloads (MP3)
- Video information extraction
- Thumbnail previews
- Multiple YouTube APIs support

### 📱 QR Code Functionality
- Generate QR codes from text
- Read QR codes from images
- High-quality QR generation
- Terminal QR display

### 🔐 Multiple Authentication Methods
- **QR Code Scanning** - Quick and easy
- **Pairing Code** - Secure number verification
- **Auto Session Management** - Persistent connections
- **Multi-platform Support** - Windows, Linux, Termux

### 🤖 Advanced Bot Features
- Auto status viewing
- Enhanced message processing
- Smart command recognition
- Error handling & recovery
- Hot reload development
- Graceful shutdown

### 🎯 Enhanced Commands
- `.ytsearch <query>` - Search YouTube videos
- `.song <query/url>` - Download audio from YouTube
- `.ytinfo <url>` - Get YouTube video information
- `.qr <text>` - Generate QR code
- `.readqr` - Read QR code from image
- `.menu` - Show all available commands

## 🚀 Quick Start

### Easy Launcher (Recommended)
```bash
npm start
```
This opens an interactive menu to choose your preferred connection method.

### Direct Methods
```bash
# Enhanced bot with QR code
npm run enhanced

# Enhanced bot with pairing code
npm run enhanced-pair

# Original QR method
npm run start-qr

# Test connection
npm run test
```

## 📋 Installation

### Prerequisites
- Node.js 16 or higher
- NPM or Yarn package manager
- Stable internet connection

### Windows Installation
```powershell
# Clone the repository
git clone https://github.com/flashsanu/hacklyrics-bot
cd hacklyrics-bot

# Install dependencies
npm install

# Start the launcher
npm start
```

### Linux/Ubuntu Installation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/flashsanu/hacklyrics-bot
cd hacklyrics-bot
npm install

# Run setup script
bash setup-linux.sh
```

### Termux (Android) Installation
```bash
# Update Termux
pkg update && pkg upgrade -y

# Install dependencies
pkg install nodejs git ffmpeg

# Clone and setup
git clone https://github.com/flashsanu/hacklyrics-bot
cd hacklyrics-bot

# Run Termux setup
bash setup-termux.sh
```

## 📱 Connection Methods

### 🔍 QR Code Method (Fastest)
1. Run `npm start` and select option 1 or 3
2. Scan the QR code with WhatsApp
3. Bot connects automatically
4. Start using commands!

### 🔐 Pairing Code Method (Most Secure)
1. Run `npm start` and select option 2 or 4
2. Enter your WhatsApp number with country code
3. Get the 8-digit pairing code
4. Go to WhatsApp > Settings > Linked Devices > Link a Device
5. Enter the pairing code
6. Bot connects securely!

## 🎵 YouTube Commands Usage

### Search YouTube Videos
```
.ytsearch Despacito
.youtube Ed Sheeran Shape of You
```

### Download Audio
```
.song https://youtu.be/kJQP7kiw5Fk
.ytmp3 Despacito Luis Fonsi
```

### Get Video Information
```
.ytinfo https://youtu.be/kJQP7kiw5Fk
```

## 📱 QR Code Commands Usage

### Generate QR Code
```
.qr Hello World
.qrcode https://github.com/flashsanu
.qr Contact: +977 9811216964
```

### Read QR Code
1. Reply to any image with QR code
2. Use command: `.readqr`
3. Bot will extract and display the content

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | 🚀 Interactive launcher menu |
| `npm run enhanced` | 🎵 Enhanced bot with QR code |
| `npm run enhanced-pair` | 🔐 Enhanced bot with pairing code |
| `npm run start-qr` | 📱 Original QR code method |
| `npm run start-force` | 🔄 Force pairing method |
| `npm run test` | 🧪 Test WhatsApp connection |
| `npm run clear-session` | 🗑️ Clear session files |
| `npm run dev` | 🔧 Development mode with hot reload |

## 🔧 Configuration

### Basic Settings (settings.js)
```javascript
// Bot Configuration
global.botname = 'hacklyricsV4'
global.ownername = 'hacklyrics'
global.ownernumber = '9779811216964'

// Features Toggle
global.autoRecording = true
global.autoTyping = false
global.autoread = false
global.autobio = true
global.autoswview = true

// Custom Prefix
global.prefa = ['','!','.','#','&']
```

### Advanced Configuration
- Edit `settings.js` for bot behavior
- Modify `enhanced-bot.js` for custom features
- Update `package.json` for dependencies

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Connection Problems
```bash
# Clear session and restart
npm run clear-session
npm start

# Test connection
npm run test
```

#### Rate Limit Issues
- Wait 10-15 minutes between connection attempts
- Use different phone numbers if needed
- Try VPN if region-blocked

#### Dependency Issues
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Update dependencies
npm update
```

#### YouTube Download Issues
- Check internet connection
- Verify YouTube URL validity
- Update ytdl-core: `npm install ytdl-core@latest`

### Error Codes
| Code | Meaning | Solution |
|------|---------|----------|
| 401 | Authentication failed | Clear session and reconnect |
| 403 | Rate limited | Wait and retry |
| 500 | Server error | Check internet connection |
| 404 | Media not found | Verify URL or search query |

## 🔒 Security & Privacy

- Session files are stored locally
- No data is sent to external servers
- QR codes are generated locally
- YouTube downloads use official APIs
- All communications are encrypted

## 📈 Performance Optimization

### For Better Performance
```javascript
// In settings.js
global.autoTyping = false  // Disable if not needed
global.autoRecording = false  // Reduce CPU usage
```

### Memory Management
- Restart bot periodically for long-term use
- Clear session if experiencing issues
- Monitor CPU/RAM usage

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits & Support

### 👨‍💻 Created by hacklyrics
- **YouTube**: [@hacklyrics](http://www.youtube.com/@hacklyrics)
- **GitHub**: [@flashsanu](https://github.com/flashsanu)
- **Instagram**: [@hacklyrics](https://instagram.com/hacklyrics)
- **WhatsApp**: +977 9811216964
- **Telegram**: [@hacklyrics](https://t.me/hacklyrics)

### 🌟 Support the Project
- ⭐ Star this repository
- 📺 Subscribe to [YouTube Channel](http://www.youtube.com/@hacklyrics)
- 📱 Join [WhatsApp Channel](https://whatsapp.com/channel/0029VaAWr3x5PO0y7qLfcR26)
- 🐙 Follow on [GitHub](https://github.com/flashsanu)

### 📚 Resources
- [Baileys Documentation](https://github.com/WhiskeySockets/Baileys)
- [Node.js Documentation](https://nodejs.org/docs/)
- [YouTube API Documentation](https://developers.google.com/youtube)

---

<div align="center">

**🎉 Thank you for using hacklyrics Bot! 🎉**

*Free bot scripts and tutorials available on our YouTube channel*

![GitHub stars](https://img.shields.io/github/stars/flashsanu/hacklyrics-bot?style=social)

</div>

## 📝 Changelog

### Version 4.1.0 (Enhanced)
- ✅ Added full YouTube integration
- ✅ Added QR code generation and reading
- ✅ Added interactive launcher
- ✅ Enhanced error handling
- ✅ Improved connection stability
- ✅ Added development mode
- ✅ Enhanced documentation

### Previous Versions
- **4.0.0**: Original release with basic WhatsApp functionality
- **3.x.x**: Legacy versions with limited features

## 🔮 Upcoming Features

- 🎥 Video downloads from YouTube
- 🎨 Sticker creation from images
- 🌐 Multi-language support
- 📊 Usage analytics
- 🔧 Plugin system
- 📱 Web dashboard
- 🤖 AI integration

---

*Made with ❤️ by hacklyrics*
