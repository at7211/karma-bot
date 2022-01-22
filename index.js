require('dotenv').config()
const axios = require('axios');
const { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const config = require('./config.json')

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { BOT_TOKEN } = process.env

const { prefix, name } = config

bot.login(BOT_TOKEN)

bot.once('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`) // eslint-disable-line no-console
})

bot.on('interactionCreate', interaction => {
  console.log('click')
});

bot.on('message', async message => {
    /** bot-test channel  */
    if (message.channelId !== '924857245127299093') return;

    if (message.content === 'verify') {
        message.reply('已私');

        await axios.get('https://public-api.solscan.io/account/tokens?account=2J3PW1rSoHjmujLok86vdSVBDUTYeKgvf8WntT7MtpsZ')
            .then(res => console.log(res.data))
            .then(_ => message.author.send('驗證成功ㄌ'))
            .catch(_ => message.author.send('驗證失敗ㄌ'))
    }

    // ping command without a prefix (exact match)
    if (message.content === 'ping') {
        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('primary')
              .setLabel('Primary')
              .setStyle('PRIMARY'),
          );

        message.reply({ content: 'Pong!', components: [row] });

        return
    }

    // ignore all other messages without our prefix
    if (!message.content.startsWith(prefix)) return

    // let the bot introduce itself (exact match)
    if (message.content === `${prefix}who`) {
        message.channel.send(`My name is ${name} and I was created to serve!`)
        return
    }

    // user info, either call with valid user name or default to info about message author
    if (message.content.startsWith(`${prefix}whois`)) {
        // if the message contains any mentions, pick the first as the target
        if (message.mentions.users.size) {
            const taggedUser = message.mentions.users.first()
            message.channel.send(
                `User Info: ${
                    taggedUser.username
                } (account created: ${taggedUser.createdAt.toUTCString()})`,
            )
        } else {
            // default to sender if no user is mentioned
            const { author } = message
            message.reply(
                `User Self Info: ${
                    author.username
                } (account created: ${author.createdAt.toUTCString()})`,
            )
        }
    }
})
