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
        leaderboards += `${placement}${" ".repeat(placementSpace)}${nameString}${" ".repeat(space)}${key.wpm} WPM\n`
    })
    leaderboards += '```'
    return leaderboards;
}
module.exports = {
    name: 'daily',
    description: 'Shows recent high-scores of keyma.sh',
    run: async (client, message, args, guild) => {
        try {
            const data = await leaderboards('recent')
            const leaderboardString = formulateLeaderboards(data)
            const userEmbed = new MessageEmbed()
                .setTitle('Recent highscores of today!')
                .setColor('RANDOM')
                .setDescription(leaderboardString)
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