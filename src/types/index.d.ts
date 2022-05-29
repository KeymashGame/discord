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
    textBugs: Discord.Snowflake;
  }

  interface URLs {
    endpoint: string;
    discordEndpoint: string;
    profile: string;
  }

  interface ClientOptions extends Discord.ClientOptions {
    guildID: Discord.Snowflake;
    devID: Discord.Snowflake;
    dev: boolean;
    urls: URLs;
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

  interface PlayerDiscordData {
    _id: string;
    playerId: string;
    name: string;
    discriminator: string;
  }

  interface Player {
    playerId: string;
    name: string;
    discriminator: string;
    avatarSrc: string;
    verified: number;
    patreon: number;
    staff: number;
    experience: number;
    playtime: number;
    cardImage: string;
    cardBorder: string;
  }

  interface Level {
    Index: number;
    Next: number;
    Prev: number;
    Percentage: number;
    Experience: number;
  }

  interface Country {
    name: string;
    code: string;
  }

  interface PlayerInfoData {
    _id: string;
    playerId: string;
    name: string;
    discriminator: string;
    avatarSrc: string;
    verified: number;
    patreon: number;
    staff: number;
    experience: number;
    playtime: number;
    currency: number;
    fullName: string;
    useConfig: string;
    countryId: number;
    description: string;
    keyboardBrand: string;
    keyboardModel: string;
    keyboardId: number;
    cardImage: string;
    cardBorder: string;
    banner: string;
    isGuest: number;
    banned: number;
    created: number;
    country: Country;
    Level: Level;
    keyboardLayout: string;
  }

  interface PlayerRankedData {
    Level: Level;
    Rank?: {
      Rank: number;
      Games: number;
    };
  }

  interface PlayerStatsData {
    _id: string;
    playerId: string;
    lowestElapsed: number;
    highestWPM: number;
    highestEXP: number;
    matchesWon: number;
    matchesLost: number;
    matchesQuit: number;
    tournamentsWon: number;
    tournamentsTop5: number;
    tournamentsLost: number;
    cr?: number;
  }

  interface RecentLeaderboardEntry {
    _id: string;
    playerId: string;
    matchId: string;
    wpm: number;
    exp: number;
    time: number;
    accuracy: number;
    placement: number;
    created: number;
    player: Player[];
  }

  interface TopLeaderboardEntry {
    _id: string;
    highestWPM: number;
    player: Player[];
    placement: number;
  }

  interface TopLeaderboard {
    isNextPage: boolean;
    data: TopLeaderboardEntry[];
  }
}
