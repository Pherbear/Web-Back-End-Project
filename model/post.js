//Each post will have an entry for title, subtitle field, and the description will be the main text 
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    subTitle: String,
    description: String,
})

const Post = new mongoose.model('Post', postSchema)

module.exports = Post