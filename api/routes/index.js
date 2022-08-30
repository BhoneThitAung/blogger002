var express = require("express");
var router = express.Router();
var Post = require("../../models/Post");
var User = require("../../models/User");
var Comment = require("../../models/Comment");
var jwt = require("jsonwebtoken");

router.get("/", function (req, res) {
  Post.find({})
    .sort({ like: -1 })
    .limit(5)
    .populate("author", "name")
    .exec(function (err, rtn) {
      if (err) {
        res.status(500).json({
          message: "Internal server error",
          error: err,
        });
      } else {
        res.status(200).json({
          message: "Most Like Posts",
          posts: rtn,
        });
      }
    });
});

router.get("/allpost", function (req, res) {
  Post.find({})
    .populate("author", "name")
    .exec(function (err, rtn) {
      if (err) {
        res.status(500).json({
          message: "Internal server error",
          error: err,
        });
      } else {
        res.status(200).json({
          message: "All Post",
          posts: rtn,
        });
      }
    });
});

router.get("/postdetail/:pid", function (req, res) {
  Post.findById(req.params.pid)
    .populate("author", "name")
    .exec(function (err, rtn) {
      if (err) {
        res.status(500).json({
          message: "Internal server error",
          error: err,
        });
      } else {
        Comment.find({ post: req.params.pid })
          .populate("commenter", "name")
          .select("commenter comment reply created updated")
          .exec(function (err2, rtn2) {
            if (err2) {
              res.status(500).json({
                message: "Internal server error",
                error: err2,
              });
            } else {
              //like > unlike + follow unfollow

              let reactStatus;
              let favStatus;
              if (req.session.user) {
                reactStatus = rtn.like.filter(function (data) {
                  return data.user == req.session.user.id;
                });
                User.findById(req.session.user.id, function (err3, rtn3) {
                  if (err3) {
                    res.status.json({
                      message: "Internal server error",
                      error: err3,
                    });
                  } else {
                    favStatus = rtn3.favoriteB.filter(function (data) {
                      return data.blogger == rtn.author._id.toString();
                    });
                    res.status(200).json({
                      message: "Post Detail",
                      post: rtn,
                      comments: rtn2,
                      reactStatus: reactStatus,
                      favStatus: favStatus,
                    });
                  }
                });
              } else {
                reactStatus = [];
                favStatus = [];
                res.status(200).json({
                  message: "Post Detail",
                  post: rtn,
                  comments: rtn2,
                  reactStatus: reactStatus,
                  favStatus: favStatus,
                });
              }
            }
          });
      }
    });
});

router.post("/register", function (req, res) {
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.save(function (err, rtn) {
    if (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    } else {
      res.status(201).json({
        message: "User account created",
      });
    }
  });
});

router.post("/duplicateEmail", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, rtn) {
    if (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    } else {
      res.status(200).json({
        status: rtn != null ? true : false,
      });
    }
  });
});

router.post("/login", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, rtn) {
    if (err) {
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
    if (rtn != null && User.compare(req.body.password, rtn.password)) {
      var token = jwt.sign(
        { id: rtn._id, name: rtn.name, email: rtn.email },
        "djwsoeis",
        { expiresIn: "2h" }
      );
      res.status(200).json({
        message: "Account login success",
        token: token,
      });
    } else {
      res.status(401).json({
        message: "Email or Password not match",
      });
    }
  });
});





module.exports = router;
