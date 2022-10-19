const jwt = require('jsonwebtoken')
const User = require('../models/userModel.js')

const verify = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(400).json({ msg: 'Invalid Authentication.' })

    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
      if (err) return res.status(400).json({ msg: 'Invalid Authentication.' })

      req.user = user
      next()
    })
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
}
const protect = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id })

    if (user.role === 1)
      return res.status(500).json({ msg: 'Admin resources access denied.' })

    next()
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
}
const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id })

    if (user.role !== 1)
      return res.status(500).json({ msg: 'Admin resources access denied.' })

    next()
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
}

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_TOKEN, {
    expiresIn: '10d'
  })
}

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_TOKEN, {
    expiresIn: '15d'
  })
}

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_TOKEN, {
    expiresIn: '7d'
  })
}
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: '90d'
  })
}

module.exports = {
  protect,
  verify,
  createActivationToken,
  createAccessToken,
  createRefreshToken,
  generateToken
}
