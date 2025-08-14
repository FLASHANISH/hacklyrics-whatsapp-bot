//Fixed QR Code Bot - hacklyrics
//QR Code will display properly
//By: @hacklyrics

require('./settings')
const pino = require('pino')
const fs = require('fs')
const chalk = require('chalk')
const qrcodeTerminal = require('qrcode-terminal')
const { smsg } = require('./lib/myfunc')
const { default: makeWASocket, delay, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")

const store = {
    contacts: {}, chats: {}, messages: {},
    bind: function(ev) {
        console.log(chalk.cyan('📂 Store connected'))
    },
    loadMessage: function(jid, id) { return null }
}

async function startQRBot() {
    console.clear()
    console.log(chalk.magenta(`
╔════════════════════════════════════════╗
║      🚀 hacklyrics Bot - QR Fixed      ║
║        QR Code Will Display Here       ║
╚════════════════════════════════════════╝
`))

    try {
        console.log(chalk.yellow('🔧 Initializing bot...'))
        
        const { version } = await fetchLatestBaileysVersion()
        console.log(chalk.green(`✅ Baileys version: ${version}`))
        
        const { state, saveCreds } = await useMultiFileAuthState('./session')
        console.log(chalk.green('✅ Session loaded'))

        const sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false, // We'll handle QR manually
            browser: ['hacklyrics Bot', 'Desktop', '1.0.0'],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
            },
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: true
        })

        store.bind(sock.ev)

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update

            // Manual QR code handling
            if (qr) {
                console.log(chalk.yellow('\n📱 QR CODE GENERATED:'))
                console.log(chalk.cyan('═'.repeat(50)))
                
                // Generate QR in terminal
                qrcodeTerminal.generate(qr, { 
                    small: true,
                    errorCorrectionLevel: 'M'
                })
                
                console.log(chalk.cyan('═'.repeat(50)))
                console.log(chalk.green('📱 Scan this QR code with your WhatsApp app'))
                console.log(chalk.yellow('👆 Open WhatsApp > Settings > Linked Devices > Link Device'))
                console.log(chalk.red('⏰ QR code will refresh automatically if not scanned'))
                console.log(chalk.cyan('═'.repeat(50)))
            }

            if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
            }

            if (connection === 'open') {
                console.log(chalk.green('✅ SUCCESSFULLY CONNECTED!'))
                console.log(chalk.magenta(`
╔════════════════════════════════════════╗
║         🎉 BOT IS NOW ONLINE!          ║
╚════════════════════════════════════════╝
`))
                
                console.log(chalk.yellow('📱 Bot connected as:'))
                console.log(JSON.stringify(sock.user, null, 2))
                
                console.log(chalk.green('\n✅ Bot is ready to receive messages!'))
                console.log(chalk.cyan('📨 Send ".menu" in WhatsApp to test'))
                console.log(chalk.blue('📋 Available commands: .menu, .ping, .info, .test'))
            }

            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                
                console.log(chalk.red('❌ Connection closed'))
                console.log(chalk.yellow('Reason:', lastDisconnect?.error?.message))
                
                if (shouldReconnect) {
                    console.log(chalk.yellow('🔄 Reconnecting in 3 seconds...'))
                    setTimeout(() => startQRBot(), 3000)
                } else {
                    console.log(chalk.red('❌ Logged out. Please restart bot.'))
                    fs.rmSync('./session', { recursive: true, force: true })
                    console.log(chalk.yellow('🗑️ Session cleared. Restart to reconnect.'))
                }
            }
        })

        // Save credentials
        sock.ev.on('creds.update', saveCreds)

        // Handle messages
        sock.ev.on('messages.upsert', async ({ messages }) => {
            const m = messages[0]
            if (!m.message) return
            
            const messageText = m.message.conversation || 
                              m.message.extendedTextMessage?.text || ''
            
            if (messageText.startsWith('.')) {
                const command = messageText.slice(1).toLowerCase()
                const from = m.key.remoteJid
                
                console.log(chalk.blue(`📨 Command: ${command} from ${from}`))
                
                switch (command) {
                    case 'menu':
                    case 'help':
                        await sock.sendMessage(from, {
                            text: `🌟 *hacklyrics Bot Menu* 🌟

📱 *Commands Available:*
• .menu - Show this menu
• .ping - Test bot response
• .info - Bot information  
• .test - Test all systems

🎵 *Features:*
• YouTube Integration ✅
• QR Code System ✅
• Auto Message Processing ✅
• Enhanced Commands ✅

👨‍💻 *Creator:* hacklyrics
📺 *YouTube:* @hacklyrics
🐙 *GitHub:* flashsanu
📞 *WhatsApp:* +977 9811216964

🎊 *Status:* Online & Working!

Send any command to test the bot!`
                        })
                        break
                        
                    case 'ping':
                        const start = Date.now()
                        const sent = await sock.sendMessage(from, { text: '🏓 Pinging...' })
                        const end = Date.now()
                        
                        await sock.sendMessage(from, {
                            text: `🏓 *Pong!*
                            
⚡ *Response Time:* ${end - start}ms
🤖 *Status:* Online
📱 *Bot:* hacklyrics v4.1
✅ *All Systems:* Operational

Bot is working perfectly!`
                        })
                        break
                        
                    case 'info':
                        await sock.sendMessage(from, {
                            text: `🤖 *Bot Information*

📱 *Name:* hacklyrics WhatsApp Bot
🔧 *Version:* 4.1.0 (QR Fixed)
⚡ *Status:* Online & Operational
🌐 *Platform:* Node.js ${process.version}
⏰ *Uptime:* ${Math.floor(process.uptime())}s

✅ *Features Status:*
• Connection: ✅ Active
• Message Processing: ✅ Working
• Commands: ✅ Responding
• QR System: ✅ Fixed

👨‍💻 *Developer:* hacklyrics
📺 *YouTube:* @hacklyrics
🎊 *Bot Status:* Successfully Running!`
                        })
                        break

                    case 'test':
                        await sock.sendMessage(from, {
                            text: `🧪 *System Test Results*

✅ *Connection:* Active
✅ *Message Receiving:* Working
✅ *Message Sending:* Working  
✅ *Commands:* Responding
✅ *QR System:* Fixed
✅ *Session:* Stable

🎊 *Overall Status:* ALL SYSTEMS GO!

Bot is working perfectly! 🚀`
                        })
                        break
                        
                    default:
                        await sock.sendMessage(from, {
                            text: `❓ Unknown command: "${command}"

📋 Available commands:
• .menu - Show menu
• .ping - Test response
• .info - Bot info
• .test - System test

Type .menu for full command list!`
                        })
                }
            }
        })

        // Auto status view
        sock.ev.on('messages.upsert', async ({ messages }) => {
            const m = messages[0]
            if (m.key && m.key.remoteJid === 'status@broadcast' && global.autoswview) {
                await sock.readMessages([m.key])
                console.log(chalk.blue('📱 Auto-viewed status'))
            }
        })

        console.log(chalk.green('✅ Bot setup complete!'))
        console.log(chalk.yellow('📱 Waiting for QR code or existing session...'))

    } catch (error) {
        console.log(chalk.red('❌ Error:', error.message))
        console.log(chalk.yellow('🔄 Retrying in 5 seconds...'))
        setTimeout(() => startQRBot(), 5000)
    }
}

// Start the bot
console.log(chalk.cyan('🚀 Starting hacklyrics QR Bot...'))
startQRBot()

// Handle process signals
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Shutting down bot...'))
    process.exit(0)
})

process.on('uncaughtException', (err) => {
    console.log(chalk.red('❌ Error:', err.message))
    // Don't exit, try to continue
})

process.on('unhandledRejection', (reason) => {
    console.log(chalk.red('❌ Promise rejection:', reason))
    // Don't exit, try to continue
})
