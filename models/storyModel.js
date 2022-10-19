const mongoose = require('mongoose')

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    author: {
      type: String,
      reqiured: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    content: {
      type: String,
      reqiured: true,
      trim: true
    },
    photo: {
      type: [String]
    }
  },
  { timestamps: true }
)

const Story = mongoose.model('Story', storySchema)

module.exports = Story
