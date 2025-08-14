//Fresh QR Code Generator - hacklyrics
//This will clear session and show new QR code
//By: @hacklyrics

require('./settings')
const pino = require('pino')
const fs = require('fs')
const chalk = require('chalk')
const qrcodeTerminal = require('qrcode-terminal')
const { smsg } = require('./lib/myfunc')
const { default: makeWASocket, delay, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")

// Clear existing session
console.clear()
console.log(chalk.red('🗑️ Clearing existing session...'))
if (fs.existsSync('./session')) {
    fs.rmSync('./session', { recursive: true, force: true })
    console.log(chalk.green('✅ Session cleared successfully'))
}

console.log(chalk.magenta(`
╔════════════════════════════════════════╗
║     🆕 FRESH QR CODE GENERATOR 🆕      ║
║        New QR Code Will Appear         ║
╚════════════════════════════════════════╝
`))

const store = {
    contacts: {}, chats: {}, messages: {},
    bind: function(ev) {
        console.log(chalk.cyan('📂 Store connected'))
    },
    loadMessage: function(jid, id) { return null }
}

async function generateFreshQR() {
    try {
        console.log(chalk.yellow('🔧 Initializing fresh bot session...'))
        
        const { version } = await fetchLatestBaileysVersion()
        console.log(chalk.green(`✅ Baileys version: ${version}`))
        
        // Force new session creation
        const { state, saveCreds } = await useMultiFileAuthState('./session')
        console.log(chalk.green('✅ New session initialized'))

        const sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false, // We'll handle QR manually for better control
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

            // QR Code Display
            if (qr) {
                console.log(chalk.yellow('\n📱 NEW QR CODE GENERATED:'))
                console.log(chalk.cyan('═'.repeat(60)))
                console.log(chalk.green('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP APP'))
                console.log(chalk.cyan('═'.repeat(60)))
                
                // Generate QR in terminal with optimal settings
                qrcodeTerminal.generate(qr, { 
                    small: true,
                    errorCorrectionLevel: 'M'
                })
                
                console.log(chalk.cyan('═'.repeat(60)))
                console.log(chalk.yellow('📱 HOW TO SCAN:'))
                console.log(chalk.white('1. Open WhatsApp on your phone'))
                console.log(chalk.white('2. Go to Settings > Linked Devices'))
                console.log(chalk.white('3. Tap "Link Device"'))
                console.log(chalk.white('4. Scan the QR code above'))
                console.log(chalk.red('⏰ QR code will refresh if not scanned within 20 seconds'))
                console.log(chalk.cyan('═'.repeat(60)))
            }

            if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
            }

            if (connection === 'open') {
                console.log(chalk.green('✅ SUCCESSFULLY CONNECTED WITH NEW QR!'))
                console.log(chalk.magenta(`
╔════════════════════════════════════════╗
║         🎉 BOT IS NOW ONLINE!          ║
║      Connected with Fresh QR Code!     ║
╚════════════════════════════════════════╝
`))
                
                console.log(chalk.yellow('📱 Bot connected as:'))
                console.log(JSON.stringify(sock.user, null, 2))
                
                console.log(chalk.green('\n✅ Bot is ready to receive messages!'))
                console.log(chalk.cyan('📨 Send ".menu" in WhatsApp to test'))
            }

            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                
                console.log(chalk.red('❌ Connection closed'))
                console.log(chalk.yellow('Reason:', lastDisconnect?.error?.message))
                
                if (shouldReconnect) {
                    console.log(chalk.yellow('🔄 Reconnecting in 3 seconds...'))
                    setTimeout(() => generateFreshQR(), 3000)
                } else {
                    console.log(chalk.red('❌ Logged out. Restart to get new QR.'))
                }
            }
        })

        // Save credentials
        sock.ev.on('creds.update', saveCreds)

        // Basic message handling
        sock.ev.on('messages.upsert', async ({ messages }) => {
            const m = messages[0]
            if (!m.message) return
            
            const messageText = m.message.conversation || 
                              m.message.extendedTextMessage?.text || ''
            
            if (messageText === '.ping') {
                await sock.sendMessage(m.key.remoteJid, {
                    text: `🏓 Pong! Fresh QR connection working perfectly!`
                })
            }
            
            if (messageText === '.menu') {
                await sock.sendMessage(m.key.remoteJid, {
                    text: `✅ Bot connected via fresh QR code!
                    
📱 Status: Online & Working
🔗 Connection: Fresh QR Session
🤖 Bot: hacklyrics v4.1

Send .ping to test response!`
                })
            }
        })

        console.log(chalk.green('✅ Fresh QR bot setup complete!'))
        console.log(chalk.yellow('📱 QR Code should appear above when generated...'))

    } catch (error) {
        console.log(chalk.red('❌ Error:', error.message))
        console.log(chalk.yellow('🔄 Retrying in 5 seconds...'))
        setTimeout(() => generateFreshQR(), 5000)
    }
}

// Start fresh QR generation
console.log(chalk.cyan('🚀 Starting fresh QR generation...'))
generateFreshQR()

// Handle process signals
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Shutting down bot...'))
    process.exit(0)
})

process.on('uncaughtException', (err) => {
    console.log(chalk.red('❌ Error:', err.message))
})

process.on('unhandledRejection', (reason) => {
    console.log(chalk.red('❌ Promise rejection:', reason))
})
