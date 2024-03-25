const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    status: {type: String},
    quote: {type: String},
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}]
},{
    collection: 'users'
}   
)

const User = new mongoose.model('User', userSchema)

module.exports = User
