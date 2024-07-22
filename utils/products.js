const request = require('postman-request')

const BASE_URL = 'http://localhost:3001'

getAllProducts = (callback) => {
    request(`${BASE_URL}/productos`, (err, res, body) => {
        let parseProduct = JSON.parse(body)
        callback(parseProduct)
    })
}

module.exports = {getAllProducts}