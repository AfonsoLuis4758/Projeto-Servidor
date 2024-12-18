const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: String,
    type: String,
    stock: Number,
    gender: String,
    price: Number,
    color: Array,
    sizes : Array,
    promotion: Number,
    image: Number,
    recent: Boolean
})

const Product = mongoose.model("Product", ProductSchema)

exports.Product = Product

