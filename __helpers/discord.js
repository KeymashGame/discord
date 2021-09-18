const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const { discordEndpoint } = require('../config.json');

module.exports = (type, discordId, userName) => {
	return new Promise( (resolve, reject) => {
		if(type.toLowerCase() !== 'get' && type.toLowerCase() !== 'link')
			return reject(new Error('Invalid type. Must be either get or link'))

		if(!discordId)
			return reject(new Error('Please include your discord Id.'))

		switch (type.toLowerCase()) {
			case 'link':
				if (!userName)
					return reject(new Error('You need to include your username to link.'))
				if (!userName.includes('-'))
					return reject(new Error('Improperly formatted username. (ie: GNiK-8712)'))
				const data = {
					name: userName,
					discordId: discordId
				}
				const bodyData = JSON.stringify(data)
				console.log(`POST ${discordEndpoint}/${type}`.yellow)
				fetch(`${discordEndpoint}/${type}?`, {
					method: 'POST',
					body: bodyData,
					headers: { 'Content-Type': 'application/json' }
				})
					.then(res => res.json())
					.then( (data) => {
						if(!data)
							return reject(new Error('An error has occurred during search.'))
						console.log(data)
						if(data && data.error)
							return reject(new Error(data.error))
						if(data)
							return resolve(data)
					})
				break;
			default:
				const params = {
					discordId
				}
				const queryString = new URLSearchParams(params)
				console.log(`GET ${discordEndpoint}/${type}?${queryString}`.yellow)
				fetch(`${discordEndpoint}/${type}?${queryString}`)
					.then(res => res.json())
					.then( (data) => {
						if(!data)
							return reject(new Error('An error has occurred during search.'))
						if(data && data.error && data.error.toLowerCase().includes('profile details could not be retrieved'))
							return resolve(false)
						if(data && data.error)
							return reject(new Error(data.error))
						if(data)
							return resolve(data)
					})
				break;
		}
	})
}