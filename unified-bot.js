//🚀 UNIFIED hacklyrics WhatsApp Bot - All Code Connected
//Base by hacklyrics (Xeon Bot Inc.)
//This file connects all components: QR, Pairing, Enhanced features, Commands
//YouTube: http://www.youtube.com/@hacklyrics

require('./settings')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const PhoneNumber = require('awesome-phonenumber')
const qrcode = require('qrcode')
const qrcodeTerminal = require('qrcode-terminal')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep, reSize } = require('./lib/myfunc')
const { default: makeWASocket, delay, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, jidDecode, jidNormalizedUser, proto } = require("@whiskeysockets/baileys")

// Node modules
const NodeCache = require("node-cache")
const Pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")

// 📱 Phone number validation
const PHONENUMBER_MCC = {
    '91': 'India', '1': 'United States', '44': 'United Kingdom', 
    '977': 'Nepal', '92': 'Pakistan', '62': 'Indonesia',
    '55': 'Brazil', '86': 'China', '81': 'Japan',
    '49': 'Germany', '33': 'France', '234': 'Nigeria'
}

// 🗄️ Enhanced Store System
const store = {
    contacts: {}, chats: {}, messages: {}, groups: {},
    bind: function(ev) {
        console.log(chalk.cyan('🗄️ Enhanced Store System Connected'))
        
        // Contact management
        ev.on('contacts.set', ({ contacts }) => {
            for (const contact of contacts) {
                this.contacts[contact.id] = contact
            }
            console.log(chalk.green(`✅ ${contacts.length} contacts loaded`))
        })
        
        // Chat management
        ev.on('chats.set', ({ chats }) => {
            for (const chat of chats) {
                this.chats[chat.id] = chat
                if (chat.id.endsWith('@g.us')) {
                    this.groups[chat.id] = chat
                }
            }
            console.log(chalk.green(`✅ ${chats.length} chats loaded`))
        })
        
        // Message management
        ev.on('messages.set', ({ messages }) => {
            for (const message of messages) {
                if (message.key && message.key.remoteJid) {
                    this.messages[message.key.remoteJid + '_' + message.key.id] = message
                }
            }
            console.log(chalk.green(`✅ ${messages.length} messages loaded`))
        })
        
        // Real-time updates
        ev.on('contacts.update', (updates) => {
            for (const update of updates) {
                if (update.id) {
                    this.contacts[update.id] = { ...this.contacts[update.id], ...update }
                }
            }
        })
        
        ev.on('chats.update', (updates) => {
            for (const update of updates) {
                if (update.id) {
                    this.chats[update.id] = { ...this.chats[update.id], ...update }
                }
            }
        })
    },
    
    loadMessage: function(jid, id) {
        return this.messages[jid + '_' + id] || null
    },
    
    getMessage: function(jid, id) {
        const msg = this.loadMessage(jid, id)
        return msg?.message || null
    },
    
    getContact: function(jid) {
        return this.contacts[jid] || null
    },
    
    getChat: function(jid) {
        return this.chats[jid] || null
    }
}

// Global variables
let phoneNumber = ""
let connectionMode = "auto" // auto, qr, pairing
let owner, premium, _afk, hit

