import { PermissionFlagsBits } from "discord.js";
import { Client } from "../../structures/client";
import type { Keymash } from "../../types";

export default {
  name: "welcome",
  description: "Sends embeds in the welcome channel",
  category: "Admin",
  defaultPermissions: [PermissionFlagsBits.ManageGuild],
  run: async (interaction, client) => {
    const channel = await client.getChannel("welcome");

    if (channel === undefined) {
      interaction.reply({
        ephemeral: true,
        content: "❌ The welcome channel does not exist."
      });

      return;
    }

    const welcomeEmbed = client.embed({
      title: "Keymash - The Future of Competitive Typing",
      description:
        "Welcome to the official Keymash Discord! Please take a moment to read below for some information and rules!",
      color: 0xfb923c,
      thumbnail: {
        url: Client.iconURL
      },
      fields: [
        {
          name: "Play Now",
          value: "[Keymash Website](https://keymash.io/)"
        },
        {
          name: "Issue Tracker",
          value: "[GitHub](https://github.com/Keyma-sh/next)"
        },
        {
          name: "Discord Invite",
          value: "[Permanent Discord Invite Link](https://discord.gg/df4paUq)"
        }
      ]
    });

    const rulesEmbed = client.embed({
      title: "Keymash Rules",
      thumbnail: {
        url: Client.thumbnails.closedBook
      },
      color: 0xff0000,
      fields: client.clientOptions.rules.map((rule, index) => ({
        name: `Rule #${index + 1}`,
        value: rule
      }))
    });

    // const contributeEmbed = client.embed({
    //   title: "Contribute to Keymash",
    //   thumbnail: {
    //     url: Client.thumbnails.moneyBag
    //   },
    //   color: 0x50e3c2,
    //   fields: [
    //     {
    //       name: "Want to submit some quotes/texts?",
    //       value: "[Add them here](https://keymash.io/submit)"
    //     },
    //     {
    //       name: "Want to directly support Keymash?",
    //       value:
    //         "[Join our Patreon](https://patreon.com/keymashgame) (You get a cool badge!)"
    //     }
    //   ]
    // });

    channel.send({ embeds: [welcomeEmbed, rulesEmbed /*, contributeEmbed*/] });
    interaction.reply({
      ephemeral: true,
      content: "✅ The welcome channel has been sent."
    });
  }
} as Keymash.Command;
