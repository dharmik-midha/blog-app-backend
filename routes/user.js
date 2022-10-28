const express = require("express");
const req = require("express/lib/request");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const SECRET = require("../secret");
const router = express.Router();

router.post("/", (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    req.body.password = hash;
    const user = new User(req.body);
    user
      .save()
      .then((result) => {
        res.status(201).json({
          msg: "User created Successfully! ",
          // data: result
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err.message,
        });
      });
  });
});
router.post("/login", (req, res) => {
  var user = {};
  User.findOne({ email: req.body.email })
    .then((usr) => {
      if (!usr) {
        return;
      }
      user = usr;
      return bcrypt.compare(req.body.password, usr.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({ msg: "Auth failed!" });
      }
      const token = jwt.sign(
        { email: user.email, user_id: user._id, name: user.name },
        SECRET,
        { expiresIn: "3600h" }
      );
      res.status(200).json({ access_token: token, expiresIn: 360000 });
    })
    .catch((err) => {
      return res.status(401).json({ msg: "Auth failed!" });
    });
});

module.exports = router;
