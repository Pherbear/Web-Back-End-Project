const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    // user_id: {type: Number, required: true}, 
    // post_id: {type: Number, required: true},
    body: {type: String, required: true}
},{
    collection: 'comments'
}   
)

const Comment = new mongoose.model('Comment', commentSchema)

module.exports = Comment