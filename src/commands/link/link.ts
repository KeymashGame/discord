import * as Discord from "discord.js";
import { confirmWithCode, linkDiscord } from "../../functions/discord";
import { Keymash } from "../../types";

export default {
  name: "link",
  description: "Links your Discord account to your Keymash account",
  category: "Link",
  options: [
    {
      name: "username",
      description: "Your Keymash username",
      type: Discord.ApplicationCommandOptionType.String,
      required: true
    }
  ],
  run: async (interaction, client) => {
    const username = interaction.options
      .get("username", true)
      ?.value
      ?.toString()
      ?.replace("#", "-") ?? '';

    const linkMessage = await linkDiscord(
      client,
      interaction.user.id,
      username
    ).catch((err) => {
      interaction.reply({
        embeds: [
          client.embed({
            title: "Operation Failed",
            description: err,
            color: 0xff0000
          })
        ]
      });

      return undefined;
    });

    if (linkMessage === undefined) {
      return;
    }

    const row = new Discord.ActionRowBuilder<Discord.TextInputBuilder>();

    const textInput = new Discord.TextInputBuilder()
      .setCustomId("code")
      .setLabel("Enter the code from Keymash")
      .setPlaceholder("Code")
      .setRequired(true)
      .setMinLength(6)
      .setMaxLength(6)
      .setStyle(Discord.TextInputStyle.Short);

    row.addComponents(textInput);

    const modal = new Discord.ModalBuilder()
      .setCustomId("link-modal")
      .setTitle("Link Discord")
      .addComponents(row);

    await interaction.showModal(modal);

    const modalSubmitInteraction = await interaction.awaitModalSubmit({
      time: 60000,
      filter: (i) =>
        i.customId === "link-modal" && i.user.id === interaction.user.id,
      dispose: true
    });

    if (modalSubmitInteraction === undefined) {
      await interaction.followUp({
        content: "You took too long to respond. Cancelling..."
      });

      return;
    }

    const code = modalSubmitInteraction.fields.getTextInputValue("code");

    const confirmMessage = await confirmWithCode(
      client,
      interaction.user.id,
      code
    ).catch((err) => {
      modalSubmitInteraction.reply({
        embeds: [
          client.embed({
            title: "Operation Failed",
            description: err,
            color: 0xff0000
          })
        ]
      });

      return undefined;
    });

    if (confirmMessage === undefined) {
      return;
    }

    modalSubmitInteraction.reply({
      embeds: [
        client.embed({
          title: "Success! 💫",
          description: `Your Discord account has been linked to the \`${username}\` account.`,
          color: 0x00ff00
        })
      ]
    });
  }
} as Keymash.Command;
