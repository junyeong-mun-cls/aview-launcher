const express = require('express')
const { getCurrentBranch } = require('../services/gitService')

const router = express.Router()

router.get('/', (req, res) => {
  const hostMachineIp = process.env.HOST_MACHINE_IP || '10.77.3.32'

  res.render('index', {
    title: 'AVIEW Launcher',
    currentBranch: getCurrentBranch(),
    buildStatus: 'idle',
    appStatus: 'stopped',
    appUrl: `http://${hostMachineIp}`
  })
})

module.exports = router
