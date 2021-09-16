const { MessageEmbed } = require('discord.js');
const leaderboards = require('../../__helpers/leaderboards');

const { profileUrl } = require('../../config');

const formulateLeaderboards = (keys) => {
    let leaderboards = '```CoffeeScript\n'
    leaderboards += '\n'
    keys.forEach( (key, index) => {
        const nameString = `${key.player[0].name}#${key.player[0].discriminator}`
        const place = index + 1
        let placement = place.toString()
        switch (place) {
            case 1 : 
                placement = '🥇'
                break
            case 2 :
                placement = '🥈'
                break;
            case 3 : 
                placement = '🥉'
                break
            default : 
                placement = place.toString()
        }
        const placementSpace = 3 - placement.length
        const space = 30 - nameString.length
        leaderboards += `${placement}${" ".repeat(placementSpace)}${nameString}${" ".repeat(space)}${key.highestWPM} WPM\n`
    })
    leaderboards += '```'
    return leaderboards;
}
module.exports = {
    name: 'top',
    description: 'Shows TOP 10 keymashers with the fastest speed',
    run: async (client, message, args, guild) => {
        try {
            const data = await leaderboards('statistics')
            const leaderboardString = formulateLeaderboards(data.data)
            const userEmbed = new MessageEmbed()
                .setTitle('Top 10 fastest WPM!')
                .setColor('RANDOM')
                .setDescription(leaderboardString)
                .setFooter('These are definitely some fast mfs!')
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