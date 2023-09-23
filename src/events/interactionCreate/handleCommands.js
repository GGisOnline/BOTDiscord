const { Devs, Server } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');



module.exports = async (client, interaction) => {

    if(!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try{
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName
        );

        if(!commandObject) return;


        if(commandObject.devOnly) {
            if(!Devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: 'Only developers and STAFF team are allowed to run this command.',
                    ephemeral: true,
                });
                return;
            }
        }

        if(commandObject.testOnly) {
            if(!(interaction.guild.id === Server)) {
                interaction.reply({
                    content: 'This command cannot be ran here.',
                    ephemeral: true,
                });
                return;
            }
        }


        if(commandObject.permissionRequired?.lenght) {
            for (const permission of commandObject.permissionRequired){
                if(!interaction.member.permission.has(permission)){
                    interaction.reply({
                        content: 'Not enough permisions.',
                        ephemeral: true,
                    });
                    break;
                }
            }
        }


        if(commandObject.botPermissions?.lenght) {
            for (const permission of commandObject.botPermissions){
                const bot = interaction.guild.members.me;

                if(!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "Sorry, I don't have enough permissions for that.",
                        ephemeral: true,
                    });
                    break;
                }
            }
        }


        await commandObject.callback(client, interaction);


        

    } catch (error) {
        console.log(`There was an error running this command: ${error}`);
    }

};