const colors = require('colors');
const { prefix } = require('../../config.json')

module.exports = client => {
	// Hurray! 🥳
    console.log('Keyma.sh discord bot is up and running 👍'.green);
    // Setting up activity
    client.user.setActivity(`${prefix}help`)
}