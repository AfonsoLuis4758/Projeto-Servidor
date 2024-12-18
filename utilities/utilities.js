var jwt = require("jsonwebtoken");
const User = require("../models/models_user")

let secret = process.env.SECRET

const generateToken = (user_info, callback) => {
  let token = jwt.sign(
    {
      data: user_info,
    },
    secret,
    { expiresIn: "240h" }
  );
  return callback(token);
};

const validateToken = (token, callback) => {
  if (!token) {
    return callback(false, null);
  }
  jwt.verify(token.replace("Bearer ", ""), secret, function (error, decoded) {
    if (error) {
      return callback(false, null);
    }

    let loggedUser = decoded.data.user;

    // Fetch the user object from the database
    User.findOne({ username: loggedUser })
    .then((user) =>{
      return callback(true, user); // Pass the full user object
    })
    .catch((error)=>{
          return callback(false, null)
    })
  });
};

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
  const token = req.headers["authorization"];
  
  validateToken(token, (isValid, user) => {
    if (!isValid) {
      return res.status(403).send("Invalid or missing token");
    }

    if (user.role !== "admin") {
      return res.status(403).send("Access denied: Admins only");
    }

    req.user = user; // Attach user data to the request for further use
    next();
  });
};

exports.generateToken = generateToken;
exports.validateToken = validateToken;
exports.checkAdmin = checkAdmin;

