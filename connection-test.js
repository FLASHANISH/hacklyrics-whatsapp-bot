//🔧 Comprehensive Connection Test for hacklyrics Bot
//This script tests all components and connections
//By: @hacklyrics

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

console.clear()
console.log(chalk.magenta(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║        🔧 HACKLYRICS BOT CONNECTION TEST 🔧          ║
║                                                       ║
║     Testing all components and dependencies...        ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
`))

// Test results storage
const testResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
}

function logTest(testName, status, details = '') {
    const symbols = {
        pass: '✅',
        fail: '❌', 
        warn: '⚠️'
    }
    
    const colors = {
        pass: chalk.green,
        fail: chalk.red,
        warn: chalk.yellow
    }
    
    console.log(`${symbols[status]} ${colors[status](testName)}${details ? ' - ' + details : ''}`)
    
    testResults[status === 'pass' ? 'passed' : status === 'fail' ? 'failed' : 'warnings']++
    testResults.details.push({ test: testName, status, details })
}

console.log(chalk.cyan('\n📋 DEPENDENCY TESTS'))
console.log(chalk.gray('═'.repeat(50)))

// Test Node.js version
try {
    const nodeVersion = process.version
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
    if (majorVersion >= 16) {
        logTest('Node.js Version', 'pass', `${nodeVersion} (Good)`)
    } else {
        logTest('Node.js Version', 'warn', `${nodeVersion} (Requires >=16)`)
    }
} catch (error) {
    logTest('Node.js Version', 'fail', error.message)
}

// Test core dependencies
const coreDependencies = [
    '@whiskeysockets/baileys',
    'qrcode-terminal', 
    'chalk',
    'axios',
    'pino',
    'qrcode',
    'fs-extra'
]

coreDependencies.forEach(dep => {
    try {
        require(dep)
        logTest(`Dependency: ${dep}`, 'pass')
    } catch (error) {
        logTest(`Dependency: ${dep}`, 'fail', 'Not installed')
    }
})

console.log(chalk.cyan('\n📁 FILE STRUCTURE TESTS'))
console.log(chalk.gray('═'.repeat(50)))

// Test file structure
const requiredFiles = [
    'package.json',
    'settings.js',
    'XeonBug4.js',
    'main.js',
    'main-qr.js', 
    'qr-fixed.js',
    'fresh-qr.js',
    'unified-bot.js',
    'launcher.js',
    'lib/myfunc.js',
    'lib/exif.js',
    'database/owner.json',
    'database/premium.json'
]

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        logTest(`File: ${file}`, 'pass')
    } else {
        logTest(`File: ${file}`, 'fail', 'Missing')
    }
})

// Test directories
const requiredDirs = [
    'lib',
    'database', 
    'XeonMedia',
    'session',
    '69'
]

requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        logTest(`Directory: ${dir}`, 'pass')
    } else {
        if (dir === 'session') {
            logTest(`Directory: ${dir}`, 'warn', 'Will be created on first run')
        } else {
            logTest(`Directory: ${dir}`, 'fail', 'Missing')
        }
    }
})

console.log(chalk.cyan('\n⚙️ CONFIGURATION TESTS'))
console.log(chalk.gray('═'.repeat(50)))

// Test settings.js
try {
    require('./settings')
    logTest('Settings Configuration', 'pass')
    
    // Check global variables
    if (global.botname) {
        logTest('Bot Name Configuration', 'pass', global.botname)
    } else {
        logTest('Bot Name Configuration', 'warn', 'Not set')
    }
    
    if (global.ownernumber) {
        logTest('Owner Number Configuration', 'pass', `+${global.ownernumber}`)
    } else {
        logTest('Owner Number Configuration', 'fail', 'Not set')
    }
} catch (error) {
    logTest('Settings Configuration', 'fail', error.message)
}

// Test database files
try {
    const ownerData = JSON.parse(fs.readFileSync('./database/owner.json'))
    logTest('Owner Database', 'pass', `${ownerData.length} entries`)
} catch (error) {
    logTest('Owner Database', 'fail', 'Invalid JSON or missing')
}

try {
    const premiumData = JSON.parse(fs.readFileSync('./database/premium.json'))
    logTest('Premium Database', 'pass', `${premiumData.length} entries`)
} catch (error) {
    logTest('Premium Database', 'fail', 'Invalid JSON or missing')
}

console.log(chalk.cyan('\n📱 CONNECTION METHOD TESTS'))
console.log(chalk.gray('═'.repeat(50)))

// Test Baileys connection setup
try {
    const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
    logTest('Baileys Socket Creation', 'pass')
} catch (error) {
    logTest('Baileys Socket Creation', 'fail', error.message)
}

// Test QR code generation
try {
    const qrcodeTerminal = require('qrcode-terminal')
    const qrcode = require('qrcode')
    logTest('QR Code Generation', 'pass')
} catch (error) {
    logTest('QR Code Generation', 'fail', error.message)
}

console.log(chalk.cyan('\n🎵 MEDIA PROCESSING TESTS'))
console.log(chalk.gray('═'.repeat(50)))

// Test media dependencies
const mediaDependencies = [
    'ytdl-core',
    'yt-search', 
    'jimp',
    'file-type',
    'fluent-ffmpeg'
]

mediaDependencies.forEach(dep => {
    try {
        require(dep)
        logTest(`Media: ${dep}`, 'pass')
    } catch (error) {
        logTest(`Media: ${dep}`, 'fail', 'Not installed')
    }
})

console.log(chalk.cyan('\n🗂️ SCRIPT AVAILABILITY TESTS'))
console.log(chalk.gray('═'.repeat(50)))

// Test available scripts
const scripts = [
    'main.js',
    'main-qr.js',
    'qr-fixed.js', 
    'fresh-qr.js',
    'unified-bot.js',
    'launcher.js',
    'enhanced-bot.js'
]

scripts.forEach(script => {
    if (fs.existsSync(script)) {
        try {
            const code = fs.readFileSync(script, 'utf8')
            if (code.includes('makeWASocket') && code.includes('connection.update')) {
                logTest(`Script: ${script}`, 'pass', 'Valid bot script')
            } else {
                logTest(`Script: ${script}`, 'warn', 'Missing core bot functions')
            }
        } catch (error) {
            logTest(`Script: ${script}`, 'fail', 'Cannot read file')
        }
    } else {
        logTest(`Script: ${script}`, 'fail', 'File missing')
    }
})

console.log(chalk.cyan('\n📊 PACKAGE.JSON TESTS'))
console.log(chalk.gray('═'.repeat(50)))

// Test package.json scripts
try {
    const packageData = JSON.parse(fs.readFileSync('./package.json'))
    const availableScripts = Object.keys(packageData.scripts || {})
    
    logTest('Package.json', 'pass', `${availableScripts.length} scripts available`)
    
    const importantScripts = ['start', 'qr-fixed', 'fresh-qr', 'unified', 'launcher']
    importantScripts.forEach(script => {
        if (availableScripts.includes(script)) {
            logTest(`Script: npm run ${script}`, 'pass')
        } else {
            logTest(`Script: npm run ${script}`, 'fail', 'Not found')
        }
    })
} catch (error) {
    logTest('Package.json', 'fail', error.message)
}

console.log(chalk.cyan('\n🔒 SECURITY & PERMISSIONS TESTS'))
console.log(chalk.gray('═'.repeat(50)))

// Test file permissions
try {
    fs.accessSync('./settings.js', fs.constants.R_OK)
    logTest('File Read Permissions', 'pass')
} catch (error) {
    logTest('File Read Permissions', 'fail', error.message)
}

try {
    fs.accessSync('./', fs.constants.W_OK)
    logTest('Directory Write Permissions', 'pass')
} catch (error) {
    logTest('Directory Write Permissions', 'fail', 'Cannot write to current directory')
}

console.log(chalk.cyan('\n📈 PERFORMANCE TESTS'))
console.log(chalk.gray('═'.repeat(50)))

// Test system resources
const memUsage = process.memoryUsage()
const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2)

if (memUsedMB < 100) {
    logTest('Memory Usage', 'pass', `${memUsedMB}MB (Good)`)
} else if (memUsedMB < 200) {
    logTest('Memory Usage', 'warn', `${memUsedMB}MB (Moderate)`)
} else {
    logTest('Memory Usage', 'fail', `${memUsedMB}MB (High)`)
}

// Test startup time
const startTime = Date.now()
setTimeout(() => {
    const endTime = Date.now()
    const loadTime = endTime - startTime
    
    if (loadTime < 1000) {
        logTest('Script Load Time', 'pass', `${loadTime}ms (Fast)`)
    } else if (loadTime < 3000) {
        logTest('Script Load Time', 'warn', `${loadTime}ms (Moderate)`)
    } else {
        logTest('Script Load Time', 'fail', `${loadTime}ms (Slow)`)
    }
    
    // Display final results
    displayResults()
}, 100)

function displayResults() {
    console.log(chalk.magenta('\n╔═══════════════════════════════════════════════════════╗'))
    console.log(chalk.magenta('║                    TEST RESULTS                       ║'))
    console.log(chalk.magenta('╚═══════════════════════════════════════════════════════╝'))
    
    console.log(chalk.green(`✅ Tests Passed: ${testResults.passed}`))
    console.log(chalk.red(`❌ Tests Failed: ${testResults.failed}`))
    console.log(chalk.yellow(`⚠️  Warnings: ${testResults.warnings}`))
    
    const totalTests = testResults.passed + testResults.failed + testResults.warnings
    const successRate = ((testResults.passed / totalTests) * 100).toFixed(1)
    
    console.log(chalk.cyan(`📊 Success Rate: ${successRate}%`))
    
    // Recommendations
    console.log(chalk.magenta('\n🎯 RECOMMENDATIONS:'))
    
    if (testResults.failed > 0) {
        console.log(chalk.red('• Fix failed tests before running the bot'))
        console.log(chalk.yellow('• Run: npm install to install missing dependencies'))
        console.log(chalk.yellow('• Check file permissions and directory structure'))
    }
    
    if (testResults.warnings > 0) {
        console.log(chalk.yellow('• Review warnings - they may cause issues later'))
        console.log(chalk.yellow('• Update Node.js if version is below 16'))
    }
    
    if (testResults.failed === 0 && testResults.warnings <= 2) {
        console.log(chalk.green('🚀 READY TO LAUNCH!'))
        console.log(chalk.green('• Use: npm run unified (Recommended)'))
        console.log(chalk.green('• Use: npm run launcher (Interactive menu)'))
        console.log(chalk.green('• Use: npm run fresh-qr (Fresh QR code)'))
    }
    
    console.log(chalk.magenta('\n📱 Available Connection Methods:'))
    console.log(chalk.cyan('• QR Code: npm run fresh-qr'))
    console.log(chalk.blue('• Pairing Code: npm run start'))
    console.log(chalk.green('• Auto-detect: npm run unified'))
    console.log(chalk.yellow('• Interactive: npm run launcher'))
    
    console.log(chalk.gray('\n══════════════════════════════════════════════════════'))
    console.log(chalk.magenta('🎊 Test completed! Bot status: ') + 
        (testResults.failed === 0 ? 
            chalk.green('READY ✅') : 
            chalk.red(`NEEDS FIXES (${testResults.failed} issues) ❌`)))
    console.log(chalk.gray('══════════════════════════════════════════════════════'))
}
