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

// Create simple store object since makeInMemoryStore is not available
const store = {
    contacts: {},
    chats: {},
    messages: {},
    bind: function(ev) {
        // Simple binding implementation
        console.log('Store bound to events');
    },
    loadMessage: function(jid, id) {
        return this.messages[jid + '_' + id] || null;
    }
}

async function startXeonBotInc() {
//------------------------------------------------------
let { version, isLatest } = await fetchLatestBaileysVersion()
console.log(chalk.cyan(`📱 Using Baileys version: ${version}`))

const { state, saveCreds } = await useMultiFileAuthState(`./session`)
const msgRetryCounterCache = new NodeCache() // for retry message, "waiting message"

console.log(chalk.green('🔐 Using QR Code Authentication'))
console.log(chalk.yellow('📱 Scan the QR code with your WhatsApp app'))

const XeonBotInc = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true, // Enable QR code display
    browser: [ "Chrome (Linux)", "", "" ], // Updated browser info
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
    },
    markOnlineOnConnect: true, // set false for offline
    generateHighQualityLinkPreview: true, // make high preview link
    getMessage: async (key) => {
        let jid = jidNormalizedUser(key.remoteJid)
        let msg = await store.loadMessage(jid, key.id)
        return msg?.message || ""
    },
    msgRetryCounterCache, // Resolve waiting messages
    defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
    connectTimeoutMs: 60_000,
    keepAliveIntervalMs: 30_000,
    version: [2, 2323, 4], // Force specific version for better compatibility
})

store.bind(XeonBotInc.ev)

let connectionAttempts = 0
const maxConnectionAttempts = 5

XeonBotInc.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    
    if (connection === 'connecting') {
        console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
    }
    
    if (connection === 'open') {
        console.log(chalk.green('✅ Connected to WhatsApp!'))
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
    }
    
    if (connection === "close") {
        console.log(chalk.red('❌ Connection closed'))
        if (lastDisconnect && lastDisconnect.error) {
            console.log(chalk.red('Error details:', lastDisconnect.error.message))
            
            // Handle specific error cases
            if (lastDisconnect.error.output && lastDisconnect.error.output.statusCode === 401) {
                console.log(chalk.red('❌ Authentication failed. Please check your credentials.'))
                // Remove session files to force re-authentication
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
        
        // Reconnection logic with attempt limit
        if (connectionAttempts < maxConnectionAttempts) {
            connectionAttempts++
            console.log(chalk.yellow(`🔄 Reconnecting... (Attempt ${connectionAttempts}/${maxConnectionAttempts})`))
            await delay(5000) // Wait 5 seconds before reconnecting
            startXeonBotInc()
        } else {
            console.log(chalk.red('❌ Max reconnection attempts reached. Please check your internet connection and restart the bot.'))
            process.exit(1)
        }
    }
})

XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
    //console.log(JSON.stringify(chatUpdate, undefined, 2))
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
        buffer = await writeExifVid(buff, options)
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
    // save to file
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
