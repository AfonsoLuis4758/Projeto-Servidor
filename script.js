const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express();
const port = process.env.PORT;
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)
const routes_product = require("./routes/routes_product")
const routes_user = require("./routes/routes_user")
const utilities = require("./utilities/utilities");


const auth = function (req, res, next) {
    let rejections = [`/user/${req.param.email}`,`/user/password/${req.param.email}`,`/user/searches/${req.param.email}`,"/product/", `/product/${req.param.id}`] //"/user/register","/user/login","/product/products", `/product/products?gender=${req.query.gender}`
    if (rejections.indexOf(req.url) >= 0) {
        utilities.validateToken(req.headers.authorization, (result, email) => {
            if (result) {
                req.loggedInUser = email;
                next();
            } else {
                res.status(401).send("Invalid Token");
            }
        });
    } else {
        next();
    }
};

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
    console.log("connected")
})


app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(auth)
app.use(cors())
app.use("/product", routes_product)
app.use("/user", routes_user)


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

