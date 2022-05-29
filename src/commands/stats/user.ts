import { getDiscordData } from "../../functions/discord";
import { getPlayerFromID, getPlayerFromUsername } from "../../functions/player";
import { Keymash } from "../../types";

export default {
  name: "user",
  description: "Shows your stats",
  category: "Stats",
  options: [
    {
      name: "username",
      description: "The username of the player to show stats for",
      type: "STRING",
      required: false
    }
  ],
  run: async (interaction, client) => {
    await interaction.deferReply();

    const username =
      interaction.options.getString("username", false)?.replace("#", "-") ??
      undefined;

    const discordData =
      username === undefined
        ? await getDiscordData(client, interaction.user.id)
        : undefined;

    if (username === undefined && discordData === undefined) {
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

    const info =
      username === undefined
        ? await getPlayerFromID(client, discordData!.playerId, "info")
        : await getPlayerFromUsername(client, username, "info");

    const [ranked, stats] = await Promise.all([
      getPlayerFromID(client, info.playerId, "ranked"),
      getPlayerFromID(client, info.playerId, "statistics")
    ]);

    const embed = client.embed({
      description: info.description,
      color: 0xfb923c,
      author: {
        name: `${info.name}#${info.discriminator}`,
        icon_url: info.avatarSrc,
        url: `${client.clientOptions.urls.profile}/${info.name}-${info.discriminator}`
      },
      fields: [
        { name: "Level", value: `${info.Level.Index}` },
        { name: "Career Rating", value: `${stats.cr?.toLocaleString() ?? "No career rating"} CR` },
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
        },
        { name: "Ranked Level", value: `${ranked?.Rank?.Rank || "Unrated"}` },
        {
          name: "Ranked Games",
          value: `${(ranked?.Rank?.Games || 0).toLocaleString()}`
        }
      ]
    });

    interaction.followUp({
      embeds: [embed]
    });
  }
} as Keymash.Command;
