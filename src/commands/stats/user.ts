import * as Discord from "discord.js";
import { getDiscordData } from "../../functions/discord";
import { getPlayerFromID, getPlayerFromUsername } from "../../functions/player";
import type { Keymash } from "../../types";

export default {
  name: "user",
  description: "Shows your stats",
  category: "Stats",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "username",
      description: "The username of the player to show stats for",
      type: Discord.ApplicationCommandOptionType.String,
      required: false
    }
  ],
  run: async (interaction, client) => {
    await interaction.deferReply();

    const username =
      interaction.options.getString("username", false)?.replace("#", "-") ??
      undefined;

    async function getInfo(): Promise<Keymash.PlayerInfoData | undefined> {
      if (username === undefined) {
        const discordData = await getDiscordData(client, interaction.user.id);

        if (discordData === undefined) {
          interaction.followUp({
            embeds: [
              client.embed({
                title: "Operation Failed",
                description: "Please link your account with /link.",
                color: 0xff0000
              })
            ]
          });

          return;
        }

        const info = await getPlayerFromID(
          client,
          discordData.playerId,
          "info"
        );

        if (info === undefined) {
          interaction.followUp({
            embeds: [
              client.embed({
                title: "Operation Failed",
                description: "Could not find your account.",
                color: 0xff0000
              })
            ]
          });

          return;
        }

        return info;
      } else {
        const info = await getPlayerFromUsername(client, username, "info");

        if (info === undefined) {
          interaction.followUp({
            embeds: [
              client.embed({
                title: "Operation Failed",
                description: "Could not find this player.",
                color: 0xff0000
              })
            ]
          });

          return;
        }

        return info;
      }
    }

    const info = await getInfo();

    if (info === undefined) {
      return;
    }

    const stats = await getPlayerFromID(client, info.playerId, "statistics");

    if (stats === undefined) {
      interaction.followUp({
        embeds: [
          client.embed({
            title: "Operation Failed",
            description: "Could not find stats.",
            color: 0xff0000
          })
        ]
      });

      return;
    }

    const embed = client.embed({
      description: info.description,
      color: 0xfb923c,
      author: {
        name: `${info.name}#${info.discriminator}`,
        iconURL: info.avatarSrc,
        url: encodeURI(
          `${client.clientOptions.urls.profile}/${info.name}-${info.discriminator}`
        )
      },
      fields: [
        { name: "Level", value: `${info.Level.Index}` },
        {
          name: "Career Rating",
          value: `${stats.cr?.toLocaleString() ?? "No career rating"} CR`
        },
        { name: "Highest WPM", value: `${stats.highestWPM}` },
        {
          name: "Won",
          value: `${stats.matchesWon.toLocaleString()}`,
          inline: true
        },
        {
          name: "Lost",
          value: `${stats.matchesLost.toLocaleString()}`,
          inline: true
        },
        {
          name: "Quit",
          value: `${stats.matchesQuit.toLocaleString()}`,
          inline: true
        }
      ]
    });

    interaction.followUp({
      embeds: [embed]
    });
  }
} as Keymash.Command<Discord.ApplicationCommandType.ChatInput>;
