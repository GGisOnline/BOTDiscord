const { Client, Interaction, ApplicationCommandOptionType,  AttachmentBuilder } = require("discord.js");
const Level = require('../../models/Level');
const canvacord = require ('canvacord');
const calculateLevelXP = require('../../utils/calculateLevelXP');

module.exports = {


    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     * 
     */

    name: 'level',
    description: "Shows your/someone's level.",
    options: [
        {
            name: 'target-user',
            description: "The user whose level you want to see.",
            type: ApplicationCommandOptionType.Mentionable,
        }
    ],



    callback: async(client, interaction) => {
        if(!interaction.inGuild()) {
            interaction.reply("You can only run this command inside TheQG.");
            return;
        }

        await interaction.deferReply();


        const mentionedUserID = interaction.options.get('target-user')?.value;
        const targetUserID = mentionedUserID || interaction.member.id;
        const targetUserOBJ = await interaction.guild.members.fetch(targetUserID);

        //console.log(targetUserOBJ);



        const fetchedLevel = await Level.findOne({
            userId: targetUserID,
            guildId: interaction.guild.id,
        }).exec();

        //console.log(fetchedLevel);


        if(!fetchedLevel){
            interaction.editReply(
                mentionedUserID 
                    ? `${targetUserOBJ.user.tag} doesn't have any levels yet. Try again when they chat a little more.` 
                    : "You don't have any levels yet. Chat a little more and try again."
            );
            return;
        }

        let allLevels = await Level.find({ guildId: interaction.guild.id }).select('-_id userId level xp');

        allLevels.sort((a,b) => {
            if(a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserID) + 1;

        const rank = new canvacord.Rank()
            .setAvatar(targetUserOBJ.user.displayAvatarURL({ size: 256 }))
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXP(fetchedLevel.level))
            .setStatus(targetUserOBJ.presence.status)
            .setProgressBar('#FFC300', 'COLOR')
            .setUsername(targetUserOBJ.nickname)

        const data = await rank.build();
        const attachment = new AttachmentBuilder(data);
        interaction.editReply({ files: [attachment] });



    }

}