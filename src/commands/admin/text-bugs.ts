import { PermissionFlagsBits } from "discord.js";
import type { Keymash } from "../../types";

export default {
  name: "text-bugs",
  description: "Sends instructions in the text-bugs channel",
  category: "Admin",
  defaultPermissions: [PermissionFlagsBits.ManageGuild],
  run: async (interaction, client) => {
    const channel = await client.getChannel("textBugs");

    if (channel === undefined) {
      interaction.reply({
        ephemeral: true,
        content: "❌ The text-bugs channel does not exist."
      });

      return;
    }

    const embed = client.embed({
      title: "Text Reporting Information",
      description:
        "Please read all of the information and steps below as this will help your report get noticed, acknowledged and fixed.",
      color: 0xe74c3c,
      fields: [
        {
          name: "Message Format",
          value:
            "Copy, Paste and Fill out the information below for us to further be able to target the bug and resolve the text faster.\n```Text: \nCorrected: \nSources: ```"
        }
      ]
    });

    channel.send({ embeds: [embed] });

    interaction.reply({
      ephemeral: true,
      content: "✅ The text-bugs channel has been sent a message."
    });
  }
} as Keymash.Command;
