import * as Discord from "discord.js";
import {
  fetchLeaderboards,
  formatLeaderboard
} from "../../functions/leaderboard";
import { Keymash } from "../../types";

export default {
  name: "top",
  description: "Shows the Keymash top leaderboard",
  category: "Leaderboards",
  run: async (interaction, client) => {
    const leaderboard = await fetchLeaderboards("statistics", client);

    const leaderboardFormatted = formatLeaderboard(leaderboard);

    const embed = client.embed({
      title: "Keymash Top High Scores",
      description: leaderboardFormatted,
      color: Discord.Colors.Blue
    });

    interaction.reply({ embeds: [embed] });
  }
} as Keymash.Command;
