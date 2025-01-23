const User = require("../models/models_user");
const model = require("../models/models_product");
const utilities = require("../utilities/utilities");
const bcrypt = require("bcrypt");





const login = (req, res) => {
  User.find({ email: req.body.email })
    .then((user) => {
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
        recentSearches: [],
        role: req.body.role || 'user', // Default role is 'user'
        image: ""
      });

      // find duplicate users
      User.find({ email: req.body.email })
        .then((user) => {
          if (user.length > 0) {
            res.status(406).send("Duplicated User");
          } else {
            new_User.save()
              .then(() => {
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



const update = function (req, res) {     //put
  
  let updateData = {
    username: req.body.name,
    gender: req.body.gender,
    address: req.body.address,
    image: req.body.image,
  }

  User.findOneAndUpdate({email : req.params.email}, updateData, { new: true }).then((result) => {
    res.status(200).json(result)
  }).catch((error) => {
    res.status(400).send("Error: " + error)
  })
}

const updatePassword = function (req, res) {     //put for password

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      let updateData = {
        password: hash
      }
      User.findOneAndUpdate({email : req.params.email}, updateData, { new: true }).then((result) => {
        res.status(200).json(result)
      }).catch((error) => {
        res.status(400).send("Error: " + error)
      })
    });
  });

  let updateData = {
    username: req.body.name,
    gender: req.body.gender,
    address: req.body.address,
  }

  User.findOneAndUpdate({email : req.params.email}, updateData, { new: true }).then((result) => {
    res.status(200).json(result)
  }).catch((error) => {
    res.status(400).send("Error: " + error)
  })
}


const deleteData = function (req, res) {                  //delete by id
  User.findOneAndDelete({email : req.params.email}).then((result) => {
    res.status(200).json(result)
  }).catch((error) => {
    res.status(400).send("Error: " + error)
  })
}
const addSearch = function (req, res) {     //put for adding last searches
  User.findOne({email : req.params.email})
    .then((user) => {
      let searchArray = user.recentSearches
      searchArray.push(req.body.search)
      let updateData = {
        recentSearches: searchArray
      }
      User.findOneAndUpdate({email : req.params.email}, updateData , { new: true })
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((error) => {
        res.status(400).send("Error: " + error)
      })
    })
    .catch((error) => {
      res.status(400).send("Error: " + error)
    })
}

const getSearch = function (req, res) {     //put for getting last searches
  User.findOne({email : req.params.email})
    .then((user) => {
      res.status(200).send(user.recentSearches)
    })
    .catch((error) => {
      res.status(400).send("Error: " + error)
    })
}

const listByEmail = function (req, res) {     //to get user
  User.findOne({email : req.params.email})
    .then((user) => {
      res.status(200).send(user)
    })
    .catch((error) => {
      res.status(400).send("Error: " + error)
    })
}

const wishlist =  function (req, res) {     //put for adding/removing wishlist, depending on if it has already been added
  User.findOne({email : req.params.email})
    .then((user) => {
      let wishArray = user.wishlist
      if (wishArray.includes(req.body.wishlist)) {
        wishArray.splice(wishArray.indexOf(req.body.wishlist),1)
      }else{
        wishArray.push(req.body.wishlist)
      }
      let updateData = {
        wishlist: wishArray
      }
      User.findOneAndUpdate({email : req.params.email}, updateData , { new: true })
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((error) => {
        res.status(400).send("Error: " + error)
      })
    })
    .catch((error) => {
      res.status(400).send("Error: " + error)
    })
}

const listWishlist =  function (req, res) {     //to list wishlisted items
  User.findOne({email : req.params.email})
    .then((user) => {
      let wishArray = user.wishlist

      model.Product.find({
        '_id': { $in: wishArray}
      })
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((error) => {
        res.status(400).send("Error: " + error)
      })
    })
    .catch((error) => {
      res.status(400).send("Error: " + error)
    })
}

const listCart =  function (req, res) {     //to list cart items
  User.findOne({email : req.params.email})
    .then((user) => {
      let idArray = []
      user.cart.forEach((object)=> idArray.push(object.id))


      model.Product.find({
        '_id': { $in: idArray}
      })
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((error) => {
        res.status(400).send("Error: " + error)
      })
    })
    .catch((error) => {
      res.status(400).send("Error: " + error)
    })
}


const cart =  function (req, res) {     //put for adding/removing from cart, depending on if it has already been added
  User.findOne({email : req.params.email})
    .then((user) => {
      let cartArray = user.cart
      if (cartArray.some(e => e.id == req.body.id)) {  
        console.log("working")
        cartArray.splice(cartArray.findIndex(e => e.id == req.body.id),1)
      }else{
        cartArray.push({id: req.body.id,quantity: req.body.quantity,color: req.body.color,size: req.body.size})
      }
      let updateData = {
        cart: cartArray
      }
      User.findOneAndUpdate({email : req.params.email}, updateData , { new: true })
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((error) => {
        res.status(400).send("Error: " + error)
      })
    })
    .catch((error) => {
      res.status(400).send("Error: " + error)
    })
}

const cartQuantity = function (req, res) {     
  User.findOne({email : req.params.email})
    .then((user) => {
      let cartArray = user.cart
      let itemIndex = cartArray.findIndex(e => e.id == req.body.id);
      
      if (itemIndex !== -1) {
        cartArray[itemIndex].quantity = req.body.quantity;
      }

      let updateData = {
        cart: cartArray
      };
      User.findOneAndUpdate({email : req.params.email}, updateData , { new: true })
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((error) => {
        res.status(400).send("Error: " + error)
      })
    })
    .catch((error) => {
      res.status(400).send("Error: " + error)
    })
} 

const emptyCart = function (req, res) {     //put for clearing cart after purchase
  User.findOne({email : req.params.email})
    .then((user) => {
      let cartArray = user.cart;
      let updatePromises = cartArray.map(item => {
        return model.Product.findByIdAndUpdate(item.id, { "$inc": { "stock": -item.quantity } });
      });

      Promise.all(updatePromises)
        .then(() => {
          let updateData = {
            cart: []
          };
          User.findOneAndUpdate({email : req.params.email}, updateData, { new: true })
            .then((result) => {
              res.status(200).json(result);
            })
            .catch((error) => {
              res.status(400).send("Error: " + error);
            });
        })
        .catch((error) => {
          res.status(400).send("Error: " + error);
        });
    })
    .catch((error) => {
      res.status(400).send("Error: " + error);
    });
};




exports.listByEmail = listByEmail
exports.update = update
exports.updatePassword = updatePassword
exports.deleteData = deleteData
exports.login = login
exports.register = register
exports.addSearch = addSearch
exports.getSearch = getSearch
exports.wishlist = wishlist
exports.cart = cart
exports.cartQuantity = cartQuantity
exports.listWishlist = listWishlist
exports.listCart = listCart
exports.emptyCart = emptyCart