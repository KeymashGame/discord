// Loading up the big guns
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const colors = require('colors');

const { discordToken } = require('./config.json')

// Initiating discord.js client
const client = new Client();

client.commands = new Collection();
client.aliases = new Collection();
client.categories = readdirSync("./commands/");

["command", "event"].forEach(handler=> {
  require(`./handlers/${handler}`)(client);
});

const startBot = () => {
  try {
    client.login(discordToken)
  } catch (err) {
    console.log(colors.red(err));
  }
}

startBot();