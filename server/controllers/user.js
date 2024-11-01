const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middleware/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto');
const makeToken = require('uniqid');

// const register = asyncHandler(async (req, res) => {
//     const { email, password, firstname, lastname } = req.body
//     if (!email || !password || !firstname || !lastname) {
//         return res.status(400).json({
//             success: false,
//             mes: 'Missing inputs'
//         })
//     }

//     const user = await User.findOne({ email })
//     if (user) throw new Error('User has existed')
//     else {
//         const newUser = await User.create(req.body)
//         return res.status(200).json({
//             success: newUser ? true : false,
//             mes: newUser ? 'Register is successfully' : 'Something went wrong'
//         })
//     }
// })

//register account auth email

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    if (!email || !password || !firstname || !lastname || !mobile) {
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    }
    //check use is exists ?
    const user = await User.findOne({ email })
    if (user) throw new Error('User has existed')
    else {
        const token = makeToken()
        const emailEdited = btoa(email) + '@' + token
        const newUser = await User.create({
            email: emailEdited, password, firstname, lastname, mobile
        })
        if (newUser) {
            const html = `<h2>Register code: </h2><br><blockquote>${token}</blockquote>`
            await sendMail({ email, html, subject: 'Confirm register account' })
        }

        setTimeout(async () => {
            await User.deleteOne({ email: emailEdited })
        }, [300000])// thoi han 5 phut

        return res.json({
            success: newUser ? true : false,
            mes: newUser ? 'Please check your email to active account' : 'Something went wrong, please try later'
        })
    }
})

//final Register
const finalRegister = asyncHandler(async (req, res) => {
    // const cookie = req.cookies
    const { token } = req.params
    const noActivedEmail = await User.findOne({ email: new RegExp(`${token}$`) })

    if (noActivedEmail) {
        noActivedEmail.email = atob(noActivedEmail?.email?.split('@')[0])
        noActivedEmail.save()
    }

    return res.json({
        success: noActivedEmail ? true : false,
        // response: noActivedEmail ? noActivedEmail : 'Something went wrong, please try later'
        mes: noActivedEmail ? 'Register is successfully. Please go to login.' : 'Something went wrong, please try later'
    })
    // if (!cookie || cookie?.dataregister?.token !== token) {
    //     res.clearCookie('dataregister')
    //     return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
    // }

    // const newUser = await User.create({
    //     email: cookie?.dataregister?.email,
    //     password: cookie?.dataregister?.password,
    //     firstname: cookie?.dataregister?.firstname,
    //     lastname: cookie?.dataregister?.lastname,
    //     mobile: cookie?.dataregister?.mobile,
    // })

    // res.clearCookie('dataregister')
    // if (newUser) return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`)
    // else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
})

//login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    }
    //plan Object
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, refreshToken, ...userData } = response.toObject();
        const accessToken = generateAccessToken(response._id, role);
        const newRefreshToken = generateRefreshToken(response._id);
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
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

    const user = await User.findById(_id).select('-refreshToken -password ').populate({
        path: 'cart',
        populate: {
            path: 'product',
            select: 'title thumb price',
        },
    }).populate('wishlist', 'title thumb price color')
    return res.status(200).json({
        success: user ? true : false,
        result: user ? user : 'User not found'
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie && !cookie.refreshToken) {
        throw new Error('No refesh Token in cookies');
    }

    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refesh token not matched'
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    res.clearCookie('refeshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save();

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html,
        subject: 'Forgot password'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'Please check your email' : 'Something went wrong. Plase try later'
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing imputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})

const getUsers = asyncHandler(async (req, res) => {
    // const response = await User.find().select('-refreshToken -password -role')
    // return res.status(200).json({
    //     success: response ? true : false,
    //     users: response
    // })

    const queries = { ...req.query }
    //Tach cac truong dac biet ra khoi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //format lai cac operator cho dung cu phap mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
    const formatedQueries = JSON.parse(queryString)

    //Filtering 
    if (queries?.name) formatedQueries.name = { $regex: queries.name, $options: 'i' }

    if (req.query.q) {
        delete formatedQueries.q
        formatedQueries[`$or`] = [
            { firstname: { $regex: req.query.q, $options: 'i' } },
            { lastname: { $regex: req.query.q, $options: 'i' } },
            { email: { $regex: req.query.q, $options: 'i' } },
        ]
    }
    //console.log(formatedQueries)
    let queryCommand = User.find(formatedQueries)

    //sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    //fields, limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }
    //pagination
    //limit so object lay ve 1 goi api
    //skip 2
    //+req.query.page = json => number
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)


    //execute query
    //so luong san pham thoa man dieu kien !== so luong sp tra ve 1 lan goi API
    try {
        const response = await queryCommand.exec();
        const counts = await User.find(formatedQueries).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            counts,
            users: response ? response : 'Cannot get Users'
        });
    } catch (err) {
        throw new Error(err.message);
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `User with email ${response.email} was delete` : 'Delete user failed'
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { firstname, lastname, email, mobile, address } = req.body
    const data = { firstname, lastname, email, mobile, address }
    if (req.file) data.avatar = req.file.path
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated user successfully' : 'Update user failed'
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated user successfully' : 'Update user failed'
    })
})

const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!req.body.address) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updateUserAddress: response ? response : 'Some thing went wrong'
    })
})

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, quantity = 1, color, price, thumbnail, title } = req.body;
    if (!pid || !color) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color)
    if (alreadyProduct) {
        const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, {
            $set: {
                "cart.$.quantity": quantity,
                "cart.$.price": price,
                "cart.$.thumbnail": thumbnail,
                "cart.$.title": title,
            }
        }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Updated your cart successfully' : 'Some thing went wrong'
        })

    } else {
        const response = await User.findByIdAndUpdate(_id, {
            $push: {
                cart: {
                    product: pid,
                    quantity,
                    color,
                    price,
                    thumbnail,
                    title
                }
            }
        }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Updated your cart successfully' : 'Some thing went wrong'
        })
    }
})

const removeProductInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, color } = req.params;
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color)
    if (!alreadyProduct)
        return res.status(200).json({
            success: true,
            mes: 'Updated your cart successfully'
        })
    const response = await User.findByIdAndUpdate(_id, {
        $pull: {
            cart:
            {
                product: pid,
                color
            }
        }
    }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated your cart successfully' : 'Some thing went wrong'
    })
})

const updateWishlist = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const { _id } = req.user
    const user = await User.findById(_id)
    const alreadyInWishlist = user.wishlist?.find(el => el.toString() === pid)
    if (alreadyInWishlist) {
        const response = await User.findByIdAndUpdate(
            _id,
            { $pull: { wishlist: pid } },
            { new: true })
        return res.json({
            success: response ? true : false,
            mes: response ? 'Updated your wishlist' : 'Failed to update wishlist'
        })
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { wishlist: pid } },
            { new: true })
        return res.json({
            success: response ? true : false,
            mes: response ? 'Updated your wishlist' : 'Failed to update wishlist'
        })
    }
})
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart,
    finalRegister,
    removeProductInCart,
    updateWishlist
}