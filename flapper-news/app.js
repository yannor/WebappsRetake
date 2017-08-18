var express = require("express"),
    path = require("path"),
    favicon = require("serve-favicon"),
    logger = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport");
mongoose.connect("mongodb://localhost/news", function(a, b) {
    a ? console.dir(a) : console.log("Connected to /news!")
}), require("./models/Posts"), require("./models/Comments"), require("./models/Users"), require("./config/passport");
var routes = require("./routes/index"),
    users = require("./routes/users");
app.set("views", path.join(__dirname, "views")), app.set("view engine", "ejs"), app.use(logger("dev")), app.use(bodyParser.json()), app.use(bodyParser.urlencoded({
    extended: !1
})), app.use(cookieParser()), app.use(express.static(path.join(__dirname, "public"))), app.use(passport.initialize()), app.use("/", routes), app.use("/users", users), app.use(function(a, b, c) {
    var d = new Error("Not Found");
    d.status = 404, c(d)
}), "development" === app.get("env") && app.use(function(a, b, c, d) {
    c.status(a.status || 500), c.render("error", {
        message: a.message,
        error: a
    })
}), app.use(function(a, b, c, d) {
    c.status(a.status || 500), c.render("error", {
        message: a.message,
        error: {}
    })
}), module.exports = app;
