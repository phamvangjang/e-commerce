const router = require('express').Router()
const ctrls = require('../controllers/product')
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumb', maxCount: 1 }
]), ctrls.createProduct)
router.put('/ratings', verifyAccessToken, ctrls.ratings)

router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.array('images'), ctrls.uploadImagesProduct)
router.put('/:pid', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'images', maxCount: 10 },
    { name: 'thumb', maxCount: 1 }
]), ctrls.updateProduct)
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct)
router.get('/', ctrls.getProducts)
router.get('/:pid', ctrls.getProduct)


module.exports = router