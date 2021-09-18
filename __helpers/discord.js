const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const { discordEndpoint } = require('../config.json');

module.exports = (type, discordId, userName, code) => {
	return new Promise( (resolve, reject) => {
		if(type.toLowerCase() !== 'get' && type.toLowerCase() !== 'link' && type.toLowerCase() !== 'confirm')
			return reject(new Error('Invalid type. Must be either get or link or confirm'))

		if(!discordId)
			return reject(new Error('Please include your discord Id.'))

		switch (type.toLowerCase()) {
			case 'confirm':
				if(!code)
					return reject(new Error('A verification code is required.'))
				const dataConfirm = {
					discordId,
					code
				}
				const bodyDataConfirm = JSON.stringify(dataConfirm)
				console.log(`POST ${discordEndpoint}/${type}`.yellow)
				fetch(`${discordEndpoint}/${type}?`, {
					method: 'POST',
					body: bodyDataConfirm,
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
			case 'link':
				if (!userName)
					return reject(new Error('You need to include your username to link.'))
				if (!userName.includes('-'))
					return reject(new Error('Improperly formatted username. (ie: GNiK-8712)'))
				const data = {
					name: userName,
					discordId
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