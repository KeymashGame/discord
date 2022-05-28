const { MessageEmbed } = require("discord.js");
const player = require("../../__helpers/player");
const discord = require("../../__helpers/discord");

const { profileUrl } = require("../../config");

module.exports = {
  name: "roles",
  description:
    "Grants you roles according to your highest WPM score and ranked statistics",
  run: async (client, message, args, guild) => {
    try {
      if (!message.guild.me.permissions.has("MANAGE_ROLES"))
        throw new Error(
          "BOT requires `MANAGE ROLES` permissions in order to run this command."
        );

      const discordData = await discord("get", message.author.id);
      if (discordData === false)
        return message.channel.send("Please link your account via `k!link`.");

      const ranked = await player("ranked", "discord", discordData.playerId);
      const stats = await player("statistics", "discord", discordData.playerId);

      const x = stats.highestWPM;
      let playerRole;
      switch (true) {
        case x < 20:
          playerRole = message.guild.roles.cache.find(
            (r) => r.name === "0-19 WPM"
          );
          break;
        case x < 40:
          playerRole = message.guild.roles.cache.find(
            (r) => r.name === "20-39 WPM"
          );
          break;
        case x < 60:
          playerRole = message.guild.roles.cache.find(
            (r) => r.name === "40-59 WPM"
          );
          break;
        case x < 80:
          playerRole = message.guild.roles.cache.find(
            (r) => r.name === "60-79 WPM"
          );
          break;
        case x < 100:
          playerRole = message.guild.roles.cache.find(
            (r) => r.name === "80-99 WPM"
          );
          break;
        case x < 120:
          playerRole = message.guild.roles.cache.find(
            (r) => r.name === "100-119 WPM"
          );
          break;
        case x < 140:
          playerRole = message.guild.roles.cache.find(
            (r) => r.name === "120-139 WPM"
          );
          break;
        case x < 160:
          playerRole = message.guild.roles.cache.find(
            (r) => r.name === "140-159 WPM"
          );
          break;
        case x < 180:
          playerRole = message.guild.roles.cache.find(
            (r) => r.name === "160-179 WPM"
          );
          break;
        case x < 200:
          playerRole = message.guild.roles.cache.find(
            (r) => r.name === "180-199 WPM"
          );
          break;
        case x > 200:
          playerRole = message.guild.roles.cache.find(
            (r) => r.name === "200+ WPM"
          );
          break;
        default:
          playerRole = message.guild.roles.cache.find(
            (r) => r.name === "0-19 WPM"
          );
          break;
      }
      if (!playerRole)
        throw new Error(
          "Unfortunately, the role you've requested does not exist now, contact a Moderator to create it."
        );

      // rankedRole = message.guild.roles.cache.find(r => r.name === `S${ranked.seasonId} ${ranked.Rank.Rank}`);
      // if(rankedRole)
      //    await message.guild.members.cache.get(message.author.id).roles.add(rankedRole)

      await message.guild.members.cache
        .get(message.author.id)
        .roles.add(playerRole);

      const embed_error = new MessageEmbed()
        .setTitle("Success! 💫")
        .setColor("RANDOM")
        .setDescription(`Enjoy your new roles! 🤓`);

      return message.channel.send({ embed: embed_error });
    } catch (err) {
      const embed_error = new MessageEmbed()
        .setTitle("Operation failed")
        .setColor("RANDOM")
        .setDescription(`Error: ${err.message}`);

      return message.channel.send({ embed: embed_error });
    }
  }
};
