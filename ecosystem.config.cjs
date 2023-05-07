module.exports = {
  apps: [
    {
      name: "keymash-discord",
      script: "yarn",
      args: "start",
      interpreter  : "node@18.16.0",
      env: {
        NODE_ENV: "development",
        TOKEN: process.env["TOKEN"]
      },
      env_production: {
        NODE_ENV: "production",
        TOKEN: process.env["TOKEN"]
      }
    }
  ]
};
