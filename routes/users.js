const express = require('express')
const router = express.Router()
const { protect, authorizeRole } = require('../middleware/auth')
const User = require('../models/User')
const advancedResults = require('../middleware/advancedResults')
const { getUsers, getUser, updateUser, createUser, deleteUser } = require('../controllers/users')

router.use(protect)   //logged in
router.use(authorizeRole('admin'))  //logged in user, its role must be admin

router.route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router