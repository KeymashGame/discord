import fetch from "node-fetch";
import { Client } from "../structures/client";
import { Keymash } from "../types";

const medals = ["🥇", "🥈", "🥉"];

export async function fetchLeaderboards(
  type: "recent",
  client: Client<true>
): Promise<Keymash.RecentLeaderboardEntry[]>;
export async function fetchLeaderboards(
  type: "statistics",
  client: Client<true>
): Promise<Keymash.TopLeaderboard>;
export async function fetchLeaderboards(
  type: "recent" | "statistics",
  client: Client<true>
): Promise<Keymash.RecentLeaderboardEntry[] | Keymash.TopLeaderboard> {
  const params = new URLSearchParams({
    modeId: "1",
    filter: "highestWPM",
    startNum: "0",
    limit: "10"
  });

  const response = await fetch(
    `${client.clientOptions.urls.endpoint}/leaderboards/${type}?${decodeURI(
      params.toString()
    )}`
  );

  const json = await response.json();

  return json;
}

export function formatLeaderboard(
  leaderboard: Keymash.RecentLeaderboardEntry[] | Keymash.TopLeaderboard
): string {
  const leaderboardData = isTopLeaderboard(leaderboard)
    ? leaderboard.data
    : leaderboard;

  const leaderboardFormatted = leaderboardData.map((entry, index) => {
    const player = entry.player[0];

    const place = medals[index] ?? index + 1;

    if (player === undefined) {
      return `${place} - Unknown`;
    }

    const wpmString = `${
      isTopLeaderboardEntry(entry) ? entry.highestWPM : entry.wpm
    } wpm`;

    const str = `${place} ${player.name}#${player.discriminator}`;

    const spaces = 40 - str.length - wpmString.length - 1;

    return str + `${" ".repeat(spaces)}${wpmString}`;
  });

  return `\`\`\`CoffeeScript\n${leaderboardFormatted.join("\n")}\n\`\`\``;
}

export function isTopLeaderboard(
  leaderboard: Keymash.RecentLeaderboardEntry[] | Keymash.TopLeaderboard
): leaderboard is Keymash.TopLeaderboard {
  return Object.hasOwn(leaderboard, "data");
}

export function isTopLeaderboardEntry(
  entry: Keymash.RecentLeaderboardEntry | Keymash.TopLeaderboardEntry
): entry is Keymash.TopLeaderboardEntry {
  return Object.hasOwn(entry, "highestWPM");
}
