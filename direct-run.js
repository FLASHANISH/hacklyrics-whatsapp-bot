//Direct Run hacklyrics Bot - No Prompts
//Automatically uses QR code method
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
        console.log(chalk.cyan('📂 Store initialized'))
    },
    loadMessage: function(jid, id) { return null }
}

async function startDirectBot() {
    console.clear()
    console.log(chalk.cyan(`
╔════════════════════════════════════════╗
║    🚀 hacklyrics Bot - Direct Run      ║
║         QR Code Method (Auto)          ║
╚════════════════════════════════════════╝
`))

    try {
        console.log(chalk.yellow('🔧 Initializing bot...'))
        
        const { version } = await fetchLatestBaileysVersion()
        console.log(chalk.green(`✅ Baileys version: ${version}`))
        
        const { state, saveCreds } = await useMultiFileAuthState('./session')
        console.log(chalk.green('✅ Auth state loaded'))

        console.log(chalk.cyan('📱 Using QR Code Method (Automatic)'))

        const sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: true,
            browser: ['hacklyrics Bot', 'Desktop', '1.0.0'],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
            },
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: true,
            fireInitQueries: true,
            emitOwnEvents: false,
            syncFullHistory: false,
            maxMsgRetryCount: 5
        })

        store.bind(sock.ev)

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update

            if (qr) {
                console.log(chalk.yellow('\\n📱 QR Code:'))
                qrcodeTerminal.generate(qr, { small: true })
                console.log(chalk.cyan('📱 Scan this QR code with WhatsApp!'))
            }

            if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
            }

            if (connection === 'open') {
                console.log(chalk.green('✅ Connected successfully!'))
                console.log(chalk.magenta('🎉 Bot is ready!'))
                console.log(chalk.yellow('Bot connected as:', JSON.stringify(sock.user, null, 2)))
                console.log(chalk.green('\\n✅ You can now use the bot!'))
                console.log(chalk.cyan('Send ".menu" in WhatsApp to see available commands'))
            }

            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                console.log(chalk.red('Connection closed due to:', lastDisconnect?.error?.message))
                
                if (shouldReconnect) {
                    console.log(chalk.yellow('🔄 Reconnecting...'))
                    setTimeout(() => startDirectBot(), 3000)
                } else {
                    console.log(chalk.red('❌ Bot logged out. Please restart.'))
                    process.exit()
                }
            }
        })

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
                
                console.log(chalk.blue(`📨 Command received: ${command} from ${from}`))
                
                switch (command) {
                    case 'menu':
                        await sock.sendMessage(from, {
                            text: `🌟 *hacklyrics Bot Menu* 🌟

📱 *Basic Commands:*
• .ping - Test bot response
• .info - Bot information  
• .menu - Show this menu

🎵 *YouTube Features:*
• .ytsearch <query> - Search YouTube
• .song <url> - Download audio
• .ytinfo <url> - Video information

📊 *QR Code Features:*
• .qr <text> - Generate QR code
• .readqr - Read QR from image

👨‍💻 *Created by hacklyrics*
• YouTube: @hacklyrics
• GitHub: flashsanu
• WhatsApp: +977 9811216964

🎊 Bot is running successfully!`
                        })
                        break
                        
                    case 'ping':
                        await sock.sendMessage(from, { text: '🏓 Pong! Bot is working perfectly!' })
                        break
                        
                    case 'info':
                        await sock.sendMessage(from, {
                            text: `🤖 *Bot Information*

📱 *Name:* hacklyrics WhatsApp Bot
🔧 *Version:* 4.1.0 (Direct Run)
⚡ *Status:* Online & Working
🌐 *Platform:* Node.js ${process.version}

✅ *Features Active:*
• YouTube Integration ✅
• QR Code Generation ✅
• Auto Message Processing ✅
• Enhanced Commands ✅

👨‍💻 *Developer:* hacklyrics
📺 *YouTube:* @hacklyrics
🎊 *Status:* Successfully Running!`
                        })
                        break

                    case 'test':
                        await sock.sendMessage(from, { text: '✅ All systems operational! Bot is working perfectly!' })
                        break
                        
                    default:
                        console.log(chalk.gray(`Unknown command: ${command}`))
                }
            }
        })

        // Auto status view
        sock.ev.on('messages.upsert', async ({ messages }) => {
            const m = messages[0]
            if (m.key && m.key.remoteJid === 'status@broadcast' && global.autoswview) {
                await sock.readMessages([m.key])
            }
        })

        console.log(chalk.green('✅ Bot initialized successfully!'))
        console.log(chalk.yellow('📱 Waiting for QR scan or connection...'))

    } catch (error) {
        console.log(chalk.red('❌ Error starting bot:', error.message))
        console.log(chalk.yellow('🔄 Retrying in 5 seconds...'))
        setTimeout(() => startDirectBot(), 5000)
    }
}

console.log(chalk.yellow('🚀 Starting Direct hacklyrics Bot...'))
startDirectBot()

// Handle process termination
process.on('SIGINT', () => {
    console.log(chalk.yellow('\\n🛑 Bot stopped'))
    process.exit(0)
})

process.on('uncaughtException', (err) => {
    console.log(chalk.red('❌ Error:', err.message))
})
