const axios = require('axios')

const http = axios.create({
    baseURL: 'http://127.0.0.1:8765'
})

module.exports = http