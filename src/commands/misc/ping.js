module.exports = {
    name: 'ping',
    description: 'Gives you the ping',
    devOnly: true,
    //testOnly: Boolean,
    deleted: false,
    //options: '',

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`Pong ! Client ${ping}ms | Websocket: ${client.ws.ping}ms`);
    },
}