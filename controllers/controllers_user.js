const User = require("../models/models_user");
const utilities = require("../utilities/utilities");
const bcrypt = require("bcrypt");


//get
const list = function (req, res) {

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
        role: req.body.role || 'user' // Default role is 'user'
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
  User.findByIdAndDelete(req.params.id).then((result) => {
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

const listByEmail = function (req, res) {     //put for getting last searches
  User.findOne({email : req.params.email})
    .then((user) => {
      res.status(200).send(user)
    })
    .catch((error) => {
      res.status(400).send("Error: " + error)
    })
}


exports.list = list
exports.listByEmail = listByEmail
//exports.create = create
exports.update = update
exports.updatePassword = updatePassword
exports.deleteData = deleteData
exports.login = login;
exports.register = register;
exports.addSearch = addSearch;
exports.getSearch = getSearch;