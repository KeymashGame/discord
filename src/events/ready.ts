import type { Keymash } from "../types";

export default {
  event: "ready",
  run: async (client) => {
    console.log("Keymash discord bot is up and running 👍".green);

    client.user.setPresence({
      status: "online",
      activities: [
        {
          name: "Keymash",
          type: "PLAYING",
          url: "https://keymash.io"
        }
      ]
    });
  }
} as Keymash.Event<"ready">;
