const { MessageEmbed } = require('discord.js');
const player = require('../../__helpers/player');
const discord = require('../../__helpers/discord');

const { profileUrl } = require('../../config');

module.exports = {
    name: 'user',
    description: 'Grabs information regarding a Keyma.sh Account',
    run: async (client, message, args, guild) => {
        try {
            let discordData
            if(!args[0]) {
                discordData = await discord('get', message.author.id)
                if(discordData === false)
                    return message.channel.send('Please include a username or link your account via k!link.')
            }

            const playerUsername = args[0] ? args[0].trim() : `${discordData.name}-${discordData.discriminator}`

            const data = await player('info', 'user', playerUsername)
            const ranked = await player('ranked', 'discord', data.playerId)
            const stats = await player('statistics', 'discord', data.playerId)

            const userEmbed = new MessageEmbed()
                .setColor('#FB923C')
                .setAuthor(`${data.name}#${data.discriminator}`, `${data.avatarSrc}`, `${profileUrl}/${data.name}-${data.discriminator}`)
                .setThumbnail(`https://raw.githubusercontent.com/Keyma-sh/media/main/ranks/${ranked.Rank.Rank.toLowerCase()}.png`)
                .setDescription(`${data.description}`)
                .addFields(
                    { name: 'Rank', value: `${ranked.Rank.Rank}`},
                    { name: 'Level', value: `${data.Level.Index}`},
                    { name: 'Skillrating', value: `${ranked.Rank.SR}`},
                    { name: 'Highest WPM', value: `${stats.highestWPM}`},
                    { name: 'Won', value: `${stats.matchesWon}`, inline: true},
                    { name: 'Lost', value: `${stats.matchesLost}`, inline: true},
                    { name: 'Quit', value: `${stats.matchesQuit}`, inline: true},
                    { name: 'Ranked Games', value: `${ranked.Rank.Games}`},
                    { name: 'Won', value: `${ranked.matchesWon}`, inline: true},
                    { name: 'Lost', value: `${ranked.matchesLost}`, inline: true},
                    { name: 'Quit', value: `${ranked.matchesQuit}`, inline: true},
                )
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