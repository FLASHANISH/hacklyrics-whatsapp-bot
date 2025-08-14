//base by hacklyrics (Xeon Bot Inc.)
//re-upload? recode? copy code? give credit ya :)
//YouTube: http://www.youtube.com/@hacklyrics
//Instagram: @hacklyrics
//Telegram: t.me/hacklyrics
//GitHub: @flashsanu
//WhatsApp: +9779811216964
//want more free bot scripts? subscribe to my youtube channel: https://youtube.com/@hacklyrics

require('./settings')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const { default: makeWASocket, delay, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, jidDecode, jidNormalizedUser, proto } = require("@whiskeysockets/baileys")

const NodeCache = require("node-cache")
const Pino = require("pino")
const readline = require("readline")

// Create simple store object since makeInMemoryStore is not available
const store = {
    contacts: {},
    chats: {},
    messages: {},
    bind: function(ev) {
        console.log('Store bound to events');
    },
    loadMessage: function(jid, id) {
        return this.messages[jid + '_' + id] || null;
    }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

async function startXeonBotInc() {
//------------------------------------------------------
let { version, isLatest } = await fetchLatestBaileysVersion()
console.log(chalk.cyan(`📱 Using Baileys version: ${version}`))

const { state, saveCreds } = await useMultiFileAuthState(`./session`)
const msgRetryCounterCache = new NodeCache()

// Get phone number first
let phoneNumberInput = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFor example: +916909137213 : `)))
phoneNumberInput = phoneNumberInput.replace(/[^0-9]/g, '')

console.log(chalk.green(`📱 Using phone number: +${phoneNumberInput}`))

const XeonBotInc = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: [ "Chrome (Linux)", "", "" ],
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
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
    version: [2, 2323, 4],
})

store.bind(XeonBotInc.ev)

let pairingCodeRequested = false
let connectionAttempts = 0
const maxConnectionAttempts = 5

// Force pairing code request after connection
async function forcePairingCode() {
    if (pairingCodeRequested) return
    
    pairingCodeRequested = true
    console.log(chalk.yellow('🚀 FORCING pairing code request...'))
    
    try {
        // Wait a bit for connection to stabilize
        await delay(2000)
        
        console.log(chalk.yellow('📱 Requesting pairing code...'))
        let code = await XeonBotInc.requestPairingCode(phoneNumberInput)
        
        if (code) {
            code = code?.match(/.{1,4}/g)?.join("-") || code
            console.log(chalk.black(chalk.bgGreen(`🎯 SUCCESS! Your Pairing Code : `)), chalk.black(chalk.white(code)))
            console.log(chalk.cyan('Enter this code in your WhatsApp: Settings > Linked Devices > Link a Device'))
            console.log(chalk.yellow('⚠️  You have 2 minutes to enter the code before it expires'))
            
            // Set timeout for pairing code
            setTimeout(() => {
                if (!XeonBotInc.authState.creds.registered) {
                    console.log(chalk.red('⏰ Pairing code expired. Please restart the bot.'))
                    process.exit(1)
                }
            }, 120000) // 2 minutes
        } else {
            console.log(chalk.red('❌ Failed to generate pairing code.'))
            pairingCodeRequested = false
        }
    } catch (error) {
        console.log(chalk.red('❌ Error requesting pairing code:', error.message))
        pairingCodeRequested = false
        
        if (error.message.includes('rate-overlimit')) {
            console.log(chalk.yellow('⚠️ Rate limit exceeded. Please wait 10-15 minutes.'))
        } else if (error.message.includes('not-authorized')) {
            console.log(chalk.red('❌ Phone number not authorized. Please check the number.'))
        } else {
            console.log(chalk.red('❌ Unknown error. Please restart the bot.'))
        }
    }
}

XeonBotInc.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    
    if (connection === 'connecting') {
        console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
    }
    
    if (connection === 'open') {
        console.log(chalk.green('✅ Connected to WhatsApp!'))
        
        // Force pairing code request immediately
        if (!XeonBotInc.authState.creds.registered) {
            await forcePairingCode()
        } else {
            // Already authenticated
            console.log(chalk.magenta(` `))
            console.log(chalk.yellow(`🌿 Connected to => ` + JSON.stringify(XeonBotInc.user, null, 2)))
            await delay(1999)
            console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botname} ]`)}\n\n`))
            console.log(chalk.cyan(`< ================================================== >`))
            console.log(chalk.magenta(`\n${global.themeemoji} YT CHANNEL: hacklyrics`))
            console.log(chalk.magenta(`${global.themeemoji} GITHUB: hacklyrics `))
            console.log(chalk.magenta(`${global.themeemoji} INSTAGRAM: @hacllyrics `))
            console.log(chalk.magenta(`${global.themeemoji} WA NUMBER: +977 9811216964`))
            console.log(chalk.magenta(`${global.themeemoji} CREDIT: youtube.com/@hacklyrics`))
            
            rl.close()
        }
    }
    
    if (connection === "close") {
        console.log(chalk.red('❌ Connection closed'))
        if (lastDisconnect && lastDisconnect.error) {
            console.log(chalk.red('Error details:', lastDisconnect.error.message))
            
            if (lastDisconnect.error.output && lastDisconnect.error.output.statusCode === 401) {
                console.log(chalk.red('❌ Authentication failed. Please check your credentials.'))
                try {
                    const sessionDir = './session'
                    if (fs.existsSync(sessionDir)) {
                        fs.rmSync(sessionDir, { recursive: true, force: true })
                        console.log(chalk.yellow('🗑️ Session files removed. Please restart the bot.'))
                    }
                } catch (err) {
                    console.log(chalk.red('Error removing session files:', err.message))
                }
                process.exit(1)
            }
            
            if (lastDisconnect.error.message.includes('rate-overlimit')) {
                console.log(chalk.yellow('⚠️ Rate limit exceeded. Waiting 60 seconds before reconnecting...'))
                await delay(60000)
            }
        }
        
        if (connectionAttempts < maxConnectionAttempts) {
            connectionAttempts++
            console.log(chalk.yellow(`🔄 Reconnecting... (Attempt ${connectionAttempts}/${maxConnectionAttempts})`))
            await delay(5000)
            startXeonBotInc()
        } else {
            console.log(chalk.red('❌ Max reconnection attempts reached. Please check your internet connection and restart the bot.'))
            process.exit(1)
        }
    }
})

// Force pairing code request after 10 seconds if not already requested
setTimeout(() => {
    if (!pairingCodeRequested && !XeonBotInc.authState.creds.registered) {
        console.log(chalk.yellow('⏰ Timeout reached, forcing pairing code request...'))
        forcePairingCode()
    }
}, 10000)

XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
    try {
        const mek = chatUpdate.messages[0]
        if (!mek.message) return
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        if (mek.key && mek.key.remoteJid === 'status@broadcast') return
        if (!XeonBotInc.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
        if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
        const m = smsg(XeonBotInc, mek, store)
        require("./XeonBug4")(XeonBotInc, m, chatUpdate, store)
    } catch (err) {
        console.log(err)
    }
})

//autostatus view
XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
    if (global.autoswview){
        mek = chatUpdate.messages[0]
        if (mek.key && mek.key.remoteJid === 'status@broadcast') {
            await XeonBotInc.readMessages([mek.key]) 
        }
    }
})

XeonBotInc.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {}
        return decode.user && decode.server && decode.user + '@' + decode.server || jid
    } else return jid
}

XeonBotInc.ev.on('contacts.update', update => {
    for (let contact of update) {
        let id = XeonBotInc.decodeJid(contact.id)
        if (store && store.contacts) store.contacts[id] = {
            id,
            name: contact.notify
        }
    }
})

XeonBotInc.getName = (jid, withoutContact = false) => {
    id = XeonBotInc.decodeJid(jid)
    withoutContact = XeonBotInc.withoutContact || withoutContact
    let v
    if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
        v = store.contacts[id] || {}
        if (!(v.name || v.subject)) v = XeonBotInc.groupMetadata(id) || {}
        resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
    })
    else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === XeonBotInc.decodeJid(XeonBotInc.user.id) ?
        XeonBotInc.user :
        (store.contacts[id] || {})
    return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

XeonBotInc.public = true

XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

XeonBotInc.ev.on('creds.update', saveCreds)
XeonBotInc.ev.on("messages.upsert",  () => { })

XeonBotInc.sendText = (jid, text, quoted = '', options) => XeonBotInc.sendMessage(jid, {
    text: text,
    ...options
}, {
    quoted,
    ...options
})
XeonBotInc.sendTextWithMentions = async (jid, text, quoted, options = {}) => XeonBotInc.sendMessage(jid, {
    text: text,
    mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
    ...options
}, {
    quoted
})
XeonBotInc.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options)
    } else {
        buffer = await imageToWebp(buff)
    }

    await XeonBotInc.sendMessage(jid, {
        sticker: {
            url: buffer
        },
        ...options
    }, {
        quoted
    })
    return buffer
}
XeonBotInc.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options)
    } else {
        buffer = await imageToWebp(buff)
    }

    await XeonBotInc.sendMessage(jid, {
        sticker: {
            url: buffer
        },
        ...options
    }, {
        quoted
    })
    return buffer
}
XeonBotInc.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    let type = await FileType.fromBuffer(buffer)
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
    await fs.writeFileSync(trueFileName, buffer)
    return trueFileName
}

XeonBotInc.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(message, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    return buffer
}
}
return startXeonBotInc()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})

process.on('uncaughtException', function (err) {
let e = String(err)
if (e.includes("conflict")) return
if (e.includes("Socket connection timeout")) return
if (e.includes("not-authorized")) return
if (e.includes("already-exists")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
console.log('Caught exception: ', err)
})
