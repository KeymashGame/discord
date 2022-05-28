import * as Discord from "discord.js";
import { Client } from "../structures/client";

declare namespace Keymash {
  interface WPMRole {
    id: Discord.Snowflake;
    min: number;
    max: number;
  }

  interface Channels {
    welcome: Discord.Snowflake;
  }

  interface ClientOptions extends Discord.ClientOptions {
    guildID: Discord.Snowflake;
    devID: Discord.Snowflake;
    dev: boolean;
    wpmRoles: WPMRole[];
    channels: Channels;
    rules: string[];
  }

  interface Command<T extends Discord.ApplicationCommandType = "CHAT_INPUT"> {
    name: string;
    description?: string;
    category: string;
    type?: T;
    options?: Discord.ApplicationCommandOption[];
    needsPermissions?: boolean;
    run: (
      interaction: T extends "CHAT_INPUT"
        ? Discord.CommandInteraction
        : T extends "MESSAGE"
        ? Discord.MessageContextMenuInteraction
        : Discord.UserContextMenuInteraction,
      client: Client<true>
    ) => void;
  }

  interface Event<E extends keyof Discord.ClientEvents> {
    event: E;
    run: (client: Client<true>, ...eventArgs: Discord.ClientEvents[E]) => void;
  }
}
