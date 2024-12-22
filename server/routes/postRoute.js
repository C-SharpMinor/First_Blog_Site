const Router= require('express')
const router= Router()

const {verifyToken}= require('../utils/VerifyUser')
const {Create, getPosts, deletePost, updatePost}= require('../controllers/postController')

router.route('/create').post(verifyToken, Create)
router.route('/getposts').get(verifyToken, getPosts)
router.route('/deletepost/:postId/:userId').delete(verifyToken, deletePost)
router.route('/updatepost/:postId/:userId').put(verifyToken, updatePost)


module.exports= router