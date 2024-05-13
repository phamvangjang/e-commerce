const Product = require('../models/product')
const ProductCategory = require('../models/productCategory')
const data = require('../../data/data2.json')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const categoryData = require('../../data/cate_brand')

const fn = async (product) => {
    await Product.create({
        title: product.name,
        slug: slugify(product?.name) + Math.round(Math.random() * 100) + '',
        description: product?.description,
        brand: product?.brand,
        price: Math.round(Number(product?.price?.match(/\d/g).join('')) / 100),
        category: product?.category[1],
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.find(el => el.label === 'Color')?.variants[0],
        thumb: product?.thumb,
        // totalRatings: Math.round(Math.random() * 5)
        totalRatings: 0
    })
}

const func = async (category) => {
    await ProductCategory.create({
        title: category?.cate,
        brand: category?.brand,
        image: category?.image
    })
}

const insertProduct = asyncHandler(async (req, res) => {
    const promises = []
    for (let product of data) promises.push(fn(product))
    await Promise.all(promises)
    return res.json('Done')
})

const insertCategory = asyncHandler(async (req, res) => {
    const promises = []
    for (let category of categoryData) promises.push(func(category))
    await Promise.all(promises)
    return res.json('Done')
})
module.exports = {
    insertProduct,
    insertCategory
}