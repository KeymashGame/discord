import fetch from "node-fetch";
import { Client } from "../structures/client";
import { Keymash } from "../types";

const medals = ["🥇", "🥈", "🥉"];

export async function fetchLeaderboards(
  type: "recent" | "statistics",
  client: Client<true>
): Promise<Keymash.LeaderboardEntry[]> {
  const params = new URLSearchParams({
    modeId: "1",
    filter: "highestWPM",
    startNum: "0",
    limit: "10"
  }).toString();

  const response = await fetch(
    `${client.clientOptions.urls.endpoint}/leaderboards/${type}?${decodeURI(
      params.toString()
    )}`
  );

  console.log(response.statusText);

  const json = await response.json();

  return json;
}

export function formatLeaderboard(
  leaderboard: Keymash.LeaderboardEntry[]
): string {
  const leaderboardFormatted = leaderboard.map((entry, index) => {
    const player = entry.player[0];

    const place = medals[index] ?? index + 1;

    if (player === undefined) {
      return `${place} - Unknown`;
    }

    const wpmString = `${entry.wpm} wpm`;

    const str = `${place} ${player.name}#${player.discriminator}`;

    const spaces = 40 - str.length - wpmString.length - 1;

    return str + `${" ".repeat(spaces)}${wpmString}`;
  });

  return `\`\`\`CoffeeScript\n${leaderboardFormatted.join("\n")}\n\`\`\``;
}
