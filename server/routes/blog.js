const router = require('express').Router()
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken')
const ctrls = require('../controllers/blog')


router.post('/', [verifyAccessToken, isAdmin], ctrls.createBlog)
router.put('/like', [verifyAccessToken], ctrls.likeBlog)
router.get('/', ctrls.getBlogs)
router.put('/:blid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.delete('/:blid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)

module.exports = router;