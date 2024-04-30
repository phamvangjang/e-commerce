const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body
    if (!title || !description || !category) throw new Error('Missing inputs')
    const response = await Blog.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createBlog: response ? response : 'Cannot create new blog'
    })
})

const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find()
    return res.status(200).json({
        success: response ? true : false,
        blogs: response
    })
})

const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const blog = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', 'firstname lastname')
        .populate('dislikes', 'firstname lastname')
    return res.status(200).json({
        success: blog ? true : false,
        rs: blog
    })
})
//chua test api duoc #14 - 30p

const updateBlog = asyncHandler(async (req, res) => {
    const { blid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await Blog.findByIdAndUpdate(blid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Cannot update blog'
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { blid } = req.params
    const response = await Blog.findByIdAndDelete(blid, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        deletedBlog: response ? response : 'Cannot delete this blog'
    })
})

/*
LIKE
DISLIKE
Khi nguoi dung like mot blog
1. kiem tra nguoi do trc do co dislike hay ko => bo dislike
2. kiem tra xem nguoi do trc do co like ko => bo like, them like
pull
push
*/

const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.params
    if (!bid) throw new Error('Missing inputs')
    const blog = await Blog.findById(bid)
    const alreadlyDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if (alreadlyDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
    const isLiked = blog?.likes?.find(el => el.toString() === _id)
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})

const dislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.params
    if (!bid) throw new Error('Missing inputs')
    const blog = await Blog.findById(bid)
    const alreadlyLiked = blog?.likes?.find(el => el.toString() === _id)
    if (alreadlyLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
    const isDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { dislikes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})


module.exports = {
    createBlog,
    getBlogs,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    getBlog
}