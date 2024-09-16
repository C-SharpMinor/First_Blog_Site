const Router= require('express')
const router= Router()

const {signup, signin, check, deleteUser}= require('../controllers/authControllers')

router.route('/signup').post(signup)
router.route('/signin').post(signin)
router.route('/').get(check)
router.route('/delete').delete(deleteUser)
module.exports= router