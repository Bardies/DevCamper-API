const express = require('express')
const { register, login, getMe, forgotPassword } = require('../controllers/auth')
const router = express.Router();
const { protect } = require('../middleware/auth')


router.post('/register', register)
router.route('/login').post(login)
router.route('/me').get(protect, getMe)
router.route('/forgotpassword').post(forgotPassword)


module.exports = router
