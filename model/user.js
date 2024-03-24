//For this user schema name, email, and password will be used for login
// status is for whehter the user is banned or not 
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    status: {type: String},
    quote: {type: String}
},{
    collection: 'users'
}   
)

const User = new mongoose.model('User', userSchema)

module.exports = User
