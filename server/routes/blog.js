const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken')
const ctrls = require('../controllers/blog')
const uploader = require('../config/cloudinary.config')


router.get('/', ctrls.getBlogs)
router.post('/', [verifyAccessToken, isAdmin], ctrls.createBlog)
router.get('/one/:bid', ctrls.getBlog)
router.put('/uploadimage/:bid', [verifyAccessToken, isAdmin], uploader.single('image'), ctrls.uploadImagesBlog)
router.put('/like/:bid', [verifyAccessToken], ctrls.likeBlog)
router.put('/dislike/:bid', [verifyAccessToken], ctrls.dislikeBlog)
router.put('/:blid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.delete('/:blid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)

module.exports = router;