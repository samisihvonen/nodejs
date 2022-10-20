const express = require('express')
const { protect, verify } = require('../middleware/auth.js')
const { upload } = require('../helpers/filehelper')

//usercontroller.js
const {
  authCheck,
  register,
  getUserById,
  resendMail,
  updateProfile,
  getUserByToken
} = require('../controllers/userController.js')
// express-router
const router = express.Router()

// Creates a new exports module.

router.post('/', register)
router.get('/:id', getUserById)
router.get('/profile/:token', getUserByToken)
router.post('/:id', upload.single('image'), updateProfile)
router.post('/resend', resendMail)
router.post('/login', authCheck)

module.exports = router
