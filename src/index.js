//Others
require("dotenv").config();
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');



//Settings for BOT Initialization
const {Client, Events, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, PermissionBitField, Permissions, ActivityType} = require('discord.js');
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates]});
const { OpenAI } = require('openai');
const { Player } = require("discord-player");

//const IGNORE_PREFIX = something;
const CHANNELS = ['1151656726752395425'];
const openai = new OpenAI({
    apiKey: process.env.AITOKEN,
});



//------ BOT LOGIN -----
/*client.on(Events.ClientReady, (name) => {
    console.log(`${name.user.tag} is ready, made by GG.`);
    
    client.user.setActivity('The QG', { type: ActivityType.Watching });
    
});*/

(async () => {

    try{

        mongoose.set('strictQuery', false);

        await mongoose.connect(process.env.DB);
        console.log("Goliath is connected to DB");
        
        eventHandler(client);

        client.player = new Player(client, {
            ytdlOptions: {
                quality: "highestaudio",
                highWaterMark: 1<<25
            }
        })

        //TOKEN ZONE CONFIDENTIAL//
        client.login(process.env.TOKEN);

    } catch(error){
        console.log(`Error: ${error}`);

    }
})();


/*client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    //if(message.content.startsWith(IGNORE_PREFIX)) return;
    if(!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return;


    const response = await openai.chat.completions
        .create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    //name: 
                    role: 'system',
                    content: 'Chat GPT is a friendly CHATBOT.'
                },
                {
                    role: 'user',
                    content: message.content,
                }
            ]
        })
        .catch((error) => console.error('OpenAI Error: \n', error));
    
    message.reply(response.choices[0].message.content);


});*/
