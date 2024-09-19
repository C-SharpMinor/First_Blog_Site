const {updateUser, check}= require('../controllers/userControllers')
const {verifyToken}= require('../utils/VerifyUser')

const Router= require('express')
const router= Router()


router.route('/check').get(check)
router.route('/update/:userId').put(verifyToken, updateUser)
//when do you use : in your route as opposed to how you use params in server
module.exports= router