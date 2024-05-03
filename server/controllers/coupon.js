const coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expiry } = req.body
    if (!name || !discount || !expiry) throw new Error('Missing inputs')
    const response = await coupon.create({
        ...req.body,
        expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
    })
    return res.status(200).json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Cannot create new coupon'
    })
})

const getCoupons = asyncHandler(async (req, res) => {
    const response = await coupon.find().select('-createdAt -updatedAt')
    return res.status(200).json({
        success: response ? true : false,
        coupons: response ? response : 'Cannot get coupon'
    })
})

const updateCoupon = asyncHandler(async (req, res) => {
    const { cpid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if(req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000
    const response = await coupon.findByIdAndUpdate(cpid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Cannot update coupon'
    })
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const { cpid } = req.params
    const response = await coupon.findByIdAndDelete(cpid)
    return res.status(200).json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Cannot delete coupon'
    })
})

module.exports = {
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon
}