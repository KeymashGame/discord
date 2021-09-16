const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const { endpoint } = require('../config.json');

module.exports = (type) => {
	return new Promise( (resolve, reject) => {
		try {
			if(type.toLowerCase() !== 'statistics')
				return reject(new Error('Invalid type. Must be either statistics'))

			switch (type.toLowerCase) {
				default:
					const params = {
						modeId: 1,
						filter: 'highestWPM',
						startNum: 0,
						limit: 10
					}
					const queryString = new URLSearchParams(params)
					console.log(`GET ${endpoint}/leaderboards/${type}?${queryString}`.yellow)
					fetch(`${endpoint}/leaderboards/${type}?${queryString}`)
						.then(res => res.json())
						.then( (data) => {
							if(!data)
								return reject(new Error('An error has occurred during search.'))
							if(data && data.error)
								return reject(new Error(data.error))
							if(data)
								return resolve(data)
						})
					break;
			}
 		} catch (err) {
			return reject(err.message)
		}
	})
}