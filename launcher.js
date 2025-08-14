#!/usr/bin/env node

//Easy Launcher for hacklyrics WhatsApp Bot
//Choose your preferred connection method
//By: @hacklyrics

const chalk = require('chalk')
const readline = require('readline')
const { spawn } = require('child_process')
const fs = require('fs')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.clear()
console.log(chalk.cyan(`
╔════════════════════════════════════════════╗
║          🚀 hacklyrics Bot Launcher        ║
║                                            ║
║    Choose your preferred connection method ║
╚════════════════════════════════════════════╝
`))

console.log(chalk.yellow('Available Connection Methods:\n'))
console.log(chalk.green('1. 📱 Enhanced Bot with QR Code'))
console.log(chalk.blue('2. 🔐 Enhanced Bot with Pairing Code'))
console.log(chalk.magenta('3. 📱 Original QR Code Bot'))
console.log(chalk.cyan('4. 🔐 Original Pairing Code Bot'))
console.log(chalk.yellow('5. 🧪 Test Connection'))
console.log(chalk.red('6. 🗑️ Clear Session & Restart'))
console.log(chalk.white('0. ❌ Exit'))

const question = (text) => new Promise((resolve) => rl.question(text, resolve))

async function main() {
    try {
        const choice = await question(chalk.bgBlack(chalk.greenBright('\nEnter your choice (0-6): ')))
        
        let command, args = []
        
        switch (choice.trim()) {
            case '1':
                console.log(chalk.cyan('\n🚀 Starting Enhanced Bot with QR Code...'))
                command = 'node'
                args = ['enhanced-bot.js', '--qr']
                break
                
            case '2':
                console.log(chalk.cyan('\n🚀 Starting Enhanced Bot with Pairing Code...'))
                command = 'node'
                args = ['enhanced-bot.js', '--pairing-code']
                break
                
            case '3':
                console.log(chalk.cyan('\n🚀 Starting Original QR Code Bot...'))
                command = 'node'
                args = ['main-qr.js']
                break
                
            case '4':
                console.log(chalk.cyan('\n🚀 Starting Original Pairing Code Bot...'))
                command = 'node'
                args = ['main.js']
                break
                
            case '5':
                console.log(chalk.cyan('\n🧪 Testing Connection...'))
                command = 'node'
                args = ['test-connection.js']
                break
                
            case '6':
                console.log(chalk.yellow('\n🗑️ Clearing session files...'))
                try {
                    if (fs.existsSync('./session')) {
                        fs.rmSync('./session', { recursive: true, force: true })
                        console.log(chalk.green('✅ Session cleared successfully!'))
                    } else {
                        console.log(chalk.yellow('ℹ️ No session files found'))
                    }
                    console.log(chalk.cyan('\n🔄 Restarting launcher...'))
                    setTimeout(() => {
                        main()
                    }, 2000)
                    return
                } catch (error) {
                    console.log(chalk.red('❌ Error clearing session:', error.message))
                    process.exit(1)
                }
                break
                
            case '0':
                console.log(chalk.yellow('\n👋 Goodbye!'))
                rl.close()
                process.exit(0)
                break
                
            default:
                console.log(chalk.red('\n❌ Invalid choice! Please try again.'))
                setTimeout(() => {
                    main()
                }, 2000)
                return
        }
        
        rl.close()
        
        // Launch the selected bot
        const child = spawn(command, args, {
            stdio: 'inherit',
            shell: true
        })
        
        child.on('error', (error) => {
            console.log(chalk.red('❌ Error starting bot:', error.message))
            process.exit(1)
        })
        
        child.on('close', (code) => {
            if (code !== 0) {
                console.log(chalk.red(`\n❌ Bot exited with code ${code}`))
            } else {
                console.log(chalk.yellow('\n✅ Bot stopped gracefully'))
            }
            process.exit(code)
        })
        
        // Handle Ctrl+C
        process.on('SIGINT', () => {
            console.log(chalk.yellow('\n🛑 Stopping bot...'))
            child.kill('SIGINT')
        })
        
    } catch (error) {
        console.log(chalk.red('❌ Launcher error:', error.message))
        rl.close()
        process.exit(1)
    }
}

// Display system info
console.log(chalk.gray(`
📊 System Information:
• Node.js: ${process.version}
• Platform: ${process.platform}
• Architecture: ${process.arch}
• Working Directory: ${process.cwd()}
`))

// Check if required files exist
const requiredFiles = [
    'enhanced-bot.js',
    'main-qr.js', 
    'main.js',
    'test-connection.js',
    'package.json',
    'settings.js'
]

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file))

if (missingFiles.length > 0) {
    console.log(chalk.red('❌ Missing required files:'))
    missingFiles.forEach(file => console.log(chalk.red(`   • ${file}`)))
    console.log(chalk.yellow('\n💡 Please ensure all bot files are present'))
    process.exit(1)
}

console.log(chalk.green('✅ All required files found!\n'))

// Start the main menu
main()
