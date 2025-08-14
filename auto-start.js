//Auto-start script for hacklyrics bot
//Automatically selects QR code method and starts
//By: @hacklyrics

const { spawn } = require('child_process')
const chalk = require('chalk')

console.log(chalk.cyan(`
🚀 Starting hacklyrics Bot with QR Code...
Please wait while the bot initializes...
`))

// Start the complete bot
const bot = spawn('node', ['complete-bot.js'], {
    stdio: ['pipe', 'inherit', 'inherit'],
    shell: true
})

// Auto-select QR code method (option 1)
setTimeout(() => {
    bot.stdin.write('1\n')
}, 2000)

bot.on('close', (code) => {
    console.log(chalk.yellow(`\nBot process exited with code ${code}`))
    if (code !== 0) {
        console.log(chalk.red('There was an error. Try running manually:'))
        console.log(chalk.yellow('npm run working'))
    }
})

bot.on('error', (error) => {
    console.log(chalk.red('Error starting bot:', error.message))
})

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Stopping bot...'))
    bot.kill('SIGINT')
    process.exit(0)
})
