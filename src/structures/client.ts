import * as Discord from "discord.js";
import { Keymash } from "../types";
import _ from "lodash";
import globCB from "glob";
import { promisify } from "util";
import { resolve } from "path";

export class Client<T extends boolean> extends Discord.Client<T> {
  public static timeoutTime = 60000;
  public static media = "https://raw.githubusercontent.com/keyma-sh/media/main";
  public static iconURL = `${Client.media}/png/avatar.png`;
  public static siteURL = "www.keymash.io";
  public static glob = promisify(globCB);
  public clientOptions: Keymash.ClientOptions;
  public commands = new Discord.Collection<string, Keymash.Command>();
  public categories: string[] = [];
  public permissionsAdded = new Set<string>();

  public constructor(clientOptions: Keymash.ClientOptions) {
    super(clientOptions);

    this.clientOptions = clientOptions;
  }

  public get guild(): Promise<Discord.Guild | undefined> {
    return this.guilds.fetch(this.clientOptions.guildID).catch(() => undefined);
  }

  public async start(token: string): Promise<string> {
    await this.login(token);

    const [commands, events] = await this.load();

    this.emit("ready", this as Client<true>);

    return `Loaded ${commands.toString().red} commands and ${
      events.toString().green
    } events`;
  }

  public async load(): Promise<[number, number]> {
    const commandFiles = await Client.glob(
      resolve(__dirname, "../", "commands", "**", "*.{ts,js}")
    );

    const eventFiles = await Client.glob(
      resolve(__dirname, "../", "events", "**", "*.{ts,js}")
    );

    const commands = (await Promise.all(
      commandFiles.map(
        async (commandFilePath) =>
          (await import(commandFilePath)).default ||
          (await import(commandFilePath))
      )
    )) as Keymash.Command[];

    const events = (await Promise.all(
      eventFiles.map(
        async (eventFilePath) =>
          (await import(eventFilePath)).default || (await import(eventFilePath))
      )
    )) as Keymash.Event<keyof Discord.ClientEvents>[];

    for (const event of events) {
      this.on(event.event, event.run.bind(null, this as Client<true>));
    }

    // Handing application commands

    const fetchOptions = {
      guildId: this.clientOptions.guildID,
      cache: true
    };

    const slashCommands = await this.application?.commands.fetch(fetchOptions);

    for (const command of commands) {
      this.commands.set(command.name, command);

      if (!this.categories.includes(command.category)) {
        this.categories.push(command.category);
      }

      const cmd = slashCommands?.find((c) => c.name === command.name);

      if (cmd === undefined) {
        const type = command.type ?? "CHAT_INPUT";

        const c = await this.application?.commands
          .create(
            {
              name: command.name,
              description:
                type === "CHAT_INPUT"
                  ? command.description ?? "No description provided"
                  : "",
              type,
              options: command.options as Discord.ApplicationCommandOptionData[]
            },
            this.clientOptions.guildID
          )
          .catch(console.log);

        if (c === undefined) {
          console.log(`Error creating command "${command.name}"`);
        } else {
          console.log(`Created command "${c.name}" (${c.id})`);
        }
      } else {
        const mapper = (
          option: Discord.ApplicationCommandOption
        ): Discord.ApplicationCommandOption => {
          type Keys = keyof typeof option;

          type Values = typeof option[Keys];

          type Entries = [Keys, Values];

          for (const [key, value] of Object.entries(option) as Entries[]) {
            if (
              value === undefined ||
              (_.isArray(value) && value.length === 0)
            ) {
              delete option[key];
            }
          }

          return option;
        };

        const cmdObject = {
          name: cmd.name,
          description: cmd.description,
          type: cmd.type,
          options: cmd.options.map(mapper)
        };

        const type = command.type ?? "CHAT_INPUT";

        const commandObject = {
          name: command.name,
          description:
            type === "CHAT_INPUT"
              ? command.description ?? "No description provided"
              : "",
          type,
          options: (command.options ?? []).map(mapper)
        };

        if (_.isEqual(cmdObject, commandObject)) {
          continue;
        }

        await this.application?.commands.edit(
          cmd,
          {
            ...commandObject,
            options: command.options as Discord.ApplicationCommandOptionData[]
          },
          this.clientOptions.guildID
        );

        console.log(`Edited command "${cmd.name}" (${cmd.id})`);
      }
    }

    return [this.commands.size, events.length];
  }

  public embed(
    embedOptions: Discord.MessageEmbedOptions,
    user?: Discord.User
  ): Discord.MessageEmbed {
    embedOptions.footer = {
      text: `${Client.siteURL}${
        embedOptions.footer?.text !== undefined
          ? ` | ${embedOptions.footer.text}`
          : ""
      }`,
      iconURL: Client.iconURL
    };

    if (embedOptions.author === undefined && user !== undefined) {
      embedOptions.author = {
        name: user.username,
        iconURL: user.avatarURL({ dynamic: true }) ?? ""
      };
    }

    const embed = new Discord.MessageEmbed(embedOptions);

    if (!embed.timestamp) {
      embed.setTimestamp();
    }

    return embed;
  }

  public async awaitMessageComponent<T extends Discord.MessageComponentType>(
    channel: Discord.TextBasedChannel | null | undefined,
    filter: Discord.CollectorFilter<[Discord.MappedInteractionTypes<true>[T]]>,
    componentType: T,
    time = Client.timeoutTime
  ): Promise<Discord.MappedInteractionTypes[T] | undefined> {
    return channel
      ?.awaitMessageComponent<T>({
        componentType,
        filter,
        time,
        dispose: true
      })
      .catch(() => undefined);
  }
}
