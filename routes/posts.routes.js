const Post = require("../models/Post.model");
const User = require("../models/User.model");
const { Model } = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAuthor = require("../middleware/isAuthor");
const session = require("express-session");
const summer = require("../utils/cloudinary")
const router = require("express").Router();


// READ: List all posts + filter band/musicians by query
router.get("/posts", (req, res, next) => {

  Post.find()
    .then((postsFromDB) => {
      const filteredData = postsFromDB.filter((e) => e.status == req.query.status)
      res.render("posts/posts-list", {postsArr : filteredData});
    })
    .catch((error) => {
      console.log("Error getting data from DB", error);
      next(error);
    })
});


// CREATE: Render form
router.get("/posts/create", isLoggedIn, (req, res, next) => {
  res.render("posts/post-create")
})

// CREATE: Process form
router.post("/posts/create", summer.single("image"), isLoggedIn,  (req, res, next) => {

let {author_id, image, name, status, title, genre, instrument, experience, description, location, email} = req.body
console.log(req.body)
if(req.file.path.length() >0) {image = req.file.path}


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

    .then((element) => {
console.log(element, "hi")
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
      const data = {
        postDetails: postDetails
      };
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
       if (req.session.user._id !== postDetails.author_id) {
        res.render("posts/post-edit", postDetails);
       }
    })
    .catch((error) => {
      console.log("Error getting post details from DB", error);
      next(error);
    })

});


// UPDATE: Process form
/////////bestätigungsnachricht hinzufügen!!!!!!!!!!!!!!!!!!!!
router.post("/posts/:postId/edit", summer.single("image"), isLoggedIn,  (req, res, next) => {
  console.log("xxxxxxxxxxxxxx", req.file)
  const postId = req.params.postId
  let {author_id, image, name, status, title, genre, instrument, experience, description, location, email} = req.body
  console.log(req.body)
  status = req.body.status[status.length - 1]
  if(req.file.path) image = req.file.path

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
    .then((edited) => {
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
    (req.session.user._id == post.author_id)
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



module.exports = router;