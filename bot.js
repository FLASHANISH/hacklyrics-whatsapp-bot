const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const pino = require('pino')
const chalk = require('chalk')
const fs = require('fs')
const readline = require('readline')
const qrcode = require('qrcode-terminal')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = (text) => new Promise((resolve) => rl.question(text, resolve))

console.log(chalk.cyan('🤖 hacklyrics WhatsApp Bot Starting...'))

async function startBot() {
    try {
        // Ask user for connection method
        console.log(chalk.cyan('Choose connection method:'))
        console.log(chalk.white('1. QR Code (easier)'))
        console.log(chalk.white('2. Pairing Code (phone number)'))
        
        const method = await question(chalk.green('Enter choice (1 or 2): '))
        
        let phoneNumber = ''
        let useQR = method === '1'
        
        if (!useQR) {
            phoneNumber = await question(chalk.green('Enter your WhatsApp number (with country code, e.g., 9779811216964): '))
        }
        
        console.log(chalk.yellow('📡 Connecting to WhatsApp...'))
        
        // Create auth state
        const { state, saveCreds } = await useMultiFileAuthState('./session')
        
        // Create socket
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false, // We'll handle QR manually
            logger: pino({ level: 'silent' }),
            browser: ['hacklyrics Bot', 'Chrome', '1.0.0'],
            connectTimeoutMs: 60000
        })
        
        sock.ev.on('creds.update', saveCreds)
        
        // Handle QR code
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update
            
            // Display QR code
            if (qr && useQR) {
                console.log(chalk.green('📱 Scan this QR code with your WhatsApp:'))
                qrcode.generate(qr, { small: true })
            }
            
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
                if (shouldReconnect) {
                    startBot()
                }
            } else if (connection === 'open') {
                console.log(chalk.green('✅ Connected successfully!'))
                
                // If not registered, request pairing code
                if (!sock.authState.creds.registered) {
                    console.log(chalk.yellow('📱 Requesting pairing code...'))
                    try {
                        const code = await sock.requestPairingCode(phoneNumber.replace(/[^0-9]/g, ''))
                        const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code
                        
                        console.log(chalk.bgGreen.black(' PAIRING CODE '), chalk.white.bold(formattedCode))
                        console.log(chalk.cyan('Enter this code in WhatsApp: Settings > Linked Devices > Link a Device'))
                    } catch (error) {
                        console.log(chalk.red('❌ Error getting pairing code:'), error.message)
                    }
                } else {
                    console.log(chalk.green('🎉 Bot is ready and authenticated!'))
                    console.log(chalk.magenta('Bot User:'), sock.user)
                }
            } else if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting...'))
            }
        })
        
        // Handle messages
        sock.ev.on('messages.upsert', async ({ messages }) => {
            const m = messages[0]
            if (!m.message || m.key.fromMe) return
            
            const messageText = m.message.conversation || m.message.extendedTextMessage?.text || ''
            const from = m.key.remoteJid
            
            console.log(chalk.blue('📨 Message from'), from, ':', messageText)
            
            // Simple response example
            if (messageText.toLowerCase().includes('hello') || messageText.toLowerCase().includes('hi')) {
                await sock.sendMessage(from, { text: '👋 Hello! hacklyrics bot is working!' })
            }
        })
        
    } catch (error) {
        console.log(chalk.red('❌ Error:'), error.message)
        setTimeout(startBot, 5000) // Retry after 5 seconds
    }
}

startBot()

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err)
})
