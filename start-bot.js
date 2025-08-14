#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting hacklyrics WhatsApp Bot...');
console.log('📱 Make sure you have a stable internet connection');
console.log('🔐 The bot will use pairing code authentication');

// Check if session directory exists, if not create it
const sessionDir = path.join(__dirname, 'session');
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
    console.log('📁 Created session directory');
}

// Check if required files exist
const requiredFiles = [
    'main.js',
    'settings.js',
    'XeonBug4.js',
    'database/owner.json'
];

for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Missing required file: ${file}`);
        process.exit(1);
    }
}

console.log('✅ All required files found');

// Start the bot
function startBot() {
    const args = [path.join(__dirname, 'main.js'), ...process.argv.slice(2)];
    console.log('🔄 Launching bot with args:', args.join(' '));
    
    const botProcess = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    });

    botProcess.on('message', (data) => {
        if (data === 'reset') {
            console.log('🔄 Restarting Bot...');
            botProcess.kill();
            startBot();
        }
    });

    botProcess.on('exit', (code) => {
        console.log('❌ Bot process exited with code:', code);
        if (code === 0 || code === 1) {
            console.log('🔄 Restarting in 5 seconds...');
            setTimeout(() => startBot(), 5000);
        }
    });

    botProcess.on('error', (err) => {
        console.error('❌ Failed to start bot process:', err);
        process.exit(1);
    });

    // Handle process termination
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down bot...');
        botProcess.kill();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down bot...');
        botProcess.kill();
        process.exit(0);
    });
}

startBot();

node index.js
