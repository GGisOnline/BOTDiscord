module.exports = {
    name: 'hello',
    description: 'Says Hello',
    //devOnly: Boolean,
    //testOnly: Boolean,
    deleted: false,
    //options: '',

    callback: (client, interaction) => {
        interaction.reply(`Hello !`);
    },
}