const express = require("express")
const router = express.Router()
const {body, validationResult} = require("express-validator")
const User_controller = require("../controllers/controllers_user")
const { checkAdmin } = require('../utilities/utilities');

router.post('/login',  function (req, res) {
    User_controller.login(req, res); 
})

router.post('/register', [
    body('username').notEmpty().escape(), 
    body('email').notEmpty().escape(), 
    body('password').notEmpty().escape(),
    body("gender").isString().notEmpty().escape(),
    body("address").isString().notEmpty().escape()
],  function (req, res) {
    const errors = validationResult(req); 
    if (errors.isEmpty()) {
        User_controller.register(req, res); 
    } else {
        res.status(404).json({errors: errors.array()})
    }
})
router.route("/")
.get(function(req,res){
    User_controller.list(req,res)
})
/*.post([
    body("name").isString().notEmpty().escape(),
    body("gender").isString().notEmpty().escape(),
    body("address").isString().notEmpty().escape()
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.create(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
    
}
)*/

router.route("/:id")
.get(function(req,res){
    User_controller.listById(req,res)
})
.put([
    body("name").isString().notEmpty().escape(),
    body("gender").isString().notEmpty().escape(),
    body("address").isString().notEmpty().escape(),
    body("wishlist").isArray().notEmpty(),
    body("cart").isArray().notEmpty().escape()
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.update(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
}
).delete(function(req,res){
    User_controller.deleteData(req,res)
})

router.route("/searches/:email")
.get(function(req,res){
    User_controller.getSearch(req,res)
})
.put(function (req, res){
        const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.addSearch(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
    }
)


module.exports = router