const Discord   = require('discord.js');
const fetch     = require('node-fetch');
const { api }   = require('../configs/Config.json');

module.exports = {
    name: 'list-tournaments',
    description: 'Lists ongoing tournaments',
    async execute(message, args) {
        const results = await fetch(`${api.tournament}?limit=10`).then((response) => response.json());
        const localeStrings = {
            'es-MX': 'Spanish',
            'de-DE': 'German',
            'fr-FR': 'French',
            'en': 'English',
        };

        if (results && results.data) {
            const userEmbed = new Discord.MessageEmbed()
                .setColor('#FB923C')
                .setTitle('Ongoing Tournaments')

            results.data.filter(({ tournamentStatusCode }) => tournamentStatusCode == 1).forEach((result) => {
                userEmbed.addFields(
                    { name: 'Name', value: result.tournamentName, inline: true},
                    { name: 'Language', value: localeStrings[result.tournamentLocale], inline: true},
                    { name: 'Tournament Ends', value: result.tournamentEndRelative, inline: true},
                )
            });

            message.channel.send(userEmbed);
        } else {
            return message.channel.send('There are no tournaments being ran at the moment.');
        }
    },
};