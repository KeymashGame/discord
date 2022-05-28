import type { Keymash } from "../types";

export default {
  event: "ready",
  run: async (client) => {
    console.log(`Logged in as ${client.user.tag}`.blue);
  }
} as Keymash.Event<"ready">;
