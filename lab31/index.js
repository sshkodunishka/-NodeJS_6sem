const TelegramApi = require('node-telegram-bot-api')

const token = '5866320623:AAE4XNS2zhi-zV1ZxxLCPTbazc7kaHaz_GE'

const bot = new TelegramApi(token, { polling: true })

bot.on('message', async msg => {
    console.log(msg)
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
        // await UserModel.create({ chatId })
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/4d9/7a0/4d97a02b-732c-4ab0-a2db-619dd9bcc7b6/4.webp')
        return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот ${msg.chat.username}`);
    } else {
        await bot.sendMessage(chatId, `echo: ${text}`)
    }
})
