const { MessageEmbed } = require('discord.js');
const discord = require('../../__helpers/discord');

const { prefix } = require('../../config');

module.exports = {
    name: 'confirm',
    description: 'Confirms your Discord account with that of a keymash.io user',
    run: async (client, message, args, guild) => {
        try {
            if(!args[0]) {
                throw new Error(`Please include your confirmation code.\nIt should be in your keymash.io notifications.\nProper usage:\n\`\`\`\n${prefix}confirm 544776\`\`\``)
            }
            
            const data = await discord('confirm', message.author.id, '', args[0])

            const userEmbed = new MessageEmbed()
                .setColor('#FB923C')
                .setTitle('Success! 💫')
                .setDescription(`${data.success}`)
            return message.channel.send({ embed: userEmbed });
        } catch (err) {
            const embed_error = new MessageEmbed()
              .setTitle('Operation failed')
              .setColor('RANDOM')
              .setDescription(`Error: ${err.message}`)

            return message.channel.send({ embed: embed_error });
        }
    },
}