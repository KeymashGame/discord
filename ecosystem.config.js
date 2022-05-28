module.exports = {
  apps: [
    {
      name: "keymash-discord",
      script: "yarn",
      args: "start",
      env: {
        NODE_ENV: "development",
        DISCORD_TOKEN: process.env.DISCORD_TOKEN
      },
      env_production: {
        NODE_ENV: "production",
        DISCORD_TOKEN: process.env.DISCORD_TOKEN
      }
    }
  ]
};
