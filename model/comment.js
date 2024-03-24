//Each comment will have a post id, a unique user id, and the text the user wants to post
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    body: {type: String, required: true}
},{
    collection: 'comments'
}   
)

const Comment = new mongoose.model('Comment', commentSchema)

module.exports = Comment