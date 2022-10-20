const express = require('express')
const { upload } = require('../helpers/filehelper.js')
const { protect } = require('../middleware/auth.js')
/* not sure protect is available */

//storycontroller.js
const {
  getAllStories,
  getStoryById,
  createStory,
  editStory,
  removeStory
} = require('../controllers/storyController.js')

// express-router
const router = express.Router()

// Story Routes
router.post('/', upload.single('image'), protect, createStory)
router.patch('/:id', protect, editStory)
router.delete('/:id', protect, removeStory)
router.get('/', protect, getAllStories)
router.get('/:id', protect, getStoryById)
module.exports = router
