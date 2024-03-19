const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    post_id: {type: Number, required: true},
    body: {type: String, required: true}
},{
    collection: 'comments'
}   
)

const Comment = new mongoose.model('Comment', commentSchema)

module.exports = Comment