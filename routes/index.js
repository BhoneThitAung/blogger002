var express = require("express");
const Post = require("../models/Post");
var router = express.Router();
var User = require("../models/User"); //using in model
var Comment = require("../models/Comment"); //for comment

/* GET home page. */
router.get("/", function (req, res, next) {
  //more like post to home page
  Post.find({})
    .sort({ like: -1 })
    .limit(5)
    .populate("author", "name")
    .exec(function (err, rtn) {
      if (err) throw err;
      res.render("index", { posts: rtn });
    });
});

//Register

router.get("/register", function (req, res) {
  res.render("register");
});

//Register Data
router.post("/register", function (req, res) {
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.save(function (err, rtn) {
    if (err) throw err;
    console.log(rtn);
    res.redirect("/");
  });
});

//Login

router.get("/login", function (req, res) {
  res.render("login");
});

// login work

router.post("/login", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, rtn) {
    if (err) throw err;
    if (rtn != null && User.compare(req.body.password, rtn.password)) {
      //renember login
      req.session.user = {
        id: rtn._id,
        name: rtn.name,
        email: rtn.email,
      };

      res.redirect("/users");
    } else {
      res.redirect("/login");
    }
  });
});

//duplicate email <start>

router.post("/duplicateEmail", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, rtn) {
    if (err) {
      res.json({
        status: "error",
        error: err,
      });
    } else {
      res.json({
        status: rtn != null ? true : false,
      });
    }
  });
});

// duplicate email <end>

//logout start

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err;
    res.redirect("/");
  });
});

//logout end

//allpost start

router.get("/allpost", function (req, res) {
  Post.find({})
    .populate("author", "name")
    .exec(function (err, rtn) {
      if (err) throw err;
      console.log(rtn);
      res.render("allpost", { posts: rtn });
    });
});

//allpost end

//public post detail

router.get("/postdetail/:pid", function (req, res) {
  Post.findById(req.params.pid)
    .populate("author", "name")
    .exec(function (err, rtn) {
      if (err) throw err;
      // console.log(rtn);
      Comment.find({ post: req.params.pid })
        .populate("commenter", "name")
        .select("commenter comment reply created updated")
        .exec(function (err2, rtn2) {
          if (err2) throw err2;
          console.log(rtn2);

          //like > unlike + follow unfollow

          let reactStatus;
          let favStatus;
          if (req.session.user) {
            reactStatus = rtn.like.filter(function (data) {
              return data.user == req.session.user.id;
            });
            User.findById(req.session.user.id, function (err3, rtn3) {
              if (err3) {
                res.json({
                  status: "error",
                });
              } else {
                favStatus = rtn3.favoriteB.filter(function (data) {
                  return data.blogger == rtn.author._id.toString();
                });
                res.render("postdetail", {
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
            res.render("postdetail", {
              post: rtn,
              comments: rtn2,
              reactStatus: reactStatus,
              favStatus: favStatus,
            });
          }
        });
    });
});

module.exports = router;
