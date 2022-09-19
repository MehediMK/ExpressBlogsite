const mongoose = require('mongoose')

const featuredSchema = mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = featuredSchema

