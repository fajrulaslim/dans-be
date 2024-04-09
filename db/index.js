const mongoose = require('mongoose')
const { mongoUrl } = require('../config')


mongoose.connect(mongoUrl, {
    useUnifiedTopology: true
})

const db = mongoose.connection
module.exports = db;