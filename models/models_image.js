const mongoose = require("mongoose")
const model = require("./models_image")

const ImageSchema = new mongoose.Schema({
    name: String,
    type: String,
    data: Buffer,
})

const Image = mongoose.model("Image", ImageSchema)

exports.Image = Image