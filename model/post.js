const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: String,
    subTitle: String,
    description: String,
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post