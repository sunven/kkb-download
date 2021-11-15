const request = require('request')
const get = (...args) =>
  new Promise(resolve => {
    request.get(...args, (error, response, body) => {
      resolve(body)
    })
  })

module.exports = {
  get,
}
