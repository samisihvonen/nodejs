// Image.js
const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  image: {
    data: Buffer,
    contentType: String
  },
  data: {
    type: String
  },
  contentType: {
    type: String
  },
  imageTime: {
    type: Date,
    default: Date.now
  },
  path: {
    type: String
  },
  size: {
    type: Number
  }
})

module.exports = Image = mongoose.model('image', ImageSchema)
