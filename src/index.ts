import "colors";
import * as Discord from "discord.js";
import { config } from "dotenv";
import clientOptions from "./config/config.json" assert { type: "json" };
import { Client } from "./structures/client";

console.clear();

config();

if (process.env["TOKEN"] === undefined) {
  throw new Error("No token provided");
}

const client = new Client({
  ...clientOptions,
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers
  ]
});

client.start(process.env["TOKEN"]).then(console.log);
