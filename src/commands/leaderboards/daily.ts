import * as Discord from "discord.js";
import {
  fetchLeaderboards,
  formatLeaderboard
} from "../../functions/leaderboard";
import type { Keymash } from "../../types";

export default {
  name: "daily",
  description: "Shows the Keymash daily leaderboard",
  category: "Leaderboards",
  run: async (interaction, client) => {
    const leaderboard = await fetchLeaderboards("recent", client);

    const leaderboardFormatted = formatLeaderboard(leaderboard);

    const embed = client.embed({
      title: "Keymash Recent High Scores",
      description: leaderboardFormatted,
      color: Discord.Colors.Blue
    });

    interaction.reply({ embeds: [embed] });
  }
} as Keymash.Command;
