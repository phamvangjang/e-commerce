const router = require('express').Router()
const ctrls = require('../controllers/coupon')
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createCoupon)
router.get('/', ctrls.getCoupons)
router.put('/:cpid', [verifyAccessToken, isAdmin], ctrls.updateCoupon)
router.delete('/:cpid', [verifyAccessToken, isAdmin], ctrls.deleteCoupon)

module.exports = router