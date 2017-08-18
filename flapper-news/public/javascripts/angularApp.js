var app = angular.module("flapperNews", ["ui.router"]);
app.config(["$stateProvider", "$urlRouterProvider", function(a, b) {
    a.state("home", {
        url: "/home",
        templateUrl: "/home.html",
        controller: "MainCtrl",
        resolve: {
            postPromise: ["posts", function(a) {
                return a.getAll()
            }]
        }
    }).state("posts", {
        url: "/posts/:id",
        templateUrl: "/posts.html",
        controller: "PostsCtrl",
        resolve: {
            post: ["$stateParams", "posts", function(a, b) {
                return b.get(a.id)
            }]
        }
    }).state("login", {
        url: "/login",
        templateUrl: "/login.html",
        controller: "AuthCtrl",
        onEnter: ["$state", "auth", function(a, b) {
            b.isLoggedIn() && a.go("home")
        }]
    }).state("register", {
        url: "/register",
        templateUrl: "/register.html",
        controller: "AuthCtrl",
        onEnter: ["$state", "auth", function(a, b) {
            b.isLoggedIn() && a.go("home")
        }]
    }), b.otherwise("home")
}]), app.factory("auth", ["$http", "$window", function(a, b) {
    var c = {};
    return c.saveToken = function(a) {
        b.localStorage["flapper-news-token"] = a
    }, c.getToken = function() {
        return b.localStorage["flapper-news-token"]
    }, c.isLoggedIn = function() {
        var a = c.getToken();
        if (a) {
            var d = JSON.parse(b.atob(a.split(".")[1]));
            return d.exp > Date.now() / 1e3
        }
        return !1
    }, c.currentUser = function() {
        if (c.isLoggedIn()) {
            var a = c.getToken(),
                d = JSON.parse(b.atob(a.split(".")[1]));
            return d.username
        }
    }, c.register = function(b) {
        return a.post("/register", b).success(function(a) {
            c.saveToken(a.token)
        })
    }, c.logIn = function(b) {
        return a.post("/login", b).success(function(a) {
            c.saveToken(a.token)
        })
    }, c.logOut = function() {
        b.localStorage.removeItem("flapper-news-token")
    }, c
}]), app.factory("posts", ["$http", "auth", function(a, b) {
    var c = {
        posts: []
    };
    return c.getAll = function() {
        return a.get("/posts").success(function(a) {
            angular.copy(a, c.posts)
        })
    }, c.create = function(d) {
        return a.post("/posts", d, {
            headers: {
                Authorization: "Bearer " + b.getToken()
            }
        }).success(function(a) {
            c.posts.push(a)
        })
    }, c.upvote = function(c) {
        return a.put("/posts/" + c._id + "/upvote", null, {
            headers: {
                Authorization: "Bearer " + b.getToken()
            }
        }).success(function(a) {
            c.upvotes += 1
        })
    }, c.downvote = function(c) {
        return a.put("/posts/" + c._id + "/downvote", null, {
            headers: {
                Authorization: "Bearer " + b.getToken()
            }
        }).success(function(a) {
            c.upvotes -= 1
        })
    }, c.get = function(b) {
        return a.get("/posts/" + b).then(function(a) {
            return a.data
        })
    }, c.addComment = function(c, d) {
        return a.post("/posts/" + c + "/comments", d, {
            headers: {
                Authorization: "Bearer " + b.getToken()
            }
        })
    }, c.upvoteComment = function(c, d) {
        return a.put("/posts/" + c._id + "/comments/" + d._id + "/upvote", null, {
            headers: {
                Authorization: "Bearer " + b.getToken()
            }
        }).success(function(a) {
            d.upvotes += 1
        })
    }, c.downvoteComment = function(c, d) {
        return a.put("/posts/" + c._id + "/comments/" + d._id + "/downvote", null, {
            headers: {
                Authorization: "Bearer " + b.getToken()
            }
        }).success(function(a) {
            d.upvotes -= 1
        })
    }, c
}]), app.controller("MainCtrl", ["$scope", "posts", "auth", function(a, b, c) {
    a.posts = b.posts, a.isLoggedIn = c.isLoggedIn, a.title = "", a.addPost = function() {
        "" !== a.title && (b.create({
            title: a.title,
            link: a.link
        }), a.title = "", a.link = "")
    }, a.upvote = function(a) {
        console.log("Upvoting:" + a.title + "votes before:" + a.upvotes), b.upvote(a)
    }, a.downvote = function(a) {
        b.downvote(a)
    }
}]), app.controller("PostsCtrl", ["$scope", "posts", "post", "auth", function(a, b, c, d) {
    a.post = c, a.isLoggedIn = d.isLoggedIn, a.addComment = function() {
        "" !== a.body && (b.addComment(c._id, {
            body: a.body,
            author: "user"
        }).success(function(b) {
            a.post.comments.push(b)
        }), a.body = "")
    }, a.upvote = function(a) {
        b.upvoteComment(c, a)
    }, a.downvote = function(a) {
        b.downvoteComment(c, a)
    }
}]), app.controller("AuthCtrl", ["$scope", "$state", "auth", function(a, b, c) {
    a.user = {}, a.register = function() {
        c.register(a.user).error(function(b) {
            a.error = b
        }).then(function() {
            b.go("home")
        })
    }, a.logIn = function() {
        c.logIn(a.user).error(function(b) {
            a.error = b
        }).then(function() {
            b.go("home")
        })
    }
}]), app.controller("NavCtrl", ["$scope", "auth", function(a, b) {
    a.isLoggedIn = b.isLoggedIn, a.currentUser = b.currentUser, a.logOut = b.logOut
}]);
