import * as Discord from "discord.js";
import { Client } from "../structures/client";
import type { Keymash } from "../types";

export default {
  event: "interactionCreate",
  run: async (client, interaction) => {
    if (
      interaction.channel?.type !== Discord.ChannelType.DM &&
      (interaction.isCommand() ||
        interaction.isMessageContextMenuCommand() ||
        interaction.isUserContextMenuCommand())
    ) {
      runCommand(interaction, client);
    }
  }
} as Keymash.Event<"interactionCreate">;

async function runCommand(
  interaction:
    | Discord.ChatInputCommandInteraction
    | Discord.MessageContextMenuCommandInteraction
    | Discord.UserContextMenuCommandInteraction,
  client: Client<true>
): Promise<void> {
  const commandName = interaction.commandName;

  const command = client.commands.get(commandName);

  if (command === undefined) {
    interaction.reply("Could not find this command.");

    return;
  }

  console.log(`Running command "${command.name}"`);

  try {
    command.run(interaction, client);
  } catch (err) {
    console.log(`An error occured running command "${command.name}"\n${err}`);

    const msg = `❌ Unexpected error occured. Please report this.`;

    interaction.reply(msg).catch(() => {
      console.log("Couldn't reply, sending followUp instead.");

      interaction.followUp(msg).catch(console.log);
    });
  }
}
