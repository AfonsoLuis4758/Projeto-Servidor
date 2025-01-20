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

router.route("/:email")
.get(function(req,res){
    User_controller.listByEmail(req,res)
})
.put([
    body("username").isString().notEmpty().escape(),
    body("gender").isString().notEmpty().escape(),
    body("address").isString().notEmpty().escape(),
    body("image").isString().optional().escape(),
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

router.route("/password/:email")
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
.put([
    body("search").isString().notEmpty().escape(),
],function (req, res){
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

router.route("/wishlist/:email")
.get(function(req,res){
    User_controller.listWishlist(req,res)
})
.put([
    body("wishlist").isString().notEmpty().escape(),
],function (req, res){
        const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.wishlist(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
    }
)
router.route("/cart/:email")
.get(function(req,res){
    User_controller.listCart(req,res)
})
.put([
    body("id").isString().notEmpty().escape(),
    body("quantity").isNumeric().notEmpty(),
    body("color").isString().notEmpty().escape(),
    body("size").isString().notEmpty().escape(),
],function (req, res){
        const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.cart(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
    }
)

router.route("/cart/quantity/:email")
.put([
    body("id").isString().notEmpty().escape(),
    body("quantity").isNumeric().notEmpty(),
],function (req, res){
        const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.cartQuantity(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
    }
)

router.route("/purchase/:email")
.put(function (req, res){
        const errors = validationResult(req)
    if (errors.isEmpty()) {
        User_controller.emptyCart(req,res)
    }else{
        res.status(400).json({
            errors: errors,
        })
    }
    }
)



module.exports = router