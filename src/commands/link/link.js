const { MessageEmbed } = require('discord.js');
const discord = require('../../__helpers/discord');

const { prefix } = require('../../config');

module.exports = {
    name: 'link',
    description: 'Links your Discord account with that of a keymash.io user',
    run: async (client, message, args, guild) => {
        try {
            if(!args[0]) {
                throw new Error(`Please include a keymash.io username as an argument.\nProper usage:\n\`\`\`\n${prefix}link GNiK-8712\`\`\``)
            }
            
            let username = args.join(' ')
            
            const data = await discord('link', message.author.id, username);

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
