const express = require('express')

const router = express.Router()

router.get('/info', (req, res) => {
    res.send('ok')
})

module.exports = router