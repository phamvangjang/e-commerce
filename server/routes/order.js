const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken')
const ctrls = require('../controllers/order')


router.post('/', verifyAccessToken, ctrls.createOrder)

module.exports = router;