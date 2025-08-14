#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing WhatsApp session files...');

const sessionDir = path.join(__dirname, 'session');

try {
    if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
        console.log('✅ Session directory cleared successfully');
    } else {
        console.log('ℹ️ Session directory does not exist');
    }
    
    // Also clear any auth_session files
    const authSessionDir = path.join(__dirname, 'auth_session');
    if (fs.existsSync(authSessionDir)) {
        fs.rmSync(authSessionDir, { recursive: true, force: true });
        console.log('✅ Auth session directory cleared successfully');
    }
    
    console.log('🔄 You can now restart the bot for fresh authentication');
} catch (error) {
    console.error('❌ Error clearing session:', error.message);
}
