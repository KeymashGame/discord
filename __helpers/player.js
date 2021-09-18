const fetch = require('node-fetch');
const { endpoint } = require('../config.json');
const colors = require('colors');

const rankedJsonObject = {
	locale: 'en',
	seasonId: 0,
	modeId: 1,
	rating: 0,
	deviation: 0,
	matchesWon: 0,
	matchesLost: 0,
	matchesQuit: 0,
	created: 0,
	Rank: { SR: 0, Games: 0, Rank: 'Unranked' }
}

module.exports = (type, option, value) => {
	return new Promise( (resolve, reject) => {
		if(type.toLowerCase() !== 'ranked' && type.toLowerCase() !== 'info' && type.toLowerCase() !== 'statistics')
			return reject(new Error('Invalid type. Must be either ranked or info or statistics.'))

		switch (option.toLowerCase()) {
			case 'discord' : 
				const paramsDiscord = {
					playerId: value.toString(),
					worldId: 0
				}
				const discordQueryString = new URLSearchParams(paramsDiscord)
				console.log(`GET ${endpoint}/player/${type}?${discordQueryString}`.yellow)
				fetch(`${endpoint}/player/${type}?${discordQueryString}`)
					.then(res => res.json())
					.then( (data) => {
						if(!data)
							return reject(new Error('An error has occurred during search.'))
						if(data && data.error && data.error.toLowerCase().includes('unable to get ranked') && type.toLowerCase() === 'ranked')
							return resolve(rankedJsonObject)
						if(data && data.error)
							return reject(new Error(data.error))
						if(data)
							return resolve(data)
					})
				break;
			default : 
				if (!value.includes('-'))
					return reject(new Error('Improperly formatted username. (ie: GNiK-8712)'))
				const paramsDefault = {
					name: value.toString(),
					worldId: 0
				}
				const defaultQueryString = new URLSearchParams(paramsDefault)
				console.log(`GET ${endpoint}/player/${type}?${defaultQueryString}`.yellow)
				fetch(`${endpoint}/player/${type}?${defaultQueryString}`)
					.then(res => res.json())
					.then( (data) => {
						if(!data)
							return reject(new Error('An error has occurred during search.'))
						if(data && data.error && data.error.toLowerCase().includes('unable to get ranked') && type.toLowerCase() === 'ranked')
							return resolve(rankedJsonObject)
						if(data && data.error)
							return reject(new Error(data.error))
						if(data)
							return resolve(data)
					})
		}
	})
}