//base by hacklyrics(Xeon Bot Inc.)
//re-upload? recode? copy code? give credit ya :)
//YouTube: http://www.youtube.com/@hacklyrics
//Instagram: @hacklyrics
//Telegram: t.me/hacklyrics
//GitHub: @flashsanu
//WhatsApp: +9779811216964
//want more free bot scripts? subscribe to my youtube channel: https://youtube.com/@hacklyrics

const fs = require('fs')
const chalk = require('chalk')

//contact details
global.ownernomer = "9779811216964"
global.ownername = "hacklyrics😘"
global.ytname = "YT: hacklyrics"
global.socialm = "GitHub: flashsanu"
global.location = "nepal"

global.ownernumber = '9779811216964'  //creator number
global.ownername = 'hacklyrics' //owner name
global.botname = 'hacklyricsV4' //name of the bot

//sticker details
global.packname = 'Sticker By'
global.author = '🦄hacklyrics\n\nContact: +9779811216964'

//console view/theme
global.themeemoji = '🪀'
global.wm = "hacklyricsV4 Bot Inc."

//theme link
global.link = 'https://whatsapp.com/channel/0029VaAWr3x5PO0y7qLfcR26'

//custom prefix
global.prefa = ['','!','.','#','&']

//false=disable and true=enable
global.autoRecording = true //auto recording
global.autoTyping = false //auto typing
global.autorecordtype = false //auto typing + recording
global.autoread = false //auto read messages
global.autobio = true //auto update bio
global.anti92 = false //auto block +92 
global.autoswview = true //auto view status/story

//menu type 
//v1 is image menu, 
//v2 is link + image menu,
//v3 is video menu,
//v4 is call end menu
global.typemenu = 'v2'

//reply messages
global.mess = {
    done: 'Done !',
    prem: 'This feature can be used by hacklyricsor premium user only',
    admin: 'This feature can be used by hacklyricsor admin only',
    botAdmin: 'This feature can only be used when the bot is a group admin ',
    owner: 'This feature can be used by hacklyrics or owner only',
    group: 'This feature is only for groups',
    private: 'This feature is only for private chats',
    wait: 'In process... ',    
    error: 'Error!',
}

global.thumb = fs.readFileSync('./XeonMedia/thumb.jpg')

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update'${__filename}'`))
    delete require.cache[file]
    require(file)
})