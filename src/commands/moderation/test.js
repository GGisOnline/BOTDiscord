const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'test',
    description: 'Simple test.',
    devOnly: true,
    //testOnly: Boolean,
    deleted: false,
    //options: '',
    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    },
}