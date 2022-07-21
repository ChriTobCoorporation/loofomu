const Post = require("../models/Post.model");
const User = require("../models/User.model");
const { Model } = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAuthor = require("../middleware/isAuthor");
const session = require("express-session");
const summer = require("../utils/cloudinary")
const router = require("express").Router();
var nodemailer = require('nodemailer')



module.exports = (req, res, next) => {
    // if an already logged in user tries to access the login page it
    // redirects the user to the home page
    if (req.session.user) {
      return res.redirect('/');
    }
    next();
  };
  