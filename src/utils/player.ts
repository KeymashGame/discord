import { Client } from "../structures/client";
import type { Keymash } from "../types";

type GetPlayerType = "ranked" | "statistics" | "info";

type GetPlayerData<T extends GetPlayerType> = T extends "ranked"
  ? Keymash.PlayerRankedData
  : T extends "statistics"
  ? Keymash.PlayerStatsData
  : T extends "info"
  ? Keymash.PlayerInfoData
  : never;

export async function getPlayerFromID<T extends GetPlayerType>(
  client: Client<true>,
  playerID: string,
  type: T
): Promise<GetPlayerData<T> | undefined> {
  const params = new URLSearchParams({
    playerId: playerID,
    worldId: "0"
  });

  const response = await fetch(
    `${client.clientOptions.urls.endpoint}/player/${type}?${decodeURI(
      params.toString()
    )}`
  );

  if (!response.ok) {
    return;
  }

  const json = await response.json();

  if (json === undefined) {
    return;
  }

  if (json.error !== undefined) {
    return;
  }

  return json;
}

export async function getPlayerFromUsername<T extends GetPlayerType>(
  client: Client<true>,
  username: string,
  type: T
): Promise<GetPlayerData<T> | undefined> {
  const params = new URLSearchParams({
    name: username,
    worldId: "0"
  });

  const response = await fetch(
    `${client.clientOptions.urls.endpoint}/player/${type}?${decodeURI(
      params.toString()
    )}`
  );

  if (!response.ok) {
    return;
  }

  const json = await response.json();

  if (json === undefined) {
    return;
  }

  if (json.error !== undefined) {
    return;
  }

  return json;
}
