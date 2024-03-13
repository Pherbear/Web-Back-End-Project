const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user_id: {type: Integer, required: true},
    post_id: {type: Integer, required: true},
    body: {type: String, required: true}
},{
    collection: 'comments'
}   
)

const Comment = new mongoose.model('Comment', commentSchema)

module.exports = Comment