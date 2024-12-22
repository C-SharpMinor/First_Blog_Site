const Router= require('express')
const router= Router()

const {CreateComment, getPostedComments, likesComment, editComment, deleteComment, getComments}= require('../controllers/commentController')
const {verifyToken}= require('../utils/VerifyUser')


router.route('/create').post(verifyToken, CreateComment)
router.route('/getPostedComments/:postId').get(getPostedComments)// no need to verifyToken her since the comment will be publicly available to see
router.route('/likeComment/:commentId').patch(verifyToken, likesComment)
router.route('/editComment/:commentId').patch(verifyToken, editComment)
router.route('/deleteComment/:commentId').delete(verifyToken, deleteComment)

//this is different from getPost comments. this one is for the admin to see all the comments
router.route('/getcomments').get(verifyToken, getComments)

module.exports= router