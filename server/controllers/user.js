const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middleware/jwt')
const { use } = require('../routes/user')

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    if (!email || !password || !firstname || !lastname) {
        return res.status(400).json({
            sucess: false,
            mes: 'Missing inputs'
        })
    }

    const user = await User.findOne({ email })
    if (user) throw new Error('User has existed')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            sucess: newUser ? true : false,
            mes: newUser ? 'Register is successfully' : 'Something went wrong'
        })
    }
})

//login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            sucess: false,
            mes: 'Missing inputs'
        })
    }
    //plan Object
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, ...userData } = response.toObject();
        const accessToken = generateAccessToken(response._id, role);
        const refreshToken = generateRefreshToken(response._id);
        await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            sucess: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Login failed')
    }
})

//get one
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const user = await User.findById({ _id }).select('-refreshToken -password -role')
    return res.status(200).json({
        success: false,
        result: user ? user : 'User not found'
    })
})

module.exports = {
    register,
    login,
    getCurrent
}