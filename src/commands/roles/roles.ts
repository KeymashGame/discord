import * as Discord from "discord.js";
import type { Keymash } from "../../types";
import { getDiscordData } from "../../utils/discord";
import { getPlayerFromID } from "../../utils/player";

export default {
  name: "roles",
  description: "Updates your WPM roles",
  category: "Roles",
  run: async (interaction, client) => {
    await interaction.deferReply();

    const guild = await client.guild;

    if (
      !guild?.members?.me?.permissions.has(
        Discord.PermissionFlagsBits.ManageRoles
      )
    ) {
      interaction.followUp({
        embeds: [
          client.embed({
            title: "Missing Permissions",
            description:
              "I don't have the `MANAGE_ROLES` permission. Please give me that permission and try again."
          })
        ]
      });

      return;
    }

    if (guild === undefined || interaction.guildId !== guild.id) {
      interaction.followUp({
        embeds: [
          client.embed({
            title: "Operation Failed",
            description: "This command can only be run in the Keymash server.",
            color: 0xff0000
          })
        ]
      });

      return;
    }

    const discordData = await getDiscordData(client, interaction.user.id);

    if (discordData === undefined) {
      interaction.followUp({
        embeds: [
          client.embed({
            title: "Operation Failed",
            description: "Please link your account with /link.",
            color: 0xff0000
          })
        ]
      });

      return;
    }

    const stats = await getPlayerFromID(
      client,
      discordData.playerId,
      "statistics"
    );

    if (stats === undefined) {
      interaction.followUp({
        embeds: [
          client.embed({
            title: "Operation Failed",
            description: "Could not fetch your statistics.",
            color: 0xff0000
          })
        ]
      });

      return;
    }

    const highest = stats.highestWPM;

    const wpmRole = await client.getWPMRole(highest);

    if (wpmRole === undefined) {
      interaction.followUp({
        embeds: [
          client.embed({
            title: "Operation Failed",
            description: `Could not find a WPM role that fits your WPM of ${highest}.`,
            color: 0xff0000
          })
        ]
      });

      return;
    }

    const member = await guild.members.fetch(interaction.user.id);

    if (member === undefined) {
      interaction.followUp({
        embeds: [
          client.embed({
            title: "Operation Failed",
            description: "Could not find your member object on this server.",
            color: 0xff0000
          })
        ]
      });

      return;
    }

    if (member.roles.cache.has(wpmRole.id)) {
      interaction.followUp({
        embeds: [
          client.embed({
            title: "Operation Failed",
            description: "You already have the correct role.",
            color: 0xff0000
          })
        ]
      });

      return;
    }

    await client.removeAllWPMRoles(member);

    const result = await member.roles
      .add(wpmRole, "Adding WPM Role")
      .catch(() => undefined);

    if (result === undefined) {
      interaction.followUp({
        embeds: [
          client.embed({
            title: "Operation Failed",
            description: "Could not add the WPM role.",
            color: 0xff0000
          })
        ]
      });

      return;
    }

    interaction.followUp({
      embeds: [
        client.embed({
          title: "Success! 💫",
          description: `You now have the ${wpmRole.name} role.`,
          color: Discord.Colors.Blue
        })
      ]
    });
  }
} as Keymash.Command;
