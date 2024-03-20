const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    subTitle: String,
    description: String,
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post