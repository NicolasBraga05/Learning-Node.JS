const express = require('express')
const router = express.Router()
const path = require('path')


const basePath = path.join(__dirname, '../templates')

router.get('/router', (req, res) => {
    res.sendFile(`${basePath}/utili_router.html`)
})


module.exports = router