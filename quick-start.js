//Quick Start Script for hacklyrics Bot - Ultra Fast Launch
//By: @hacklyrics

const { spawn } = require('child_process')
const chalk = require('chalk')

console.clear()
console.log(chalk.magenta(`
🚀 QUICK START - hacklyrics Bot

Starting the most stable version...
`))

// Auto-detect best method based on existing session
const fs = require('fs')
let script = 'qr-fixed.js'  // Default

if (fs.existsSync('./session') && fs.readdirSync('./session').length > 0) {
    script = 'qr-fixed.js'  // Use existing session
    console.log(chalk.green('📱 Existing session detected - Using QR Fixed'))
} else {
    script = 'fresh-qr.js'  // Fresh start
    console.log(chalk.yellow('🆕 No session found - Using Fresh QR'))
}

console.log(chalk.cyan(`🚀 Launching: ${script}\n`))

const child = spawn('node', [script], {
    stdio: 'inherit',
    shell: true
})

child.on('error', (error) => {
    console.log(chalk.red('❌ Launch error:', error.message))
    process.exit(1)
})

child.on('close', (code) => {
    if (code !== 0) {
        console.log(chalk.red(`\n❌ Bot stopped with code ${code}`))
    }
    process.exit(code)
})

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Stopping bot...'))
    child.kill('SIGINT')
})
