const Discord               = require('discord.js');
const fetch                 = require('node-fetch');
const { api }               = require('../configs/Config.json');
const { URLSearchParams }   = require('url');
module.exports = {
    name: 'admin',
    description: 'Generates text/embeds for certain areas',
    async execute(message, args) {
        const allowedParams = ['bug-reports', 'text-bugs'];

        if (!args.length && !args[0])
            return message.channel.send("You must supply a parameter to search!");

        if (!allowedParams.includes(args[0]))
            return message.channel.send(`Invalid parameter: ${args[0]}!`);

        if (!message.member.hasPermission("MANAGE_GUILD"))
            return message.channel.send("You must have the Manage Server role in order to use this command");


        if (args[0] === 'bug-reports') {
            const channel = message.client.channels.cache.find(ch => ch.name === 'bug-reports');
            const embed = {
                "title": "Bug Repoorting Information",
                "description": "Please read all of the information and steps below as this will help your report get noticed and acknowledged.",
                "color": 15158332,
                "fields": [
                  {
                    "name": "Important",
                    "value": "Please read through our Trello in case your issue has already been reported. Any duplicated bug reports will be instantly deleted. \n\nhttps://trello.com/b/Rlx2qSvq/keymash\n\nIt is also mandatory to follow our Troubleshooting steps as 90% of issues reported are usually caused by cache.\n\nhttps://keyma.sh/about/troubleshooting"
                  },
                  {
                    "name": "Message Format",
                    "value": "Copy, Paste and Fill out the information below for us to further be able to target the bug and resolve the issue faster.\n```Where (URL): \nDescription: \nReproduce (1-10): \nScreenshots:```"
                  }
                ]
            };
            channel.send({ embed });
        }

        if (args[0] === 'text-bugs') {
            const channel = message.client.channels.cache.find(ch => ch.name === 'text-bugs');
            const embed = {
                "title": "Text Reporting Information",
                "description": "Please read all of the information and steps below as this will help your report get noticed, acknowledged and fixed.",
                "color": 15158332,
                "fields": [
                  {
                    "name": "Message Format",
                    "value": "Copy, Paste and Fill out the information below for us to further be able to target the bug and resolve the text faster.\n```Text: \nCorrected: \nSources: ```"
                  }
                ]
            };
            channel.send({ embed });
        }
    },
};