//Final Working hacklyrics Bot - All Issues Fixed
//This version will definitely work
//By: @hacklyrics

require('./settings')
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const pino = require('pino')
const qrcode = require('qrcode-terminal')
const chalk = require('chalk')
const fs = require('fs')

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('session')
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ["hacklyrics Bot", "Chrome", "1.0.0"]
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        
        if (qr) {
            console.log(chalk.yellow('\n📱 QR CODE:'))
            qrcode.generate(qr, {small: true})
            console.log(chalk.cyan('Scan the QR code above with WhatsApp'))
        }
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log(chalk.green('✅ Connected successfully!'))
            console.log(chalk.magenta('🎉 Bot is ready!'))
        }
    })

    sock.ev.on('creds.update', saveCreds)
    
    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0]
        if (!msg.message) return
        
        const messageText = msg.message.conversation || 
                          msg.message.extendedTextMessage?.text
        
        if (messageText && messageText.startsWith('.')) {
            const command = messageText.slice(1).toLowerCase()
            const from = msg.key.remoteJid
            
            console.log(`Command: ${command}`)
            
            if (command === 'ping') {
                await sock.sendMessage(from, { text: '🏓 Pong! Bot is working!' })
            }
            
            if (command === 'menu') {
                await sock.sendMessage(from, { 
                    text: `🤖 *hacklyrics Bot*

Commands:
• .ping - Test
• .menu - This menu
• .info - Bot info

✅ Bot is working perfectly!
👨‍💻 By: @hacklyrics` 
                })
            }
            
            if (command === 'info') {
                await sock.sendMessage(from, { 
                    text: `🤖 *Bot Information*

Name: hacklyrics Bot
Status: Online ✅
Version: Final Working

Creator: hacklyrics
YouTube: @hacklyrics
WhatsApp: +977 9811216964

🎉 Bot is fully operational!` 
                })
            }
        }
    })
}

console.log(chalk.cyan('🚀 Starting Final Working Bot...'))
console.log(chalk.yellow('This version will definitely work!'))

connectToWhatsApp()
