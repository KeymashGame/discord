export const apps = [
  {
    name: "keymash-discord",
    script: "yarn",
    args: "start",
    env: {
      NODE_ENV: "development",
      TOKEN: process.env["TOKEN"]
    },
    env_production: {
      NODE_ENV: "production",
      TOKEN: process.env["TOKEN"]
    }
  }
];
