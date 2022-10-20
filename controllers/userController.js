const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var fs = require('fs')
var path = require('path')
const User = require('../models/userModel.js')
const Image = require('../models/imageModel.js')
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
const { generateVerificationToken } = require('../models/userModel')

const dotenv = require('dotenv')
dotenv.config()

// Check if email is valid.
const validateEmail = (email) => {
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
})

const authCheck = async (req, res, next) => {
  const { token } = req.body
  console.log('check', token)
  // Check we have an id
  if (!token) {
    return res.status(422).send({
      message: 'Missing Token'
    })
  }
  // Step 1 -  Verify the token from the URL
  let payload = null
  try {
    payload = jwt.verify(token, process.env.SECRET_TOKEN)
  } catch (err) {
    return res.status(500).send({ message: err.message('Cannot verify token') })
  }
  try {
    // Step 2 - Find user with matching ID
    const user = await User.findOne({ _id: payload.ID }).exec()
    if (!user) {
      let error = new HttpError('user not found', payload)
      return res.status(404).send({
        message: 'User does not  exists' + error
      })
    }
    // Step 3 - Update user verification status to true
    user.verified = true

    await user.save()
    return res
      .status(200)
      .send({
        message: 'Account Verified'
      })
      .redirect('/profile.html')
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

// Get a user by id.
const getUserById = async (req, res) => {
  // Select a user based on the id
  const token = req.params.id
  // Check we have an id
  if (!req.params.id) {
    return res.status(422).send({
      message: 'Missing Token'
    })
  }
  // Step 1 -  Verify the token from the URL
  let payload = null
  try {
    payload = jwt.verify(req.params.id, process.env.SECRET_TOKEN)
  } catch (err) {
    return res.status(500).send(err)
  }
  try {
    // Step 2 - Find user with matching ID
    const user = await User.findOne({ _id: payload.sub }).exec()
    if (!user) {
      return res.status(404).send({
        message: 'User does not  exists'
      })
    }
    // Step 3 - Update user verification status to true
    user.verified = true

    await user.save()
    // res.redirect('/profile.html')
    return res.status(200).send({ message: 'Verified!', user })
  } catch (err) {
    return res.status(500).send(err)
  }
}

// Creates a new user.
const register = async (req, res) => {
  const { fname, lname, email, role } = req.body
  // Check we have an email
  if (!email) {
    return res.status(422).send({ message: 'Missing email.' })
  }
  try {
    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec()
    if (existingUser) {
      return res.status(409).send({
        message: 'Email is already in use.'
      })
    }
    // Step 1 - Create and save the user
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      fname: fname,
      lname: lname,
      role: role,
      email: email
    })

    // Create token
    const token = jwt.sign(
      {
        iss: 'eternia',
        sub: user._id,
        iat: new Date().getTime(), // Issued Time
        exp: new Date().setDate(new Date().getDate() + 1) // Token Expiry date
      },
      process.env.SECRET_TOKEN
    )
    // save user token
    user.token = token

    await user.save()

    // Step 2 - Generate a verification token with the user's

    // Step 3 - Email the user a unique verification link

    // const dataImage = await QR.toDataURL(verificationToken)
    const url = `http://localhost:5000/user/?${user.token}`
    transporter.sendMail({
      to: email,
      subject: 'Verify Eternia Account || Hyväksy Eternia tilin luonti',
      html: `
      <table style=" background-repeat:no-repeat; width:450px;margin:0;" cellpadding="20" cellspacing="20" border="0">
      <tr style="height:40px; width:450px; margin:0;">Click <a href = '${url}'>here</a> to confirm your email. <br/>
      Klikkaa <a href='${url}'>tästä</a> aktivoidaksesi eternia tilisi
      </tr>
      <tr style="height:40px; width:450px; margin:0;">
      <br/>
      <br/>
      <p>jos kuitenkin hukkaat tai unohdat avaimesi niin täytä rekisterointilomake uudelleen niin lähetamme sinulle uuden avaimen</p>
      </tr>
      </table>
      `
    })

    res
      .status(200)
      .json({ message: `Sent a verification email to ${email}`, user: user })
    //can't sent a message
    // res.status(201).send({
    //   message: `Sent a verification email to ${email}`
    // })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}
const resendMail = async (req, res) => {
  const { email } = req.body
  // Check we have an email
  if (!email) {
    return res.status(422).send({ message: 'Missing email.' })
  }
  try {
    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec()
    let verificationToken
    if (existingUser) {
      console.log(existingUser._id)
      verificationToken = existingUser.generateVerificationToken()
    }

    const url = `http://localhost:5000/user/?${verificationToken}`
    transporter.sendMail({
      to: email,
      subject: 'Verify Eternia Account || Hyväksy Eternia tilin luonti',
      html: `
      <table style=" background-repeat:no-repeat; width:450px;margin:0;" cellpadding="20" cellspacing="20" border="0">
      <tr style="height:40px; width:450px; margin:0;">Click <a href = '${url}'>here</a> to confirm your email. <br/>
      Klikkaa <a href='${url}'>tästä</a> aktivoidaksesi eternia tilisi
      </tr>
      <br/>
      <br/>
      <br/>
      <b>Avain tilillesi ${url}</b>
      <p>jos kuitenkin hukkaat tai unohdat avaimesi niin täytä rekisterointilomake uudelleen niin lähetamme sinulle uuden avaimen</p>
      </tr>
      </table>
      `
    })
    return res.status(201).send({
      message: `Sent a verification email to ${email}`
    })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

const updateProfile = async (req, res) => {
  // Add a const to the request body
  const token = req.params.id
  // console.log('check', token, 'params', req.params.id)
  if (!token) return res.status(400).json({ msg: 'Invalid Authentication.' })

  // console.log('userdetails', token + '  ' + token)
  // Check we have an id
  if (!token) {
    return res.status(422).send({
      message: 'Missing Token'
    })
  }
  // Step 1 -  Verify the token from the URL
  let payload = null
  try {
    payload = jwt.verify(token, process.env.SECRET_TOKEN)
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }

  // Check we have an id
  let userId = payload.sub
  try {
    // Step 2 - Find user with matching ID
    const findUser = await User.findOne({ _id: userId }).exec()
    if (!findUser) {
      console.log('fetched user', findUser)
      return res.status(404).send({
        message: 'User does not  exists'
      })
    }
    // Step 3 - Update user verification status to true
    findUser.verified = true

    const { fname, lname, born, died, image, birthplace, placeofdeath } =
      req.body

    const host = req.hostname

    const updatedProfile = {
      fname: req.body.fname,
      lname: req.body.lname,
      born: req.body.born,
      died: req.body.died,
      birthplace: req.body.birthplace,
      placeofdeath: req.body.placeofdeath,
      image: req.file.path
    }

    console.log('updating profile', updatedProfile)
    let user = await User.findByIdAndUpdate(
      userId,
      { $set: updatedProfile },
      { new: true }
    )

    res.status(200).json({ user })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
}
// Update user.

/* Try to find user by token */

const getUserByToken = async (req, res) => {
  console.log('check token', req.params.token)
  // Check we have an id
  if (!req.params.token) {
    return res.status(422).send({
      message: 'Missing Token'
    })
  }
  try {
    // Step 2 - Find user with matching ID
    const user = await User.findOne({ _id: req.params.token }).exec()
    if (!user) {
      return res.status(404).send({
        message: 'User does not  exists'
      })
    }
    // Step 3 - Update user verification status to true
    user.verified = true

    await user.save()
    return res.status(200).send({ message: 'Verified!', user })
  } catch (err) {
    return res.status(500).send(err)
  }
}

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}
/* Try to find user by token */

const signout = (req, res) => {
  res.clearCookie('token')
  return res.status('200').json({
    message: 'signed out'
  })
}

module.exports = {
  authCheck,
  register,
  resendMail,
  getUserById,
  getUserByToken,
  updateProfile,
  signout
}
