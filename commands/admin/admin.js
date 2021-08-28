const { MessageEmbed } = require('discord.js');

const { profileUrl } = require('../../config');

module.exports = {
    name: 'admin',
    description: 'Generates text/embeds for certain areas',
    run: async (client, message, args, guild) => {
        try {
            const allowedParams = ['bug-reports', 'text-bugs', 'welcome'];

            if (!args.length && !args[0])
                return message.channel.send("You must supply a parameter to search!");

            if (!allowedParams.includes(args[0]))
                return message.channel.send(`Invalid parameter: ${args[0]}!`);

            if (!message.member.hasPermission("MANAGE_GUILD"))
                return message.channel.send("You must have the Manage Server role in order to use this command");

            const channel = message.client.channels.cache.find(ch => ch.name === args[0]);
            let embed = null;
            switch (args[0].toLowerCase) {
                case 'bug-reports' :
                    embed = {
                        "title": "Bug Reporting Information",
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
                    return channel.send({ embed })
                    break;
                case 'text-bugs' :
                    embed = {
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
                    return channel.send({ embed })
                    break;
                case 'welcome' :
                    embed = {
                          "title": "KEYMA.SH - The future of competitive typing",
                          "description": "Welcome to the official Discord! Please take a moment to read below for some information and rules!",
                          "color": 16486972,
                          "thumbnail": {
                            "url": "https://i.imgur.com/wsuxxwC.png"
                          },
                          "fields": [
                            {
                              "name": "Play Now",
                              "value": "<https://keyma.sh/>"
                            },
                            {
                              "name": "Issue Tracker",
                              "value": "<https://github.com/Keyma-sh/game-tracker>"
                            },
                            {
                              "name": "Discord Invite",
                              "value": "<https://discord.gg/df4paUq>"
                            }
                          ]
                      };
                    channel.send({ embed })
                    embed = {
                          "title": "RULES",
                          "color": 16711710,
                          "thumbnail": {
                            "url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/twitter/282/closed-book_1f4d5.png"
                          },
                          "fields": [
                            {
                              "name": "Rule #1",
                              "value": "Follow all Community Guidelines and Terms of Service provided by Discord."
                            },
                            {
                              "name": "Rule #2",
                              "value": "Any form of bullying, harassment, hate speech, racism or offensive language is prohibited."
                            },
                            {
                              "name": "Rule #3",
                              "value": "Content that can be considered Not Safe for Work (NSFW) is NOT allowed under any circumstances."
                            },
                            {
                              "name": "Rule #4",
                              "value": "Political, Drugs, Gender or any topics that can be trivial and sensitive are not allowed."
                            },
                            {
                              "name": "Rule #5",
                              "value": "Shitposting must be kept to a bare minimum."
                            },
                            {
                              "name": "Rule #6",
                              "value": "Spamming is not allowed."
                            },
                            {
                              "name": "Rule #7",
                              "value": "If we feel that you are too toxic or controversial for our community we can and will ban you at any time."
                            }
                          ]
                      };
                    channel.send({ embed })
                    embed = {
                        "title": "CONTRIBUTE",
                        "color": 5301186,
                        "thumbnail": {
                          "url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/twitter/282/money-bag_1f4b0.png"
                        },
                        "fields": [
                          {
                            "name": "Want to add your favorite quote or text to Keyma.sh (we support multiple languages)?",
                            "value": "<https://keyma.sh/submit>"
                          },
                          {
                            "name": "Help us out in translating Keyma.sh in 15+ different languages",
                            "value": "<https://keyma.sh/translation>"
                          },
                          {
                            "name": "Directly support Keyma.sh (you get a badge!)",
                            "value": "<https://patreon.com/keymashgame>"
                          },
                        ]
                    };
                    return channel.send({ embed })
                    break;
            }
        } catch (err) {
            const embed_error = new MessageEmbed()
              .setTitle('Operation failed')
              .setColor('RANDOM')
              .setDescription(`Error: ${err.message}`)

            return message.channel.send({ embed: embed_error });
        }
    },
}