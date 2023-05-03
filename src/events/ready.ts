import type { Keymash } from "../types";
import * as Discord from "discord.js";

export default {
  event: "ready",
  run: async (client) => {
    console.log("Keymash discord bot is up and running 👍".green);

    client.user.setPresence({
      status: "online",
      activities: [
        {
          name: "Keymash",
          type: Discord.ActivityType.Playing,
          url: "https://keymash.io"
        }
      ]
    });
  }
} as Keymash.Event<"ready">;
