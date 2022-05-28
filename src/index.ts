import { Client } from "./structures/client";
import { config } from "dotenv";
import clientOptions from "./config/config.json";
import { Keymash } from "./types";
import "colors";

console.clear();

config();

if (process.env["TOKEN"] === undefined) {
  throw new Error("No token provided");
}

const client = new Client(clientOptions as Keymash.ClientOptions);

client.start(process.env["TOKEN"]).then(console.log);
