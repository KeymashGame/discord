const Discord   = require('discord.js');
const axios     = require('axios');
const { api }   = require('../configs/Config.json');

module.exports = {
    name: 'user',
    description: 'Grabs information regarding a Keyma.sh Account.',
    async execute(message, args) {
        if (!args.length && !args[0])
            return message.channel.send("You must supply a username to search!");

        if (!args[0].includes('-') )
            return message.channel.send("Improperly formatted username (ie: GNiK-8712 or GNiK#8712)");

        const result = await axios.get(`${api.user}`, {
            params : {
                name : args[0].trim(),
                view : 'profile',
                limit : 1,
                world : 0
            }
        })
        const results = result.data
        console.log(results)
        if (results && results[0]) {
            const userEmbed = new Discord.MessageEmbed()
                .setColor('#FB923C')
                .setAuthor(`${args[0].trim().replace('-', '#')}`, `${results[0].userAvatar}`, `${api.profile}/${args[0].trim()}`)
                .setThumbnail(`${api.rank}/${results[0].Competitive.Rank.toLowerCase()}.png`)
                .setDescription(results[0].userDescription)
                .addFields(
                    { name: 'Rank', value: `${results[0].Competitive.Rank}`},
                    { name: 'Level', value: `${(results[0].Level.Index || 1)}`},
                    { name: 'Skill Points', value: `${results[0].Competitive.SR}`},
                    { name: 'Highest WPM', value: `${results[0].maxWPM.toFixed(2)}`},
                    { name: 'Casual Games', value: `${results[0].CasualMatchesTotal}`},
                    { name: 'Won', value: `${results[0].CasualMatchesWon}`, inline: true},
                    { name: 'Lost', value: `${results[0].CasualMatchesLost}`, inline: true},
                    { name: 'Quit', value: `${results[0].CasualMatchesQuit}`, inline: true},
                    { name: 'Ranked Games', value: `${results[0].Competitive.Games}`},
                    { name: 'Won', value: `${results[0].userRankedMatchesWon}`, inline: true},
                    { name: 'Lost', value: `${results[0].userRankedMatchesLost}`, inline: true},
                    { name: 'Quit', value: `${results[0].userRankedMatchesQuit}`, inline: true},
                    
                )

            message.channel.send(userEmbed);
        } else
            return message.channel.send('Unable to find user, please try again!');
    },
};