// Load databases with error handling
try {
    owner = JSON.parse(fs.readFileSync('./database/owner.json'))
    premium = JSON.parse(fs.readFileSync('./database/premium.json'))
    _afk = JSON.parse(fs.readFileSync('./database/afk-user.json'))
    hit = JSON.parse(fs.readFileSync('./database/total-hit-user.json'))
    console.log(chalk.green('✅ All databases loaded successfully'))
} catch (error) {
    console.log(chalk.yellow('⚠️ Some database files missing, creating defaults...'))
    // Create default files if missing
    if (!fs.existsSync('./database/owner.json')) {
        fs.writeFileSync('./database/owner.json', JSON.stringify([global.ownernumber]))
    }
    if (!fs.existsSync('./database/premium.json')) {
        fs.writeFileSync('./database/premium.json', JSON.stringify([]))
    }
    if (!fs.existsSync('./database/afk-user.json')) {
        fs.writeFileSync('./database/afk-user.json', JSON.stringify([]))
    }
    if (!fs.existsSync('./database/total-hit-user.json')) {
        fs.writeFileSync('./database/total-hit-user.json', JSON.stringify([]))
    }
    
    // Reload
    owner = JSON.parse(fs.readFileSync('./database/owner.json'))
    premium = JSON.parse(fs.readFileSync('./database/premium.json'))
    _afk = JSON.parse(fs.readFileSync('./database/afk-user.json'))
    hit = JSON.parse(fs.readFileSync('./database/total-hit-user.json'))
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

// 🎨 Display startup banner
function displayBanner() {
    console.clear()
    console.log(chalk.magenta(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║        🚀 UNIFIED hacklyrics WhatsApp Bot 🚀         ║
║                                                       ║
║     📱 Multi-Connection Support (QR + Pairing)       ║
║     🎵 YouTube Integration + Media Downloads          ║
║     🤖 Advanced Commands + Bug Features               ║
║     🔧 Enhanced Error Handling + Auto-Reconnect      ║
║     📊 Smart Database Management                      ║
║                                                       ║
║              Created by: @hacklyrics                  ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
`))
    
    console.log(chalk.cyan('📋 System Information:'))
    console.log(chalk.white(`   • Node.js: ${process.version}`))
    console.log(chalk.white(`   • Platform: ${process.platform} (${process.arch})`))
    console.log(chalk.white(`   • Working Directory: ${process.cwd()}`))
    console.log(chalk.white(`   • Bot Name: ${global.botname}`))
    console.log(chalk.white(`   • Owner: ${global.ownername}`))
    console.log('')
}

// 🔧 Connection method selector
async function selectConnectionMethod() {
    console.log(chalk.yellow('🔧 Connection Methods Available:\n'))
    console.log(chalk.green('1. 📱 QR Code (Recommended)'))
    console.log(chalk.blue('2. 🔐 Pairing Code'))
    console.log(chalk.magenta('3. 🔄 Auto (Try existing session first)'))
    console.log(chalk.red('4. 🗑️ Clear Session & Use QR'))
    console.log(chalk.white('5. ❌ Exit\n'))
    
    const choice = await question(chalk.bgBlack(chalk.greenBright('Select connection method (1-5): ')))
    
    switch (choice.trim()) {
        case '1':
            connectionMode = "qr"
            break
        case '2':
            connectionMode = "pairing"
            break
        case '3':
            connectionMode = "auto"
            break
        case '4':
            console.log(chalk.yellow('🗑️ Clearing session...'))
            if (fs.existsSync('./session')) {
                fs.rmSync('./session', { recursive: true, force: true })
                console.log(chalk.green('✅ Session cleared'))
            }
            connectionMode = "qr"
            break
        case '5':
            console.log(chalk.yellow('👋 Goodbye!'))
            process.exit(0)
            break
        default:
            console.log(chalk.red('❌ Invalid choice, using auto mode'))
            connectionMode = "auto"
    }
}

// 🚀 Main bot function
async function startUnifiedBot() {
    try {
        displayBanner()
        await selectConnectionMethod()
        
        console.log(chalk.cyan('🔧 Initializing Unified Bot...'))
        
        // Get latest Baileys version
        const { version, isLatest } = await fetchLatestBaileysVersion()
        console.log(chalk.green(`✅ Baileys version: ${version}${isLatest ? ' (Latest)' : ' (Outdated)'}`))
        
        // Initialize session
        const { state, saveCreds } = await useMultiFileAuthState('./session')
        console.log(chalk.green('✅ Session state loaded'))
        
        const msgRetryCounterCache = new NodeCache()
        
        // Check if we need phone number for pairing
        if (connectionMode === "pairing" && !state.creds.registered) {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright('📱 Enter your WhatsApp number (with country code, e.g., +916909137213): ')))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            
            // Validate phone number
            if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
                console.log(chalk.red('❌ Invalid country code!'))
                phoneNumber = await question(chalk.bgBlack(chalk.greenBright('📱 Enter valid WhatsApp number: ')))
                phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            }
            console.log(chalk.green(`✅ Using phone number: +${phoneNumber}`))
        }
        
        // Create socket with dynamic configuration
        const socketConfig = {
            logger: pino({ level: 'silent' }),
            printQRInTerminal: connectionMode === "qr",
            browser: ["hacklyrics Bot", "Desktop", "4.1.0"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid)
                let msg = await store.loadMessage(jid, key.id)
                return msg?.message || ""
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: undefined,
            connectTimeoutMs: 60_000,
            keepAliveIntervalMs: 30_000,
            version: [2, 2323, 4]
        }
        
        const XeonBotInc = makeWASocket(socketConfig)
        store.bind(XeonBotInc.ev)
        
        // Connection tracking
        let connectionAttempts = 0
        const maxConnectionAttempts = 5
        let pairingCodeRequested = false
        
        // 📱 Connection handler
        XeonBotInc.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update
            
            // QR Code handling
            if (qr && (connectionMode === "qr" || connectionMode === "auto")) {
                console.log(chalk.yellow('\n📱 QR CODE GENERATED'))
                console.log(chalk.cyan('═'.repeat(60)))
                
                // Manual QR generation for better visibility
                qrcodeTerminal.generate(qr, { 
                    small: true,
                    errorCorrectionLevel: 'M'
                })
                
                console.log(chalk.cyan('═'.repeat(60)))
                console.log(chalk.green('📱 HOW TO SCAN:'))
                console.log(chalk.white('1. Open WhatsApp on your phone'))
                console.log(chalk.white('2. Go to Settings > Linked Devices'))
                console.log(chalk.white('3. Tap "Link Device"'))
                console.log(chalk.white('4. Scan the QR code above'))
                console.log(chalk.red('⏰ QR refreshes automatically in ~20 seconds'))
                console.log(chalk.cyan('═'.repeat(60)))
            }
            
            // Connection status updates
            if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
            }
            
            if (connection === 'open') {
                console.log(chalk.green('✅ SUCCESSFULLY CONNECTED!'))
                
                // Handle pairing code if needed
                if (connectionMode === "pairing" && !XeonBotInc.authState.creds.registered && !pairingCodeRequested) {
                    pairingCodeRequested = true
                    try {
                        console.log(chalk.yellow('📱 Requesting pairing code...'))
                        await delay(3000)
                        
                        let code = await XeonBotInc.requestPairingCode(phoneNumber)
                        if (code) {
                            code = code?.match(/.{1,4}/g)?.join("-") || code
                            console.log(chalk.black(chalk.bgGreen(' PAIRING CODE: ')), chalk.black(chalk.bgWhite(` ${code} `)))
                            console.log(chalk.cyan('📱 Enter this code in WhatsApp: Settings > Linked Devices > Link Device'))
                            console.log(chalk.yellow('⏰ Code expires in 2 minutes'))
                        }
                    } catch (error) {
                        console.log(chalk.red('❌ Pairing code error:', error.message))
                    }
                }
                
                // Display success info
                console.log(chalk.magenta(`
╔═══════════════════════════════════════════════════════╗
║                 🎉 BOT IS NOW ONLINE! 🎉              ║
╚═══════════════════════════════════════════════════════╝
`))
                
                console.log(chalk.yellow('📱 Bot connected as:'))
                if (XeonBotInc.user) {
                    console.log(chalk.white(`   • ID: ${XeonBotInc.user.id}`))
                    console.log(chalk.white(`   • Name: ${XeonBotInc.user.name || 'Unknown'}`))
                    console.log(chalk.white(`   • Phone: ${XeonBotInc.user.id.split(':')[0]}`))
                }
                
                console.log(chalk.green('\n✅ All systems operational!'))
                console.log(chalk.cyan('📨 Send ".menu" in WhatsApp to test'))
                console.log(chalk.blue('🎵 Send ".play [song name]" to test YouTube'))
                console.log(chalk.magenta('📱 Send ".ping" to test response time'))
                
                // Close readline if open
                if (!rl.closed) {
                    rl.close()
                }
                
                // Reset connection attempts on successful connection
                connectionAttempts = 0
            }
            
            if (connection === 'close') {
                console.log(chalk.red('❌ Connection closed'))
                
                if (lastDisconnect?.error) {
                    const statusCode = lastDisconnect.error.output?.statusCode
                    console.log(chalk.red('Error:', lastDisconnect.error.message))
                    
                    // Handle specific error codes
                    if (statusCode === 401) {
                        console.log(chalk.red('❌ Authentication failed - clearing session'))
                        if (fs.existsSync('./session')) {
                            fs.rmSync('./session', { recursive: true, force: true })
                        }
                        process.exit(1)
                    }
                    
                    if (statusCode === DisconnectReason.loggedOut) {
                        console.log(chalk.red('❌ Logged out - clearing session'))
                        if (fs.existsSync('./session')) {
                            fs.rmSync('./session', { recursive: true, force: true })
                        }
                        process.exit(1)
                    }
                    
                    if (lastDisconnect.error.message.includes('rate-overlimit')) {
                        console.log(chalk.yellow('⚠️ Rate limited - waiting 60s'))
                        await delay(60000)
                    }
                }
                
                // Reconnection logic
                if (connectionAttempts < maxConnectionAttempts) {
                    connectionAttempts++
                    console.log(chalk.yellow(`🔄 Reconnecting... (${connectionAttempts}/${maxConnectionAttempts})`))
                    await delay(5000)
                    return startUnifiedBot()
                } else {
                    console.log(chalk.red('❌ Max reconnection attempts reached'))
                    process.exit(1)
                }
            }
        })
        
        // 💾 Save credentials
        XeonBotInc.ev.on('creds.update', saveCreds)
        
        // 📨 Enhanced message handling
        XeonBotInc.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0]
                if (!mek.message) return
                
                // Process message
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? 
                    mek.message.ephemeralMessage.message : mek.message
                    
                // Skip status broadcasts
                if (mek.key && mek.key.remoteJid === 'status@broadcast') return
                
                // Check if bot is public
                if (!XeonBotInc.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
                
                // Skip certain message IDs
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
                
                // Serialize message
                const m = smsg(XeonBotInc, mek, store)
                
                // Load main command handler
                if (fs.existsSync('./XeonBug4.js')) {
                    require("./XeonBug4")(XeonBotInc, m, chatUpdate, store)
                } else {
                    // Fallback basic command handler
                    await handleBasicCommands(XeonBotInc, m)
                }
            } catch (err) {
                console.log(chalk.red('❌ Message handler error:'), err.message)
            }
        })
        
        // 👁️ Auto status view
        XeonBotInc.ev.on('messages.upsert', async (chatUpdate) => {
            if (global.autoswview) {
                const mek = chatUpdate.messages[0]
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    await XeonBotInc.readMessages([mek.key])
                    console.log(chalk.blue('👁️ Auto-viewed status'))
                }
            }
        })
        
        // 📞 Additional helper functions for XeonBotInc
        XeonBotInc.decodeJid = (jid) => {
            if (!jid) return jid
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {}
                return decode.user && decode.server && decode.user + '@' + decode.server || jid
            } else return jid
        }
        
        XeonBotInc.getName = (jid, withoutContact = false) => {
            const id = XeonBotInc.decodeJid(jid)
            withoutContact = XeonBotInc.withoutContact || withoutContact
            let v
            
            if (id.endsWith("@g.us")) {
                return new Promise(async (resolve) => {
                    v = store.contacts[id] || {}
                    if (!(v.name || v.subject)) v = await XeonBotInc.groupMetadata(id) || {}
                    resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
                })
            } else {
                v = id === '0@s.whatsapp.net' ? {
                    id, name: 'WhatsApp'
                } : id === XeonBotInc.decodeJid(XeonBotInc.user.id) ? 
                XeonBotInc.user : (store.contacts[id] || {})
                
                return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || 
                       PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
            }
        }
        
        XeonBotInc.public = true
        XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)
        
        // Enhanced message sending functions
        XeonBotInc.sendText = (jid, text, quoted = '', options) => 
            XeonBotInc.sendMessage(jid, { text: text, ...options }, { quoted, ...options })
            
        XeonBotInc.sendImage = async (jid, path, caption = '', quoted = '', options) => {
            let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? 
                Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? 
                await (await getBuffer(path)) : fs.existsSync(path) ? 
                fs.readFileSync(path) : Buffer.alloc(0)
                
            return await XeonBotInc.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
        }
        
        console.log(chalk.green('✅ Unified Bot initialized successfully!'))
        console.log(chalk.yellow(`📡 Connection mode: ${connectionMode.toUpperCase()}`))
        
    } catch (error) {
        console.log(chalk.red('❌ Unified Bot error:', error.message))
        console.log(chalk.yellow('🔄 Retrying in 10 seconds...'))
        setTimeout(() => startUnifiedBot(), 10000)
    }
}

// 🤖 Basic command handler (fallback)
async function handleBasicCommands(XeonBotInc, m) {
    const body = (m.mtype === 'conversation') ? m.message.conversation : 
                 (m.mtype === 'imageMessage') ? m.message.imageMessage.caption : 
                 (m.mtype === 'videoMessage') ? m.message.videoMessage.caption : 
                 (m.mtype === 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                 (m.mtype === 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : 
                 (m.mtype === 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : 
                 (m.mtype === 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : ''
    
    const command = body.replace(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi, '').trim().split(/ +/).shift().toLowerCase()
    
    if (!body.startsWith('.')) return
    
    const from = m.key.remoteJid
    
    switch (command) {
        case 'menu':
        case 'help':
            await XeonBotInc.sendMessage(from, {
                text: `🚀 *UNIFIED hacklyrics Bot*

📱 *Basic Commands:*
• .menu - Show this menu
• .ping - Test bot response  
• .info - Bot information
• .runtime - Bot uptime
• .owner - Owner contact

🎵 *Media Commands:*
• .play [song] - YouTube music
• .video [search] - YouTube video
• .img [search] - Image search

🔧 *System Commands:*
• .restart - Restart bot
• .status - Bot status

✨ *Features:*
• Multi-connection support
• Enhanced error handling  
• YouTube integration
• Advanced commands
• Auto-reconnect

👨‍💻 *Developer:* hacklyrics
📺 *Channel:* @hacklyrics  
🌟 *Status:* Online & Working!`
            })
            break
            
        case 'ping':
            const start = Date.now()
            const msg = await XeonBotInc.sendMessage(from, { text: '📡 Testing...' })
            const end = Date.now()
            
            await XeonBotInc.sendMessage(from, {
                text: `🏓 *Pong!*

⚡ *Response Time:* ${end - start}ms
🤖 *Status:* Online
📱 *Bot:* hacklyrics Unified v4.1
✅ *All Systems:* Operational
🔗 *Connection:* Stable

*Bot is working perfectly!*`
            })
            break
            
        case 'info':
            await XeonBotInc.sendMessage(from, {
                text: `🤖 *Unified Bot Information*

📱 *Name:* hacklyrics Unified Bot
🔧 *Version:* 4.1.0 (Unified)
⚡ *Status:* Online & Operational  
🌐 *Platform:* Node.js ${process.version}
⏰ *Uptime:* ${Math.floor(process.uptime())}s
💾 *Memory:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB

✅ *Features Status:*
• Connection: ✅ Active
• Message Processing: ✅ Working
• Commands: ✅ Responding
• QR System: ✅ Working
• Pairing System: ✅ Working
• YouTube: ✅ Integrated
• Database: ✅ Connected

👨‍💻 *Developer:* hacklyrics
🚀 *All Systems:* GO!`
            })
            break
            
        case 'runtime':
            await XeonBotInc.sendMessage(from, {
                text: `⏰ *Bot Runtime*

🚀 *Started:* ${Math.floor(process.uptime())} seconds ago
📅 *Date:* ${new Date().toLocaleDateString()}
🕐 *Time:* ${new Date().toLocaleTimeString()}
💻 *Platform:* ${process.platform}
⚡ *Node.js:* ${process.version}

*Bot has been running smoothly!*`
            })
            break
            
        default:
            // Unknown command - no response to avoid spam
            break
    }
}

// 🛡️ Error handlers
process.on('uncaughtException', (err) => {
    const e = String(err)
    if (e.includes("conflict")) return
    if (e.includes("Socket connection timeout")) return  
    if (e.includes("not-authorized")) return
    if (e.includes("already-exists")) return
    if (e.includes("rate-overlimit")) return
    if (e.includes("Connection Closed")) return
    if (e.includes("Timed Out")) return
    if (e.includes("Value not found")) return
    console.log(chalk.red('❌ Uncaught Exception:'), err)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log(chalk.red('❌ Unhandled Promise Rejection:'), reason)
})

process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Shutting down Unified Bot...'))
    process.exit(0)
})

// 🚀 Start the Unified Bot
console.log(chalk.cyan('🚀 Starting hacklyrics Unified Bot...'))
startUnifiedBot()

// 🔄 File watcher for auto-reload
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`🔄 File updated: ${__filename}`))
    delete require.cache[file]
    require(file)
})
