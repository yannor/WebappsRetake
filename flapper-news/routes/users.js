(function() {
  "use strict";
  
  var express = require("express");
  var router = express.Router();

  var mongoose = require("mongoose");
  var User = mongoose.model("User");

  var jwt = require("express-jwt");
  var auth = jwt({
    secret: "SECRET",
    userProperty: "payload"
  });

 // Get all users
  router.route("/users")
    .get(auth, function(request, response, next) {
      User.find(function(err, users) {
        if (err) {
          return next(err);
        }

        response.json(users);
      });
    });

    // Get 1 user
  router.route("/users/:user")
    .get(auth, function(request, response, next) {
      response.json(request.user);
    });

    
    // Map logic
  router.param("user", function(request, response, next, id) {
    var query = User.findById(id);

    query.exec(function(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(new Error("can't find user"));
      }

      request.user = user;
      return next();
    });
  });

  module.exports = router;
})();
