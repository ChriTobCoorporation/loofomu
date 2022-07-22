const Post = require("../models/Post.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const summer = require("../utils/cloudinary")
const router = require("express").Router();
var nodemailer = require('nodemailer');
const { Session } = require("express-session");
// READ: List all posts + filter band/musicians by query
router.get("/posts", (req, res, next) => {
  Post.find()
    .then((postsFromDB) => {
      const filteredData = postsFromDB.filter(function(post) {
        for (let key in req.query) {
          if (post[key] === undefined || post[key] != req.query[key])
            return false;
        }
        return true;
      });
      res.render("posts/posts-list", {postsArr : filteredData});
    })
    .catch((error) => {
      console.log("Error getting data from DB", error);
      next(error);
    })
});
router.post("/posts", (req, res, next) => {
 const test =new URLSearchParams(req.body).toString()
 res.redirect(`/posts/?${test}`);
});
// CREATE: Render form
router.get("/posts/create", isLoggedIn, (req, res, next) => {
  res.render("posts/post-create")
})
// CREATE: Process form
router.post("/posts/create", summer.single("image"), isLoggedIn,  (req, res, next) => {
let {author_id, image, name, status, title, genre, instrument, experience, description, location, email} = req.body
if(Object.keys(req).includes("file")) {image = req.file.path}
email = req.session.user.email
author_id = req.session.user._id
Post.create({
    author_id,
    image,
    name,
    status,
    title,
    genre,
    instrument,
    experience,
    description,
    location,
    email,
  })
    .then(() => {
     res.redirect(`/posts/?status=${status}`);
    })
    .catch((error) => {
      console.log("Error creating post in the DB", error);
      next(error);
    })
})
// READ: get details
router.get("/posts/:postId", (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((postDetails) => {
      postDetails.session = req.session
      res.render("posts/post-details", postDetails);
    })
    .catch((error) => {
      console.log("Error getting post details from DB", error);
      next(error);
    })
})
// UPDATE: Render form
router.get("/posts/:postId/edit",  isLoggedIn, (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((postDetails) => {
       if (req.session.user._id == postDetails.author_id) {
        res.render("posts/post-edit", postDetails);
       } else {
        res.send("not allowed")
       }
    })
    .catch((error) => {
      console.log("Error getting post details from DB", error);
      next(error);
    })
});
// UPDATE: Process form
router.post("/posts/:postId/edit", summer.single("image"), isLoggedIn,  (req, res, next) => {
  const postId = req.params.postId
  let {author_id, image, name, status, title, genre, instrument, experience, description, location, email} = req.body
  status = req.body.status
  if(Object.keys(req).includes("file")) {image = req.file.path}
  author_id = req.session.user._id
  Post.findByIdAndUpdate(postId, {
    author_id,
    image,
    name,
    status,
    title,
    genre,
    instrument,
    experience,
    description,
    location,
    email
  })
    .then(() => {
      res.redirect(`/posts/?status=${status}`);
    })
    .catch((error) => {
      console.log("Error updating post in DB", error);
      next(error);
    })
});
router.post("/posts/:postId/delete", isLoggedIn, (req, res, next) => {
  const {postId} = req.params;
  Post.findById(postId)
  .then((post) => {
   if(req.session.user._id == post.author_id)
   return Post.findByIdAndRemove(postId)
  })
  .then((removedPost)=> {
    res.redirect(`/posts/?status=${removedPost.status}`);
  })
  .catch( (error) => {
    console.log("Error deleting post from DB", error);
    next(error);
  })
})
//sending an email to author of the post.
router.post("/posts/:postId/contact", isLoggedIn, (req, res, next) => {
  const postId = req.params.postId
  let {emailAuthor, subject, message } = req.body
  Post.findById(postId)
  .then((foundPost) => {
  let transporter = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
      user: process.env.USERMAIL,
      pass: process.env.USERPW

    }
  })
  transporter.sendMail({
    from: `"LOOFOMU" <maxtobiasconrad@hotmail.com>`,
    to: foundPost.email,
    subject: `message from: ${emailAuthor} subject: ${subject}`,
    text: message,
    html: `<b>${message}</b>`
  })
  })
  .then(info => {
    res.redirect("/")
})
  .catch(error => console.log(error))
})

module.exports = router;