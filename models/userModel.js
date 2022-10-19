const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      required: false
    },
    fname: {
      type: String,
      required: [true, 'Firstname is required']
    },
    lname: {
      type: String,
      required: [true, 'Lastname is required']
    },
    email: {
      type: String,
      unique: [true, 'Email is already taken'],
      required: [true, 'Please add an email']
    },
    token: {
      type: String
    },
    role: {
      type: Boolean, // True = owner and False = visitor
      default: 1, //
      required: [true, 'Role is required']
    },
    verified: {
      type: Boolean,
      required: true,
      default: false
    },
    born: {
      type: String,
      required: false
    },
    died: {
      type: String,
      required: false
    },
    bornplace: {
      type: String,
      required: false
    },
    placeofdeath: {
      type: String,
      required: false
    },
    author: {
      type: String,
      required: false
    },
    about: {
      type: String,
      required: false,
      default: 'Sinut muistetaan'
    },
    image: {
      data: Buffer,
      contentType: String
    },
    photo: {
      image: Buffer,
      contentType: String
    },
    url: {
      type: String,
      required: false
    },
    qrCode: { type: String, required: false }
  },
  { timestamps: true }
)
userSchema.methods.generateVerificationToken = function () {
  const user = this
  const verificationToken = jwt.sign(
    { ID: user._id },
    process.env.SECRET_TOKEN,
    {
      expiresIn: '300'
    }
  )
  return verificationToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
