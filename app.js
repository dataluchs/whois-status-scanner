require('dotenv').config()
const express = require('express')
const router = express.Router()

const app = express()

app.use('/whois', require('./api/whois'))

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`API is running on ${port}`)
})