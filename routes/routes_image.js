const express = require("express")
const router = express.Router()
const {body, validationResult} = require("express-validator")
const Image = require("../controllers/controllers_image")

router.route("/")
.post([
    body("name").isString().notEmpty().escape(),
    body("type").isString().notEmpty().escape(),
    //body("data").isBlob().notEmpty()
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        Image_controller.create(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
    
}
)

router.route("/:id")
.get(function(req,res){
    Image_controller.listById(req,res)
})
.put([
    body("name").isString().notEmpty().escape(),
    //body("data").isBuffer().notEmpty()
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        Image_controller.update(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
}
).delete(function(req,res){
    Image_controller.deleteData(req,res)
})



module.exports = router