const { QueryType } = require("discord-player");
const { joinVoiceChannel } = require('@discordjs/voice');
const { Client, Interaction, ApplicationCommandOptionType,  AttachmentBuilder, EmbedBuilder } = require("discord.js");

module.exports = {


    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     * 
     */

    name: 'play',
    description: "Plays the song you want.",
    options: [
        {
            name: 'title',
            description: "Searches the song via the title given.",
            required: false,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'url',
            description: 'Searches the precise song via the URL given.',
            required:false,
            type: ApplicationCommandOptionType.String,
        },
    ],



    callback: async(client, interaction) => {

        const title = interaction.options.get('title')?.value || interaction.options.get('url')?.value;
        console.log(title);
        console.log(title.startsWith('https'));

        if(!interaction.member.voice.channel) {
            await interaction.reply("You must be connected to a voice channel to use this command.");
            return;
        }

        console.log('pass1');

        const queue = await client.player.nodes.create(interaction.guild);

        console.log('pass2');

        if(!queue.connection) await queue.connect(interaction.member.voice.channel);

        console.log('pass3');

        let embed = new EmbedBuilder();

        console.log('pass4');
        
        if(!title){
            await interaction.reply("You must give a correct title/link to play a song !");
            return;
        }

        console.log('pass5');

        if(title.startsWith('https')){

            let url = interaction.options.get('url').value;

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            });

            if(result.tracks.lenght === 0){
                await interaction.reply("No results found");
                return;
            }

            const song = result.tracks[0];
            await queue.addTrack(song);

            embed
                .setDescription(`Added to the queue.`)
                //.setThumbnail(song.thumbnail)
                //.setFooter({ text: `Duration: ${song.duration}` });

        } else {

            console.log('pass6');

            let url = interaction.options.get('title').value;

            console.log(url);

            console.log('pass7');

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            if(result.tracks.lenght === 0){
                await interaction.reply("No results found");
                return;
            }

            const song = result.tracks[0];
            await queue.addTrack(song);

            //**[${song.name}](${song.url})**
            embed
                .setDescription(`Added to the queue.`)
                //.setThumbnail(song.thumbnail)
                //.setFooter({ text: `Duration: ${song.duration}` });

            console.log('pass8');

        }

        if(!queue.playing) await queue.play();

        /*
        await interaction.reply({
            embeds: [embed]
        });
        */
    }

}