const {updateUser, check, deleteUser, signout, getUsers, getCommentUser}= require('../controllers/userControllers')
const {verifyToken}= require('../utils/VerifyUser')

const Router= require('express')
const router= Router()


router.route('/check').get(check)
router.route('/update/:userId').put(verifyToken, updateUser)
//when do you use : in your route as opposed to how you use params in server?
router.route('/delete/:userId').delete(verifyToken, deleteUser)
//the above delete route was for when the user themselves want to delte their account. We want to modify this command now for the admin to be able to delete any account as well
router.route('/signout').post(signout)
router.route('/getusers').get(verifyToken, getUsers)

//making a route getting the users for the comment section
router.route('/:userId').get(getCommentUser)

module.exports= router