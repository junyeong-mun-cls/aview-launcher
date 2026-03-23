const express = require('express')
const { switchAndPull } = require('../controllers/gitController')

const router = express.Router()

router.post('/switch-pull', switchAndPull)

module.exports = router
