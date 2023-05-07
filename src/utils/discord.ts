import * as Discord from "discord.js";
import { Client } from "../structures/client";
import type { Keymash } from "../types";

export async function getDiscordData(
  client: Client<true>,
  discordID: Discord.Snowflake
): Promise<Keymash.PlayerDiscordData | undefined> {
  const params = new URLSearchParams({
    discordId: discordID
  });

  const response = await fetch(
    `${client.clientOptions.urls.discordEndpoint}/get?${decodeURI(
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

export async function linkDiscord(
  client: Client<true>,
  discordID: Discord.Snowflake,
  username: string
): Promise<string> {
  const response = await fetch(
    `${client.clientOptions.urls.discordEndpoint}/link`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        discordId: discordID,
        name: username
      })
    }
  );

  const json = await response.json();

  if (json === undefined) {
    throw "No JSON returned";
  }

  if (json.error !== undefined) {
    throw json.error;
  }

  if (json.success !== undefined) {
    return json.success;
  }

  throw "No success or error returned";
}

export async function confirmWithCode(
  client: Client<true>,
  discordID: Discord.Snowflake,
  code: string
): Promise<string> {
  const response = await fetch(
    `${client.clientOptions.urls.discordEndpoint}/confirm`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        discordId: discordID,
        code
      })
    }
  );

  const json = await response.json();

  if (json === undefined) {
    throw "No JSON returned";
  }

  if (json.error !== undefined) {
    throw json.error;
  }

  if (json.success !== undefined) {
    return json.success;
  }

  throw "No success or error returned";
}
