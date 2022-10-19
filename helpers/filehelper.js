'use strict'
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads') //Destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //File name after saving
  }
})

const upload = multer({
  storage: storage
})

const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profilepics')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const fileFilter1 = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png']
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload1 = multer({
  storage1: storage1,
  fileFilter1: fileFilter1
})

module.exports = { upload, upload1 }
