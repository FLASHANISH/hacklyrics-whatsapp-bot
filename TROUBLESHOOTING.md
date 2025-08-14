# 🔧 Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. Pairing Code Not Generating

**Problem**: The bot connects to WhatsApp but doesn't generate a pairing code.

**Solutions**:
1. **Clear session files**:
   ```bash
   npm run clear-session
   ```

2. **Try QR code authentication instead**:
   ```bash
   npm run start-qr
   ```

3. **Check phone number format**:
   - Must include country code (e.g., +9779811216964)
   - No spaces or special characters
   - Must be a valid WhatsApp number

### 2. Connection Issues

**Problem**: Bot can't connect to WhatsApp servers.

**Solutions**:
1. **Check internet connection**
2. **Clear session and restart**:
   ```bash
   npm run clear-session
   npm start
   ```

3. **Use different authentication method**:
   - If pairing code fails, try QR code
   - If QR code fails, try pairing code

### 3. Rate Limiting

**Problem**: "Rate limit exceeded" errors.

**Solutions**:
1. **Wait 10-15 minutes** before retrying
2. **Use different phone number**
3. **Clear all session data**

## 🔄 Alternative Solutions

### Method 1: Pairing Code (Default)
```bash
npm start
```

### Method 2: QR Code
```bash
npm run start-qr
```

## 📱 WhatsApp Setup Requirements

1. **Phone must be connected to internet**
2. **WhatsApp must be active**
3. **No other WhatsApp Web sessions**
4. **Stable internet connection**

## 🚫 What NOT to Do

- ❌ Don't use multiple instances with same number
- ❌ Don't restart immediately after errors
- ❌ Don't share session files
- ❌ Don't use VPN (can cause connection issues)

## 🆘 Still Having Issues?

1. **Check the logs** for specific error messages
2. **Try different authentication method**
3. **Use a different phone number**
4. **Wait 24 hours** before retrying

## 📞 Getting Help

- **YouTube**: [@hacklyrics](http://www.youtube.com/@hacklyrics)
- **WhatsApp**: +9779811216964

---

**Remember**: Most connection issues can be resolved by clearing session files and trying again with a fresh start.
