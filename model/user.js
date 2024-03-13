const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    quote: {type: String}
},{
    collection: 'users'
}   
)

const User = new mongoose.model('User', userSchema)

module.exports = User