import * as Discord from "discord.js";
import { getDiscordData } from "../../functions/discord";
import { getPlayerFromID } from "../../functions/player";
import type { Keymash } from "../../types";

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

    const discordData = await getDiscordData(client, interaction.user.id).catch(
      () => {
        interaction.followUp({
          embeds: [
            client.embed({
              title: "Operation Failed",
              description: "Please link your account with /link.",
              color: 0xff0000
            })
          ]
        });
      }
    );

    if (discordData === undefined) {
      return;
    }

    const stats = await getPlayerFromID(
      client,
      discordData.playerId,
      "statistics"
    ).catch(() => {
      interaction.followUp({
        embeds: [
          client.embed({
            title: "Operation Failed",
            description: "Could not fetch your statistics.",
            color: 0xff0000
          })
        ]
      });
    });

    if (stats === undefined) {
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
      .catch(() => {
        interaction.followUp({
          embeds: [
            client.embed({
              title: "Operation Failed",
              description: "Could not add the WPM role.",
              color: 0xff0000
            })
          ]
        });

        return undefined;
      });

    if (result === undefined) {
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
