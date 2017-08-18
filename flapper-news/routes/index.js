var mongoose = require("mongoose"),
    express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    jwt = require("express-jwt"),
    Post = mongoose.model("Post"),
    Comment = mongoose.model("Comment"),
    User = mongoose.model("User"),
    auth = jwt({
        secret: "SECRET",
        userProperty: "payload"
    });
router.get("/", function(a, b) {
    b.render("index")
}), router.get("/posts", function(a, b, c) {
    Post.find(function(a, d) {
        return a ? c(a) : void b.json(d)
    })
}), router.post("/posts", auth, function(a, b, c) {
    var d = new Post(a.body);
    d.author = a.payload.username, d.save(function(a, d) {
        return a ? c(a) : void b.json(d)
    })
}), router.param("post", function(a, b, c, d) {
    var e = Post.findById(d);
    e.exec(function(b, d) {
        return b ? c(b) : d ? (a.post = d, c()) : c(new Error("can't find post"))
    })
}), router.param("comment", function(a, b, c, d) {
    var e = Comment.findById(d);
    e.exec(function(b, d) {
        return b ? c(b) : d ? (a.comment = d, c()) : c(new Error("can't find comment"))
    })
}), router.get("/posts/:post", function(a, b, c) {
    a.post.populate("comments", function(a, c) {
        b.json(c)
    })
}), router.put("/posts/:post/upvote", auth, function(a, b, c) {
    a.post.upvote(function(a, d) {
        return a ? c(a) : void b.json(d)
    })
}), router.put("/posts/:post/downvote", auth, function(a, b, c) {
    a.post.downvote(function(a, d) {
        return a ? c(a) : void b.json(d)
    })
}), router.post("/posts/:post/comments", auth, function(a, b, c) {
    var d = new Comment(a.body);
    d.post = a.post, d.author = a.payload.username, d.save(function(d, e) {
        return d ? c(d) : (a.post.comments.push(e), void a.post.save(function(a, d) {
            return a ? c(a) : void b.json(e)
        }))
    })
}), router.put("/posts/:post/comments/:comment/upvote", auth, function(a, b, c) {
    a.comment.upvote(function(a, d) {
        return a ? c(a) : void b.json(d)
    })
}), router.put("/posts/:post/comments/:comment/downvote", auth, function(a, b, c) {
    a.comment.downvote(function(a, d) {
        return a ? c(a) : void b.json(d)
    })
}), router.post("/register", function(a, b, c) {
    if (!a.body.username || !a.body.password) return b.status(400).json({
        message: "Please fill out all fields"
    });
    var d = new User;
    d.username = a.body.username, d.setPassword(a.body.password), d.save(function(a) {
        return a ? c(a) : b.json({
            token: d.generateJWT()
        })
    })
}), router.post("/login", function(a, b, c) {
    return a.body.username && a.body.password ? (console.log("calling passport)"), void passport.authenticate("local", function(a, d, e) {
        return a ? c(a) : d ? b.json({
            token: d.generateJWT()
        }) : b.status(401).json(e)
    })(a, b, c)) : b.status(400).json({
        message: "Please fill out all fields"
    })
}), module.exports = router;
