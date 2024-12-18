const express = require('express');
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT;
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)
const routes_product = require("./routes/routes_product")
const routes_user = require("./routes/routes_user")
const routes_image = require("./routes/routes_image")
const utilities = require("./utilities/utilities");


const auth = function (req, res, next) {
    let exceptions = ["/users/login", "/users/register","products/getproducts"]
    if (exceptions.indexOf(req.url) >= 0) {
        next();
    } else {
        utilities.validateToken(req.headers.authorization, (result, username) => {
            if (result) {
                req.loggedInUser = username;
                next();
            } else {
                res.status(401).send("Invalid Token");
            }
        });
    }
};

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
    console.log("connected")
})

app.use(express.json())
app.use(auth)
app.use(cors())
app.use("/products", routes_product)
app.use("/users", routes_user)
app.use("/images", routes_image)


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

