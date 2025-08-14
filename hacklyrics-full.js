const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, jidNormalizedUser, makeInMemoryStore, downloadContentFromMessage, jidDecode } = require('@whiskeysockets/baileys')
const pino = require('pino')
const chalk = require('chalk')
const qrcode = require('qrcode-terminal')
const readline = require('readline')
const fs = require('fs')
const { smsg } = require('./lib/myfunc')

// Load settings
require('./settings')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = (text) => new Promise((resolve) => rl.question(text, resolve))

// Simple store implementation
const store = {
    contacts: {},
    chats: {},
    messages: {},
    bind: function(ev) {
        console.log(chalk.blue('📦 Store bound to events'));
    },
    loadMessage: function(jid, id) {
        return this.messages[jid + '_' + id] || null;
    }
}

console.log(chalk.cyan.bold('🚀 hacklyrics WhatsApp Bot - Full Featured'))
console.log(chalk.gray('=' .repeat(50)))
console.log(chalk.magenta('🤖 Bot Features:'))
console.log(chalk.white('  • YouTube Music Download'))
console.log(chalk.white('  • Image/Video Processing'))
console.log(chalk.white('  • Sticker Creation'))
console.log(chalk.white('  • Group Management'))
console.log(chalk.white('  • Advanced Commands'))
console.log(chalk.white('  • Bug/Crash Features'))
console.log(chalk.gray('=' .repeat(50)))

let connectionAttempts = 0
const MAX_ATTEMPTS = 5

