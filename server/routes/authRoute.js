const Router= require('express')
const router= Router()

const {signup, check, deleteUser}= require('../controllers/authControllers')

router.route('/signup').post(signup)
router.route('/').get(check)
router.route('/delete').delete(deleteUser)
module.exports= router