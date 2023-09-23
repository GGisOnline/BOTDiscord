const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans a member form the server !',
    //devOnly: true,
    //testOnly: Boolean,
    deleted:false,
    options: [
        {
            name: 'target-user',
            description: 'The user to ban',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'The reason for the ban',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        const TargetUser = interaction.options.getUser('target-user');
        const TargetUserDM = interaction.options.get('target-user').value;
        const DM = await interaction.guild.members.fetch(TargetUserDM);
        const TargetReason = interaction.options.get('reason')?.value || "No reason provided";


        await interaction.deferReply();


        const targetUserRolePosition = DM.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;


        if(DM.user.bot) {
            await interaction.editReply(`I can't timeout a BOT or myself !`);
            return;
        }

        if(targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't kick that user because they have the same/higher role than you.");
            return;
        }

        if(targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't kick that user because they have the same/higher role than me.");
            return;
        }

        try{

            await DM.send(`You have been banned from TheQG for the following reason : --**${TargetReason}**`);

            await DM.ban({ TargetReason });

            await interaction.editReply(`The user ${TargetUser} has been banned for the following reason : **${TargetReason}**.`);

        } catch (error) {

            console.log(`Sorry, there was an error when baning: ${error}.`);
        }

    },
}