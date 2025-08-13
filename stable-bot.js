const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const pino = require('pino')
const chalk = require('chalk')
const qrcode = require('qrcode-terminal')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = (text) => new Promise((resolve) => rl.question(text, resolve))

console.log(chalk.cyan.bold('🚀 hacklyrics WhatsApp Bot - Stable Version'))
console.log(chalk.gray('=' .repeat(50)))

let connectionAttempts = 0
const MAX_ATTEMPTS = 3

async function connectToWhatsApp() {
    try {
        connectionAttempts++
        console.log(chalk.yellow(`📡 Connection Attempt: ${connectionAttempts}/${MAX_ATTEMPTS}`))
        
        // Get latest Baileys version
        const { version, isLatest } = await fetchLatestBaileysVersion()
        console.log(chalk.blue(`Using WA v${version.join('.')}, isLatest: ${isLatest}`))
        
        // Create auth state
        const { state, saveCreds } = await useMultiFileAuthState('./auth_session')
        
        // Create socket with optimized settings
        const sock = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: ['hacklyrics Bot', 'Desktop', '1.0.0'],
            auth: state,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            markOnlineOnConnect: true,
            connectTimeoutMs: 30000,
            defaultQueryTimeoutMs: 60000,
            keepAliveIntervalMs: 30000,
            retryRequestDelayMs: 250
        })

        sock.ev.on('creds.update', saveCreds)

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update

            if (qr) {
                console.log(chalk.green('\n📱 Scan this QR code with your WhatsApp:'))
                console.log(chalk.cyan('Go to WhatsApp > Settings > Linked Devices > Link a Device'))
                qrcode.generate(qr, { small: true })
            }

            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut
                
                console.log(chalk.red(`\n❌ Connection closed. Status: ${statusCode}`))
                console.log(chalk.gray(`Error: ${lastDisconnect?.error?.message || 'Unknown'}`))
                
                if (shouldReconnect && connectionAttempts < MAX_ATTEMPTS) {
                    console.log(chalk.yellow(`🔄 Reconnecting in 5 seconds... (${connectionAttempts}/${MAX_ATTEMPTS})`))
                    setTimeout(() => connectToWhatsApp(), 5000)
                } else if (connectionAttempts >= MAX_ATTEMPTS) {
                    console.log(chalk.red('❌ Max connection attempts reached. Please restart the bot.'))
                } else {
                    console.log(chalk.red('❌ Logged out. Please restart the bot.'))
                }
            } else if (connection === 'open') {
                connectionAttempts = 0 // Reset on successful connection
                console.log(chalk.green('\n✅ Successfully connected to WhatsApp!'))
                console.log(chalk.magenta('👤 Bot User:'), chalk.white(JSON.stringify(sock.user, null, 2)))
                console.log(chalk.cyan('\n🤖 Bot is ready to receive messages!'))
                console.log(chalk.gray('Send "hello" to test the bot'))
            } else if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
            }
        })

        // Handle messages
        sock.ev.on('messages.upsert', async ({ messages }) => {
            try {
                const m = messages[0]
                if (!m.message || m.key.fromMe) return

                const messageText = m.message.conversation || 
                                 m.message.extendedTextMessage?.text || 
                                 m.message.imageMessage?.caption || 
                                 m.message.videoMessage?.caption || ''
                
                const from = m.key.remoteJid
                const senderName = m.pushName || 'Unknown'
                
                console.log(chalk.blue(`\n📨 Message from ${senderName} (${from}):`))
                console.log(chalk.white(`💬 ${messageText}`))
                
                // Auto responses
                if (messageText.toLowerCase().includes('hello') || messageText.toLowerCase().includes('hi')) {
                    await sock.sendMessage(from, { 
                        text: '👋 Hello! hacklyrics WhatsApp Bot is working perfectly!\n\n🤖 Bot Features:\n• Auto replies\n• Message logging\n• Stable connection\n\nDeveloped by hacklyrics ✨' 
                    })
                    console.log(chalk.green('✅ Auto reply sent!'))
                }
                
                if (messageText.toLowerCase().includes('test')) {
                    await sock.sendMessage(from, { 
                        text: '🧪 Test successful! Bot is running smoothly.\n\nTime: ' + new Date().toLocaleString() 
                    })
                    console.log(chalk.green('✅ Test reply sent!'))
                }
                
                if (messageText.toLowerCase().includes('status')) {
                    const uptime = process.uptime()
                    const minutes = Math.floor(uptime / 60)
                    const seconds = Math.floor(uptime % 60)
                    
                    await sock.sendMessage(from, { 
                        text: `📊 Bot Status:\n✅ Online\n⏱️ Uptime: ${minutes}m ${seconds}s\n🔧 Version: hacklyrics v1.0\n💚 All systems operational` 
                    })
                    console.log(chalk.green('✅ Status reply sent!'))
                }
                
            } catch (error) {
                console.log(chalk.red('❌ Error handling message:'), error.message)
            }
        })

        // Handle group updates
        sock.ev.on('groups.update', (updates) => {
            console.log(chalk.blue('👥 Group updates:'), updates)
        })

        return sock

    } catch (error) {
        console.log(chalk.red('❌ Connection error:'), error.message)
        
        if (connectionAttempts < MAX_ATTEMPTS) {
            console.log(chalk.yellow(`🔄 Retrying in 10 seconds... (${connectionAttempts}/${MAX_ATTEMPTS})`))
            setTimeout(() => connectToWhatsApp(), 10000)
        } else {
            console.log(chalk.red('❌ Failed to connect after maximum attempts. Please restart.'))
        }
    }
}

// Start the bot
console.log(chalk.cyan('🔧 Initializing hacklyrics WhatsApp Bot...'))
connectToWhatsApp()

// Graceful shutdown
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n👋 Shutting down hacklyrics Bot...'))
    process.exit(0)
})

process.on('uncaughtException', (err) => {
    console.log(chalk.red('💥 Uncaught Exception:'), err.message)
    console.log(chalk.yellow('🔄 Restarting in 5 seconds...'))
    setTimeout(() => process.exit(1), 5000)
})
