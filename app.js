const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/userRoutes')
const storyRoutes = require('./routes/storyRoutes')
const path = require('path')
const connectDB = require('./config/db.js')
const dotenv = require('dotenv')
dotenv.config()

const cors = require('cors')

const app = express()

connectDB()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use('/uploads', express.static('uploads'))

// routes
app.use('/user', userRoutes)
app.use('/story', storyRoutes)

// sallitaan CORS-pyynnöt ja autentikointi

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
