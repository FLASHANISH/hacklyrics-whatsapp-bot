//Demo launcher for hacklyrics WhatsApp Bot
//Shows bot capabilities and features
//By: @hacklyrics

const chalk = require('chalk')

console.clear()

// Display awesome banner
console.log(chalk.cyan(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🚀 Enhanced hacklyrics WhatsApp Bot - DEMO SHOWCASE       ║
║                                                                ║
║           Full YouTube Integration + QR Code Features          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`))

console.log(chalk.yellow('🎯 Bot Features Showcase:'))
console.log(chalk.green(`
📺 YouTube Integration:
   • Search YouTube videos with detailed results
   • Download high-quality audio (MP3)  
   • Get video information and thumbnails
   • Support for multiple YouTube APIs
   
   Commands:
   .ytsearch Despacito
   .song https://youtu.be/kJQP7kiw5Fk
   .ytinfo https://youtu.be/example
`))

console.log(chalk.blue(`
📱 QR Code Functionality:
   • Generate QR codes from any text
   • Read QR codes from images
   • High-quality QR generation
   • Terminal QR display for console
   
   Commands:
   .qr Hello World
   .qrcode https://github.com/flashsanu
   .readqr (reply to QR image)
`))

console.log(chalk.magenta(`
🔐 Authentication Methods:
   • QR Code Scanning (Quick & Easy)
   • Pairing Code (Secure with Phone Number)
   • Auto Session Management
   • Multi-platform Support (Windows/Linux/Termux)
`))

console.log(chalk.cyan(`
🤖 Advanced Bot Features:
   • Auto status viewing
   • Smart command recognition
   • Enhanced message processing
   • Error handling & recovery
   • Hot reload development
   • Graceful shutdown
`))

console.log(chalk.yellow(`
🛠️ Available Launch Options:

1. npm start              - Interactive launcher menu
2. npm run enhanced       - Enhanced bot with QR code
3. npm run enhanced-pair  - Enhanced bot with pairing code
4. npm run start-qr       - Original QR code method
5. npm run test           - Test WhatsApp connection
6. npm run clear-session  - Clear session files

🪟 Windows Users: Double-click START_BOT.bat for easy launch!
`))

// Show system requirements
console.log(chalk.gray(`
📋 System Requirements:
• Node.js 16+ (Current: ${process.version})
• Platform: ${process.platform} ${process.arch}
• Working Directory: ${process.cwd()}
`))

// Show creator info
console.log(chalk.red(`
👨‍💻 Created by hacklyrics:
• YouTube: http://www.youtube.com/@hacklyrics
• GitHub: @flashsanu
• WhatsApp: +977 9811216964
• Instagram: @hacklyrics
• Telegram: @hacklyrics

🌟 Support the Project:
• ⭐ Star the repository on GitHub
• 📺 Subscribe to YouTube channel for free bot scripts
• 📱 Join WhatsApp channel for updates
• 🐙 Follow on GitHub for more projects
`))

console.log(chalk.green(`
🎉 Ready to Start? Run one of these commands:

For Beginners:     npm start
For Developers:    npm run dev
For Testing:       npm run test

💡 Pro Tip: Use the interactive launcher (npm start) to choose your preferred connection method!
`))

console.log(chalk.cyan(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🎬 Watch Setup Tutorial: youtube.com/@hacklyrics             ║
║  📱 Join WhatsApp Channel for Updates & Support               ║
║  🎯 Free bot scripts available on YouTube channel             ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`))

process.exit(0)
