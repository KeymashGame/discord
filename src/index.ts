import "colors";
import { config } from "dotenv";
import clientOptions from "./config/config.json";
import { Client } from "./structures/client";
import type { Keymash } from "./types";

console.clear();

config();

if (process.env["TOKEN"] === undefined) {
  throw new Error("No token provided");
}

const client = new Client({
  ...(clientOptions as Keymash.ClientOptions),
  intents: [1, 2, 512]
});

client.start(process.env["TOKEN"]).then(console.log);
