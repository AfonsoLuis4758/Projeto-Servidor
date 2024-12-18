const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, default: 'user' },
    gender: String,
    address: String,
    wishlist: [String],
    cart : [String],
    image: Number
})

const User = mongoose.model("User", UserSchema)

module.exports = User