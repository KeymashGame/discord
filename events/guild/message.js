const { prefix } = require('../../config.json')

module.exports = async (client,message) => {

  // Avoid bot commands
  if (message.author.bot) 
    return;

  // Avoid DM commands
  if (message.channel.type === "dm") 
    return;

  // Formatting the message into arguments
  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);

  // If a command does not start with the prefix return
  if (!command.startsWith(prefix)) 
    return;

  // Get command
  let cmd = client.commands.get(command.slice(prefix.length));

  // If command does not exist, return
  if (!cmd) 
    return;

  // If command is valid, run it
  if (cmd) 
    cmd.run(client, message, args);
}