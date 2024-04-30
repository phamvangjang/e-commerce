const brand = require('../models/brand')
const asyncHandler = require('express-async-handler')

const createBrand = asyncHandler(async (req, res) => {
    const response = await brand.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createdBrand: response ? response : 'Cannot create new brand'
    })
})

const getBrands = asyncHandler(async (req, res) => {
    const response = await brand.find()
    return res.status(200).json({
        success: response ? true : false,
        brands: response ? response : 'Cannot get brand'
    })
})

const updateBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await brand.findByIdAndUpdate(bid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedBrand: response ? response : 'Cannot update brand'
    })
})

const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await brand.findByIdAndDelete(bid)
    return res.status(200).json({
        success: response ? true : false,
        deletedBrand: response ? response : 'Cannot delete brand'
    })
})

module.exports = {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand
}