const request = require('postman-request')

const BASE_URL = 'https://local-api-822e4889e0cf.herokuapp.com'

getContador = (callback) => {
    request(`${BASE_URL}/contador`, (err, res, body) => {
        let parseProduct = JSON.parse(body)
        callback(parseProduct)
    })
}

module.exports = {getContador}