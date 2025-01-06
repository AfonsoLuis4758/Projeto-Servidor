const express = require("express")
const router = express.Router()
const {body, validationResult} = require("express-validator")
const Product_controller = require("../controllers/controllers_product")
const { checkAdmin } = require('../utilities/utilities');

router.route("/")
.post([
    body("name").isString().notEmpty().escape(),
    body("gender").isString().notEmpty().escape(),
    body("type").isString().notEmpty().escape(),
    body("stock").isNumeric().notEmpty(),
    body("price").isNumeric().notEmpty(),
    body("color").isArray().notEmpty(),
    body("sizes").isArray().notEmpty(),
    body("promotion").isNumeric().optional(),
    body("recent").isBoolean().optional(),
    body("image").isString().escape().optional()
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        Product_controller.create(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
    
}
)
router.route("/products")
.get(function(req,res){
    Product_controller.list(req,res)
})

router.route("/:id")
.put([
    body("name").isString().notEmpty().escape(),
    body("gender").isString().notEmpty().escape(),
    body("type").isString().notEmpty().escape(),
    body("stock").isNumeric().notEmpty(),
    body("price").isNumeric().notEmpty(),
    body("color").isArray().notEmpty(),
    body("sizes").isArray().notEmpty(),
    body("promotion").isNumeric().optional(),
    body("recent").isBoolean().optional(),
    body("image").isString().escape().optional()
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        Product_controller.update(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
}
).delete(function(req,res){
    Product_controller.deleteData(req,res)
})



module.exports = router