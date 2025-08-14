// Simple test to check WhatsApp connection
require('./settings')
const chalk = require('chalk')
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")

async function testConnection() {
    try {
        console.log(chalk.cyan('🧪 Testing WhatsApp connection...'))
        
        // Get Baileys version
        let { version } = await fetchLatestBaileysVersion()
        console.log(chalk.green(`✅ Baileys version: ${version}`))
        
        // Setup session
        const { state } = await useMultiFileAuthState(`./session`)
        console.log(chalk.green('✅ Session setup completed'))
        
        // Create WhatsApp socket
        const pino = require('pino')
        const { makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')
        
        const XeonBotInc = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: [ "Chrome (Linux)", "", "" ],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            connectTimeoutMs: 30_000,
            keepAliveIntervalMs: 15_000,
        })
        
        console.log(chalk.green('✅ WhatsApp socket created'))
        
        // Connection event handler
        XeonBotInc.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update
            
            console.log(chalk.blue(`🔗 Connection update: ${connection}`))
            
            if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
            }
            
            if (connection === 'open') {
                console.log(chalk.green('✅ SUCCESS! Connected to WhatsApp!'))
                console.log(chalk.yellow('🌿 User info:', JSON.stringify(XeonBotInc.user, null, 2)))
                
                if (!XeonBotInc.authState.creds.registered) {
                    console.log(chalk.cyan('📱 Bot needs authentication - pairing code required'))
                } else {
                    console.log(chalk.green('🔐 Bot is already authenticated!'))
                }
                
                // Exit after successful test
                setTimeout(() => {
                    console.log(chalk.yellow('✅ Test completed successfully!'))
                    process.exit(0)
                }, 3000)
            }
            
            if (connection === "close") {
                console.log(chalk.red('❌ Connection closed'))
                if (lastDisconnect && lastDisconnect.error) {
                    console.log(chalk.red('Error:', lastDisconnect.error.message))
                }
                process.exit(1)
            }
        })
        
        // Error handler
        XeonBotInc.ev.on('error', (err) => {
            console.log(chalk.red('❌ WhatsApp error:', err))
        })
        
        console.log(chalk.yellow('⏳ Waiting for connection...'))
        
        // Timeout after 30 seconds
        setTimeout(() => {
            console.log(chalk.red('⏰ Connection timeout - test failed'))
            process.exit(1)
        }, 30000)
        
    } catch (error) {
        console.log(chalk.red('❌ Test failed:', error.message))
        console.log(chalk.red('Stack:', error.stack))
        process.exit(1)
    }
}

// Start test
testConnection()

// Handle process termination
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Test interrupted'))
    process.exit(0)
})
