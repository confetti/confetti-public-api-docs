const API_KEY =
  process.env.API_KEY || '2-8eaa3a790e8b08076a74ab0cb19473134f84493990b9550a'
const API_URL = process.env.API_URL || 'https://api.confetti.events'

const request = require('request-promise')
const { Store } = require('yayson')()
const store = new Store()

module.exports = {
  get: path => {
    return request({
      uri: API_URL + path,
      headers: {
        authorization: 'apikey ' + API_KEY
      },
      json: true
    })
  },
  format: data => {
    return store.sync(data)
  }
}
