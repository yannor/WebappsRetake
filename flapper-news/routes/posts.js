(function () {
    "use strict";

    var express = require("express");
    var router = express.Router();

    var mongoose = require("mongoose");
    var Post = mongoose.model("Post");
    var Comment = mongoose.model("Comment");
    var User = mongoose.model("User");

    var jwt = require("express-jwt");
    var auth = jwt({
        secret: "SECRET",
        userProperty: "payload"
    });

    // Get all posts
    router.route("/posts")
        .get(function (req, res, next) {
            Post.find(function (err, posts) {
                if (err) {
                    return next(err);
                }

                Post.populate(posts, {
                    path: "author",
                    select: "username"
                }).then(function (posts) {
                    res.json(posts);
                });
            });
        }).post(auth, function (req, res, next) {
            var post = new Post(req.body);
            post.upvotes = 1;
            post.usersWhoUpvoted.push(req.payload._id);

            post.save(function (err, post) {
                if (err) {
                    return next(err);
                }

                Post.populate(post, {
                    path: "author",
                    select: "username"
                }).then(function (post) {
                    res.json(post);
                });
            });
        });


    // Get all posts from a user
    router.route("/users/:user/posts")
        .post(auth, function (req, res, next) {
            var post = new Post(req.body);
            // post.body = req.post;
            //  post.upvotes = 1;
            // post.usersWhoUpvoted.push(req.payload._id);

            post.save(function (err, comment) {
                if (err) {
                    return next(err);
                }

                req.post.posts.push(post);
                req.post.save(function (err, post) {
                    if (err) {
                        return next(err);
                    }

                    Post.populate(post, {
                        path: "author",
                        select: "username"
                    }).then(function (comment) {
                        res.json(comment);
                    });
                })
            })
        });



    // Get single post
    router.route("/posts/:post")
        .get(function (req, res, next) {
            Post.populate(req.post, {
                path: "comments",
            }).then(function (post) {
                Comment.populate(req.post.comments, {
                    path: "author",
                    select: "username"
                }).then(function (comments) {
                    res.json(post);
                });
            });
        }).delete(auth, function (req, res, next) {

            if (req.post.author != req.payload._id) {
                res.statusCode = 401;
                return res.end("invalid authorization");
            }


            Comment.remove({
                post: req.post
            }, function (err) {
                if (err) {
                    return next(err);
                }
                req.post.remove(function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.send("success");
                });
            });
        });

    // Upvote post
    router.route("/posts/:post/upvote")
        .put(auth, function (req, res, next) {
            req.post.upvote(req.payload, function (err, post) {
                if (err) {
                    return next(err);
                }

                Post.populate(post, {
                    path: "author",
                    select: "username"
                }).then(function (post) {
                    res.json(post);
                });
            });
        });

    // Downvote post
    router.route("/posts/:post/downvote")
        .put(auth, function (req, res, next) {
            req.post.downvote(req.payload, function (err, post) {
                if (err) {
                    return next(err);
                }

                Post.populate(post, {
                    path: "author",
                    select: "username"
                }).then(function (post) {
                    res.json(post);
                });
            });
        });

    // Map logic to route parameter 'post'
    router.param("post", function (req, res, next, id) {
        var query = Post.findById(id);

        query.exec(function (err, post) {
            if (err) {
                return next(err);
            }

            if (!post) {
                return next(new Error("can't find post"));
            }

            req.post = post;
            return next();
        });
    });

    module.exports = router;
})();