const Story = require('../models/storyModel.js')

const getAllStories = async (req, res) => {
  try {
    const storys = await Story.find()
    res.status(200).json(storys)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById({ uid: req.params.id })
    res.status(200).json(story)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

const createStory = async (req, res) => {
  const { uid, name, title, content, photo, location } = req.body
  const story = new Story({
    uid,
    name,
    title,
    content,
    photo,
    location,
    name
  })
  try {
    const newStory = await story.save()
    res.status(200).json(newStory)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

const editStory = async (req, res) => {
  const story = await Story.findById(req.params.id)
  try {
    if (story.uid !== req.token) {
      res
        .status(401)
        .json({ message: 'You are not authorized to edit this story.' })
    } else {
      const { name, content, date, image, location, city } = req.body
      story.name = name
      story.content = content
      story.date = date
      story.image = image
      story.location = location
      story.city = city
      const updatedStory = await story.save()
      res.status(200).json({ message: `Story ${updatedStory.name} updated.` })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

const removeStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
    if (story.uid !== req.token) {
      res
        .status(401)
        .json({ message: 'You are not authorized to delete this story.' })
    }
    await story.remove()
    res.status(200).json({ message: 'Story deleted.' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

module.exports = {
  getAllStories,
  getStoryById,
  createStory,
  editStory,
  removeStory
}
