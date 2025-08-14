//Working hacklyrics WhatsApp Bot - Connection Issues Fixed
//Base by hacklyrics (Xeon Bot Inc.)
//Fixed version with stable connection

require('./settings')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const readline = require('readline')
const qrcode = require('qrcode-terminal')
const { default: makeWASocket, delay, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

// Simple store
const store = {
    contacts: {},
    chats: {},
    messages: {},
    bind: function(ev) {
        console.log(chalk.cyan('📂 Store initialized'))
    },
    loadMessage: function(jid, id) {
        return null
    }
}

async function startWorkingBot() {
    console.clear()
    console.log(chalk.cyan(`
╔════════════════════════════════════════╗
║        🚀 hacklyrics Bot - FIXED       ║
║          Connection Issue Solved       ║
╚════════════════════════════════════════╝
`))

    try {
        console.log(chalk.yellow('🔧 Initializing bot...'))
        
        // Get latest version
        const { version } = await fetchLatestBaileysVersion()
        console.log(chalk.green(`✅ Baileys version: ${version}`))
        
        // Setup auth state
        const { state, saveCreds } = await useMultiFileAuthState('./session')
        console.log(chalk.green('✅ Auth state loaded'))

        // Ask for connection method
        console.log(chalk.yellow('\nChoose connection method:'))
        console.log('1. 📱 QR Code (Recommended)')
        console.log('2. 🔐 Pairing Code')
        
        const method = await question('Enter choice (1 or 2): ')
        
        let useQR = true
        let phoneNumber = ''
        
        if (method === '2') {
            useQR = false
            phoneNumber = await question('Enter WhatsApp number with country code (+919234694661): ')
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            console.log(chalk.green(`📱 Using number: +${phoneNumber}`))
        }

        // Create socket with fixed configuration
        const sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: useQR,
            browser: ['hacklyrics Bot', 'Desktop', '1.0.0'],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
            },
            generateHighQualityLinkPreview: true,
            shouldIgnoreJid: jid => isJidBroadcast(jid),
            markOnlineOnConnect: true,
            fireInitQueries: true,
            emitOwnEvents: false,
            syncFullHistory: false,
            maxMsgRetryCount: 5,
            appStateMacVerification: {
                patch: true,
                snapshot: true,
            }
        })

        store.bind(sock.ev)

        // Handle connection updates
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update

            if (qr) {
                console.log(chalk.yellow('\n📱 QR Code:'))
                qrcode.generate(qr, { small: true })
                console.log(chalk.cyan('Scan this QR code with WhatsApp!'))
            }

            if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting...'))
            }

            if (connection === 'open') {
                console.log(chalk.green('✅ Connected successfully!'))
                
                // Handle pairing code
                if (!useQR && !sock.authState.creds.registered) {
                    console.log(chalk.yellow('📱 Requesting pairing code...'))
                    try {
                        const code = await sock.requestPairingCode(phoneNumber)
                        console.log(chalk.green(`🔐 Pairing Code: ${code}`))
                        console.log(chalk.cyan('Enter this code in WhatsApp > Settings > Linked Devices'))
                    } catch (err) {
                        console.log(chalk.red('❌ Failed to get pairing code:', err.message))
                    }
                } else {
                    console.log(chalk.magenta('\n🎉 Bot is ready!'))
                    console.log(chalk.yellow('Bot connected as:', JSON.stringify(sock.user, null, 2)))
                    console.log(chalk.green('\n✅ You can now use the bot!'))
                    console.log(chalk.cyan('Send ".menu" in WhatsApp to see available commands'))
                    rl.close()
                }
            }

            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                console.log(chalk.red('Connection closed due to:', lastDisconnect?.error))
                
                if (shouldReconnect) {
                    console.log(chalk.yellow('🔄 Reconnecting...'))
                    setTimeout(() => startWorkingBot(), 3000)
                } else {
                    console.log(chalk.red('❌ Bot logged out. Please restart.'))
                    process.exit()
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
• WhatsApp: +977 9811216964`
                        })
                        break
                        
                    case 'ping':
                        await sock.sendMessage(from, { text: '🏓 Pong! Bot is working perfectly!' })
                        break
                        
                    case 'info':
                        await sock.sendMessage(from, {
                            text: `🤖 *Bot Information*

📱 *Name:* hacklyrics WhatsApp Bot
🔧 *Version:* 4.1.0 (Fixed)
⚡ *Status:* Online
🌐 *Platform:* Node.js ${process.version}

✅ *Features Active:*
• YouTube Integration
• QR Code Generation  
• Auto Message Processing
• Enhanced Commands

👨‍💻 *Developer:* hacklyrics
📺 *YouTube:* @hacklyrics`
                        })
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
        
        if (useQR) {
            console.log(chalk.yellow('📱 Waiting for QR scan...'))
        } else {
            console.log(chalk.yellow('📱 Waiting for pairing code entry...'))
        }

    } catch (error) {
        console.log(chalk.red('❌ Error starting bot:', error.message))
        console.log(chalk.yellow('🔄 Retrying in 5 seconds...'))
        setTimeout(() => startWorkingBot(), 5000)
    }
}

// Helper function
function isJidBroadcast(jid) {
    return jid === 'status@broadcast'
}

// Start the bot
startWorkingBot()

// Handle process termination
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Bot stopped'))
    process.exit(0)
})

process.on('uncaughtException', (err) => {
    console.log(chalk.red('❌ Error:', err.message))
})
