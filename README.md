# hacklyrics WhatsApp Bot

A powerful WhatsApp bot built with Node.js and Baileys library.

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0.0 or higher
- npm or yarn package manager
- Stable internet connection

### Installation

1. **Clone or download the project**
```bash
   git clone https://github.com/FLASHANISH/hacklyrics-whatsapp-bot.git
   cd hacklyrics-whatsapp-bot
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the bot**
```bash
   npm start
   # or
   npm run start-bot
   ```

## 🔐 Authentication

The bot uses **pairing code authentication**:

1. Run the bot
2. Enter your WhatsApp number (with country code, e.g., +9779811216964)
3. The bot will generate a pairing code
4. Open WhatsApp → Settings → Linked Devices → Link a Device
5. Enter the pairing code shown in the terminal

## 📁 Project Structure

```
hacklyrics/
├── main.js              # Main bot logic
├── index.js             # Entry point
├── settings.js          # Bot configuration
├── XeonBug4.js          # Command handlers
├── lib/                 # Utility libraries
├── database/            # Data storage
├── session/             # WhatsApp session files
└── XeonMedia/           # Media files
```

## 🛠️ Available Scripts

- `npm start` - Start the bot normally
- `npm run start-bot` - Start with enhanced error handling
- `npm run clear-session` - Clear session files (fix auth issues)
- `npm run dev` - Start in development mode with auto-restart

## 🔧 Troubleshooting

### Connection Issues
1. **Clear session files**: `npm run clear-session`
2. **Check internet connection**
3. **Verify phone number format** (must include country code)
4. **Wait if rate limited** (try again after a few minutes)

### Common Errors
- **Authentication failed**: Clear session and restart
- **Rate limit exceeded**: Wait 5-10 minutes before retrying
- **Connection timeout**: Check firewall/network settings

### Session Management
- Session files are stored in `./session/` directory
- If authentication fails, run `npm run clear-session`
- Restart the bot after clearing sessions

## 📱 Features

- ✅ WhatsApp Web API integration
- ✅ Pairing code authentication
- ✅ Auto-reconnection
- ✅ Command handling system
- ✅ Media support (images, videos, stickers)
- ✅ Group management
- ✅ Auto-reply system

## 🚨 Important Notes

- **Never share your session files** - they contain sensitive authentication data
- **Use a stable internet connection** for reliable operation
- **Keep your phone connected** to the internet for the bot to work
- **Don't use multiple instances** with the same number

## 📞 Support

- **YouTube**: [@hacklyrics](http://www.youtube.com/@hacklyrics)
- **Instagram**: [@hacklyrics](https://instagram.com/incompleteanish)
- **Telegram**: [@hacklyrics](https://t.me/hacklyrics)
- **GitHub**: [@flashanish](https://github.com/flashanish)
- **linkedin**: [@anish](https://www.linkedin.com/in/anishkumarsahcsr)
- **WhatsApp**: +9779811216964

## 📄 License

MIT License - see LICENSE file for details

---

**⚠️ Disclaimer**: This bot is for educational purposes. Users are responsible for complying with WhatsApp's Terms of Service and applicable laws.
