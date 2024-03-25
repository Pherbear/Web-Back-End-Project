const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    subTitle: String,
    description: String,
    created_at: {type: Date, default: Date.now()}
})

const Post = new mongoose.model('Post', postSchema)

module.exports = Post