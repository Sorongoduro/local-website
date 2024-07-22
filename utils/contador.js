const request = require('postman-request')

const BASE_URL = 'http://localhost:3001'

getContador = (callback) => {
    request(`${BASE_URL}/contador`, (err, res, body) => {
        let parseProduct = JSON.parse(body)
        callback(parseProduct)
    })
}

module.exports = {getContador}