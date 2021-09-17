const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays the current available commands',
    run: async (client, message, args, guild) => {
        try {
            const commandString = client.commands.map((c) => `\`${c.name}\`\n👉 ${c.description}.\n\n`).join();

            const helpEmbed = new MessageEmbed()
                .setColor('#FB923C')
                .setTitle('Available commands:')
                .setDescription(commandString)
            return message.channel.send({ embed: helpEmbed });
        } catch (err) {
            const embed_error = new MessageEmbed()
              .setTitle('Operation failed')
              .setColor('RANDOM')
              .setDescription(`Error: ${err.message}`)

            return message.channel.send({ embed: embed_error });
        }
    },
}