# 🎵 hacklyrics WhatsApp Bot - Full Featured Music Bot

[![GitHub stars](https://img.shields.io/github/stars/flashanish/hacklyrics-whatsapp-bot.svg?style=social&label=Star)](https://github.com/flashanish/hacklyrics-whatsapp-bot)
[![GitHub forks](https://img.shields.io/github/forks/flashanish/hacklyrics-whatsapp-bot.svg?style=social&label=Fork)](https://github.com/flashanish/hacklyrics-whatsapp-bot/fork)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A powerful, feature-rich WhatsApp bot built with Node.js that can download YouTube music, manage groups, create stickers, and much more!

## ✨ Features

### 🎵 **Music & Media**
- ✅ **YouTube Music Download** - Download any song from YouTube
- ✅ **High Quality Audio** - 128kbps MP3 with metadata
- ✅ **Fast Processing** - Quick downloads and conversions
- ✅ **Multiple Formats** - MP3, MP4 support

### 🤖 **Bot Capabilities**
- ✅ **Group Management** - Admin commands, member control
- ✅ **Sticker Creation** - Convert images/videos to stickers
- ✅ **Media Conversion** - Image, video, audio conversions
- ✅ **Auto Status View** - Automatically view WhatsApp status
- ✅ **Bug/Crash Features** - Advanced bot functionalities

### 🛡️ **Advanced Features**
- ✅ **Multi-Session Support** - QR Code and Pairing Code login
- ✅ **Database Management** - Store and retrieve media
- ✅ **Owner Controls** - Full bot administration
- ✅ **Auto-Reply System** - Custom responses
- ✅ **24/7 Online** - Stable connection with auto-reconnect

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Git
- Windows/Linux/MacOS
- Active internet connection

### 📥 Step 1: Clone Repository

```bash
git clone https://github.com/flashanish/hacklyrics-whatsapp-bot.git
cd hacklyrics-whatsapp-bot
```

### 📦 Step 2: Install Dependencies

```bash
npm install
```

### ⚙️ Step 3: Configure Settings

1. Open `settings.js` and customize:
```javascript
global.ownernumber = 'YOUR_PHONE_NUMBER' // Your WhatsApp number
global.botname = 'hacklyrics Bot'
global.ownername = 'Your Name'
// Add other configurations as needed
```

### 🎯 Step 4: Start the Bot

```bash
node hacklyrics-full.js
```

### 📱 Step 5: Connect to WhatsApp

1. Choose connection method:
   - **Option 1**: QR Code (scan with your phone)
   - **Option 2**: Pairing Code (enter phone number)

2. For QR Code:
   - Scan the QR code with WhatsApp
   - Go to: WhatsApp → Settings → Linked Devices → Link a Device

3. For Pairing Code:
   - Enter your WhatsApp number
   - Enter the pairing code in WhatsApp

## 🎵 Usage Examples

### Music Download Commands
```
🎵 Download Music:
- song despacito
- play shape of you
- song tu maan meri jaan

📹 Video Download:
- ytmp4 https://youtube.com/watch?v=VIDEO_ID
- ytmp3 https://youtube.com/watch?v=VIDEO_ID
```

### Bot Commands
```
📋 Help Menu:
- help
- menu

👥 Group Management:
- tagall
- kick @user
- promote @user
- demote @user

🎨 Media Conversion:
- sticker (reply to image)
- toimage (reply to sticker)
- togif (reply to video)
```

## 📁 Project Structure

```
hacklyrics-whatsapp-bot/
├── 📄 hacklyrics-full.js      # Main bot file
├── 📄 XeonBug4.js            # Advanced features module
├── 📄 settings.js            # Bot configuration
├── 📄 package.json           # Dependencies
├── 📁 lib/                   # Library files
│   ├── 📄 ytdl2.js          # YouTube downloader
│   ├── 📄 myfunc.js         # Utility functions
│   └── 📄 exif.js           # Sticker metadata
├── 📁 database/              # Bot databases
├── 📁 XeonMedia/             # Media storage
│   ├── 📁 audio/            # Downloaded music
│   ├── 📁 image/            # Images
│   ├── 📁 video/            # Videos
│   └── 📁 sticker/          # Stickers
└── 📁 69/                    # Bug features
```

## 🔧 Troubleshooting

### Common Issues & Solutions

**1. FFmpeg Not Found**
```bash
npm install ffmpeg-static
```

**2. YouTube Download Errors**
```bash
npm install @distube/ytdl-core@latest
```

**3. Connection Issues**
- Delete `session` folder and reconnect
- Check internet connection
- Restart the bot

**4. Permission Errors**
```bash
# Windows (Run as Administrator)
npm install --unsafe-perm=true --allow-root

# Linux/Mac
sudo npm install
```

## 📋 Available Commands

### 🎵 Music Commands
- `play [song name]` - Download and play music
- `song [song name]` - Download music
- `ytmp3 [youtube url]` - YouTube to MP3
- `ytmp4 [youtube url]` - YouTube to MP4

### 👑 Owner Commands
- `shutdown` - Turn off bot
- `restart` - Restart bot
- `block [number]` - Block user
- `unblock [number]` - Unblock user
- `addowner [number]` - Add bot owner
- `delowner [number]` - Remove bot owner

### 👥 Group Commands
- `tagall` - Tag all members
- `hidetag [text]` - Hidden tag all
- `kick @user` - Remove member
- `add [number]` - Add member
- `promote @user` - Make admin
- `demote @user` - Remove admin
- `group [open/close]` - Group settings
- `linkgc` - Get group link

### 🎨 Convert Commands
- `sticker` - Create sticker (reply to image/video)
- `take [packname|author]` - Change sticker info
- `toimage` - Sticker to image
- `tovideo` - Convert to video
- `toaudio` - Convert to audio
- `togif` - Convert to GIF

### 💾 Database Commands
- `addvideo [name]` - Save video
- `addimage [name]` - Save image
- `addsticker [name]` - Save sticker
- `addvn [name]` - Save voice note
- `listvideo` - List saved videos
- `listimage` - List saved images

### 💥 Bug Commands (Advanced)
- `xcrash [number]` - Send crash message
- `xioscrash [number]` - iOS crash
- `iosgoogle [number]` - Google crash
- `xcrash2 [amount]` - Multiple crashes

## 🛠️ Development Setup

### For Developers

```bash
# Clone for development
git clone https://github.com/flashanish/hacklyrics-whatsapp-bot.git
cd hacklyrics-whatsapp-bot

# Install dev dependencies
npm install

# Start in development mode
npm run dev
```

### Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

### Get Help
- **YouTube**: [hacklyrics Channel](http://www.youtube.com/@hacklyrics)
- **WhatsApp**: +977 9811216964
- **Issues**: Create an issue on GitHub

### Donation
If you find this bot helpful, consider supporting:
- **Buy Me a Coffee**: [Link]
- **PayPal**: [Link]

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

- This bot is for educational purposes only
- Use responsibly and respect WhatsApp's Terms of Service
- The developers are not responsible for any misuse
- YouTube content downloading should comply with YouTube's Terms of Service

## 🌟 Acknowledgments

- **Creator**: hacklyrics
- **YouTube**: [@hacklyrics](http://www.youtube.com/@hacklyrics)
- **Based on**: Baileys WhatsApp Web API
- **Special Thanks**: All contributors and supporters

---

### 📈 Statistics

- ✅ **YouTube Downloads**: Unlimited
- ✅ **Supported Formats**: MP3, MP4, WebP, PNG, JPG
- ✅ **Group Support**: Up to 1000 members
- ✅ **Uptime**: 99.9% (with proper hosting)
- ✅ **Response Time**: < 2 seconds

### 🔄 Version History

- **v1.0.0** - Initial release
- **v1.1.0** - Added YouTube music download
- **v1.2.0** - Fixed FFmpeg integration
- **v1.3.0** - Added advanced features
- **v2.0.0** - Complete rewrite with stability improvements

---

<p align="center">
  <b>⭐ Star this repository if you found it helpful! ⭐</b>
</p>

<p align="center">
  Made with ❤️ by <a href="http://www.youtube.com/@hacklyrics">hacklyrics</a>
</p>