async function startHacklyricsBot() {
    try {
        connectionAttempts++
        console.log(chalk.yellow(`📡 Connection Attempt: ${connectionAttempts}/${MAX_ATTEMPTS}`))
        
        // Ask for phone number or QR method
        if (connectionAttempts === 1) {
            console.log(chalk.cyan('\nChoose connection method:'))
            console.log(chalk.white('1. QR Code (scan with phone)'))
            console.log(chalk.white('2. Pairing Code (enter phone number)'))
            
            const method = await question(chalk.green('Enter choice (1 or 2): '))
            global.useQR = method === '1'
            
            if (!global.useQR) {
                global.phoneNumber = await question(chalk.green('Enter WhatsApp number (with country code): '))
            }
        }
        
        // Get latest Baileys version
        const { version, isLatest } = await fetchLatestBaileysVersion()
        console.log(chalk.blue(`📱 Using WhatsApp v${version.join('.')}, Latest: ${isLatest}`))
        
        // Create auth state
        const { state, saveCreds } = await useMultiFileAuthState('./session')
        
        // Create socket
        const XeonBotInc = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: ['hacklyrics Bot', 'Chrome', '1.0.0'],
            auth: state,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            markOnlineOnConnect: true,
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 60000,
            keepAliveIntervalMs: 30000,
            retryRequestDelayMs: 250
        })

        // Bind store
        store.bind(XeonBotInc.ev)

        XeonBotInc.ev.on('creds.update', saveCreds)

        XeonBotInc.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update

            // Handle QR code
            if (qr && global.useQR) {
                console.log(chalk.green('\n📱 Scan this QR code with your WhatsApp:'))
                console.log(chalk.cyan('WhatsApp → Settings → Linked Devices → Link a Device'))
                qrcode.generate(qr, { small: true })
            }

            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut
                
                console.log(chalk.red(`\n❌ Connection closed. Status: ${statusCode}`))
                console.log(chalk.gray(`Reason: ${lastDisconnect?.error?.message || 'Unknown'}`))
                
                if (shouldReconnect && connectionAttempts < MAX_ATTEMPTS) {
                    console.log(chalk.yellow(`🔄 Reconnecting in 3 seconds... (${connectionAttempts}/${MAX_ATTEMPTS})`))
                    setTimeout(() => startHacklyricsBot(), 3000)
                } else if (connectionAttempts >= MAX_ATTEMPTS) {
                    console.log(chalk.red('❌ Max attempts reached. Please restart the bot.'))
                    process.exit(1)
                } else {
                    console.log(chalk.red('❌ Logged out. Restart required.'))
                    process.exit(1)
                }
            } 
            else if (connection === 'open') {
                connectionAttempts = 0
                
                // Handle pairing code for new connections
                if (!global.useQR && !XeonBotInc.authState.creds.registered && global.phoneNumber) {
                    try {
                        console.log(chalk.yellow('📱 Requesting pairing code...'))
                        const code = await XeonBotInc.requestPairingCode(global.phoneNumber.replace(/[^0-9]/g, ''))
                        const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code
                        
                        console.log(chalk.bgGreen.black(' PAIRING CODE '), chalk.white.bold(formattedCode))
                        console.log(chalk.cyan('Enter this code in WhatsApp: Settings → Linked Devices → Link a Device'))
                    } catch (error) {
                        console.log(chalk.red('❌ Error getting pairing code:'), error.message)
                    }
                }
                
                console.log(chalk.green('\n✅ hacklyrics Bot Connected Successfully!'))
                console.log(chalk.magenta('👤 Bot User:'), chalk.white(JSON.stringify(XeonBotInc.user, null, 2)))
                
                // Display bot info
                console.log(chalk.cyan('\n' + '='.repeat(50)))
                console.log(chalk.bold.green('🤖 hacklyrics WhatsApp Bot is ONLINE!'))
                console.log(chalk.white('📅 Time:'), chalk.yellow(new Date().toLocaleString()))
                console.log(chalk.white('🔧 Creator:'), chalk.magenta('hacklyrics'))
                console.log(chalk.white('📺 YouTube:'), chalk.red('youtube.com/@hacklyrics'))
                console.log(chalk.white('📱 WhatsApp:'), chalk.green('+977 9811216964'))
                console.log(chalk.cyan('='.repeat(50)))
                
                // Set bot properties
                XeonBotInc.public = true
                XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)
                
                // Add decode function
                XeonBotInc.decodeJid = (jid) => {
                    if (!jid) return jid
                    if (/:\d+@/gi.test(jid)) {
                        let decode = jidDecode(jid) || {}
                        return decode.user && decode.server && decode.user + '@' + decode.server || jid
                    } else return jid
                }
                
                // Add getName function for XeonBug4 compatibility
                XeonBotInc.getName = async (jid) => {
                    try {
                        // Try to get contact name from store first
                        if (store && store.contacts && store.contacts[jid]) {
                            return store.contacts[jid].name || store.contacts[jid].notify || jid.split('@')[0]
                        }
                        
                        // Try to get from WhatsApp directly
                        const info = await XeonBotInc.onWhatsApp(jid)
                        if (info && info[0] && info[0].name) return info[0].name
                        
                        // Fallback to phone number
                        return jid.split('@')[0]
                    } catch (e) {
                        return jid.split('@')[0] // fallback to phone number
                    }
                }
            } 
            else if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
            }
        })

        // Handle messages - Connect to XeonBug4.js
        XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
            try {
                const mek = chatUpdate.messages[0]
                if (!mek.message) return
                
                // Process message
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                if (mek.key && mek.key.remoteJid === 'status@broadcast') return
                if (!XeonBotInc.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
                
                const m = smsg(XeonBotInc, mek, store)
                
                // Log incoming message
                const senderName = m.pushName || 'Unknown'
                const messageText = m.body || m.mtype || 'Media'
                console.log(chalk.blue(`\n📨 Message from ${senderName}:`))
                console.log(chalk.white(`💬 ${messageText.substring(0, 50)}${messageText.length > 50 ? '...' : ''}`))
                
                // Process with XeonBug4 (all advanced features)
                require('./XeonBug4')(XeonBotInc, m, mek.message, chatUpdate, store)
                
            } catch (err) {
                console.log(chalk.red('❌ Message processing error:'), err.message)
            }
        })

        // Auto status view
        XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
            if (global.autoswview) {
                const mek = chatUpdate.messages[0]
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    await XeonBotInc.readMessages([mek.key])
                }
            }
        })

        // Handle contacts update
        XeonBotInc.ev.on('contacts.update', update => {
            for (let contact of update) {
                let id = XeonBotInc.decodeJid(contact.id)
                if (store && store.contacts) store.contacts[id] = {
                    id,
                    name: contact.notify
                }
            }
        })

        // Additional message helper functions
        XeonBotInc.sendText = (jid, text, quoted = '', options) => XeonBotInc.sendMessage(jid, {
            text: text,
            ...options
        }, {
            quoted,
            ...options
        })

        return XeonBotInc

    } catch (error) {
        console.log(chalk.red('❌ Connection error:'), error.message)
        
        if (connectionAttempts < MAX_ATTEMPTS) {
            console.log(chalk.yellow(`🔄 Retrying in 5 seconds... (${connectionAttempts}/${MAX_ATTEMPTS})`))
            setTimeout(() => startHacklyricsBot(), 5000)
        } else {
            console.log(chalk.red('❌ Failed after maximum attempts. Please restart.'))
            process.exit(1)
        }
    }
}

// Start the bot
console.log(chalk.cyan('🚀 Starting hacklyrics WhatsApp Bot...'))
startHacklyricsBot()

// Graceful shutdown
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n👋 Shutting down hacklyrics Bot...'))
    process.exit(0)
})

process.on('uncaughtException', (err) => {
    console.log(chalk.red('💥 Uncaught Exception:'), err.message)
    console.log(chalk.yellow('🔄 Restarting in 3 seconds...'))
    setTimeout(() => startHacklyricsBot(), 3000)
})
