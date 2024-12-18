const User = require("../models/models_user");
const utilities = require("../utilities/utilities");
const bcrypt = require("bcrypt");


//get
const list = function(req, res) {
    
    User.find()
        .then((list) => {
            res.status(200).json(list);
        })
        .catch((error) => {
            res.status(400).send('Error: ' + error);
        });
};


//mongoose não permite callbacks para find e save, log tive de adaptar

const login = (req, res) => {
  User.find({email: req.body.email})
  .then((user)=>{
    if (user.length > 0) {
      bcrypt
        .compare(req.body.password, user[0].password)
        .then(function (result) {
          if (result) {
            utilities.generateToken({ user: req.body.email, role: req.body.role }, (token) => {
              res.status(200).json(token);
            });
          } else {
            res.status(401).send("Not Authorized");
          }
        });
    } else {
      res.status(401).send("Not Authorized");
    }
    })
    .catch((error) => {
            res.status(400).send('Error: ' + error);
        });
  };
  
  const register = (req, res) => {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        let new_User = new User({
          username: req.body.username,
          email: req.body.email,
          password: hash,
          gender: req.body.gender,
          address: req.body.address,
          wishlist: [],
          cart: [],
          role: req.body.role || 'user' // Default role is 'user'
        });
  
        // find duplicate users
        User.find({ username: req.body.username })
        .then((user) => {
          if (user.length > 0) {
            res.status(406).send("Duplicated User");
          } else {
            new_User.save()
            .then(()=>{
                        res.status(200).send("Registered User");
            })
            .catch((err) => {
              res.status(400).send(err);
            })
          }
        })
      });
    });
  };




//post
/*const create = function (req,res) {
    let new_User = new User({
        username: req.body.username,
        gender: req.body.gender,
        address: req.body.address,
        wishlist: [],
        cart: []
    })

    new_User.save().then((result)=>{     
        res.status(200).json(result)
    }).catch((error)=> {
        res.status(400).send("Error: " + error)
    })
}
*/

const update = function (req,res) {     //put
    let updateData = {
        username: req.body.name,
        email:req.body.email,
        gender: req.body.gender,
        address: req.body.address,
        wishlist: req.body.wishlist,
        cart: req.body.cart
    } 

    User.findByIdAndUpdate(req.params.id,updateData,{ new: true }).then((result)=>{ 
        res.status(200).json(result)
    }).catch((error)=> {
        res.status(400).send("Error: " + error)
    })
}

const deleteData = function(req,res){                  //delete by id
  User.findByIdAndDelete(req.params.id).then((result)=>{
            res.status(200).json(result)
    }).catch((error)=>{
        res.status(400).send("Error: " + error)
    })
}


exports.list = list
//exports.create = create
exports.update = update
exports.deleteData = deleteData
exports.login = login;
exports.register = register;