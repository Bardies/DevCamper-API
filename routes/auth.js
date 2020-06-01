const express = require('express')
const { register, login, logOut, getMe, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controllers/auth')
const router = express.Router();
const { protect } = require('../middleware/auth')


router.post('/register', register)
router.route('/login').post(login)
router.route('/logout').get(logOut)
// PROTECT >> will set (req.user) with (the logged in user)  which we can reach by the tokenin Authorization header
router.route('/me').get(protect, getMe)
router.route('/updateDetails').put(protect, updateDetails)   //protect = logged in
router.route('/updatePassword').put(protect, updatePassword)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetPassword/:token').put(resetPassword)

module.exports = router
