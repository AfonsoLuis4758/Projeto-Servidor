const express = require("express")
const router = express.Router()
const {body, validationResult} = require("express-validator")
const User_controller = require("../controllers/controllers_user")

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

router.route("/:email")
.get(function(req,res){
    User_controller.listByEmail(req,res)
})
.put([
    body("username").isString().notEmpty().escape(),
    body("gender").isString().notEmpty().escape(),
    body("address").isString().notEmpty().escape(),
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

router.route("/password/:password")
.put([
    body("password").isString().notEmpty().escape(),
], function (req, res) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.updatePassword(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
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