'use strict'

const express = require('express')

const indexApi = express.Router()

indexApi.get('/', (req, res, next) => {
    return res.status(200).json('ok')
})

indexApi.get('/test', async (req, res, next) => {
    return res.status(200).json({message: 'Hello motherfucker'})
})

module.exports = indexApi
