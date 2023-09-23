const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'timeout',
    description: 'Timeout a user.',
    //devOnly: true,
    //testOnly: Boolean,
    deleted:false,
    options: [
        {
            name: 'target-user',
            description: 'The user to timeout.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'duration',
            description: 'The duration for the timeout.',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'reason',
            description: 'The reason for the timeout.',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],

    callback: async (client, interaction) => {
        const TargetUser = interaction.options.get('target-user').value;
        const TargetDuration = interaction.options.get('duration').value;
        const TargetReason = interaction.options.get('reason')?.value || "No reason provided.";

        const TargetUserID = await interaction.guild.members.fetch(TargetUser);

        await interaction.deferReply();

        if(TargetUserID.user.bot) {
            await interaction.editReply(`I can't timeout a BOT or myself !`);
            return;
        }

        const msDuration = ms(TargetDuration);
        if(isNaN(msDuration)){
            interaction.editReply(`Please provide a valid timeout duration.`);
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.editReply("Timeout cannot be less than 5 seconds or more than 28 days.");
            return;
        }

        const targetUserRolePosition = TargetUserID.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;


        if(targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't kick that user because they have the same/higher role than you.");
            return;
        }

        if(targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't kick that user because they have the same/higher role than me.");
            return;
        }


        try{

            const { default: prettyMs } = await import('pretty-ms');

            if(TargetUserID.isCommunicationDisabled()){
                TargetUserID.timeout(msDuration, TargetReason);
                await interaction.editReply(`${TargetUserID}'s timeout has been updated to ${prettyMs(msDuration, { verbose: true })}`);

            }

            TargetUserID.timeout(msDuration, TargetReason);
            await interaction.editReply(`${TargetUserID} was timeout for: ${prettyMs(msDuration, { verbose: true })}. \nReason: ${TargetReason}`);

        } catch (error) {

            console.log(`There was an error when timing out : ${error}.`);
        }      
    },
}