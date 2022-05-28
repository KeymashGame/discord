import * as Discord from "discord.js";
import fetch from "node-fetch";
import { Client } from "../structures/client";

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
    return Promise.reject("No JSON returned");
  }

  if (json.error !== undefined) {
    return Promise.reject(json.error);
  }

  if (json.success !== undefined) {
    return json.success;
  }

  return Promise.reject("No success or error returned");
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
    return Promise.reject("No JSON returned");
  }

  if (json.error !== undefined) {
    return Promise.reject(json.error);
  }

  if (json.success !== undefined) {
    return json.success;
  }

  return Promise.reject("No success or error returned");
}
