import type { Keymash } from "../types";

export default {
  event: "ready",
  run: async (client) => {
    console.log("Keymash discord bot is up and running 👍".green);

    client.user.setActivity("/help");
  }
} as Keymash.Event<"ready">;
