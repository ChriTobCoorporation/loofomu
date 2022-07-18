const Post = require("../models/Post.model");
const User = require("../models/User.model");
const { Model } = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAuthor = require("../middleware/isAuthor");
const session = require("express-session");

const router = require("express").Router();


// READ: List all posts
router.get("/posts", (req, res, next) => {
  Post.find()
    .then((postsFromDB) => {
      const data = {
        postsArr: postsFromDB
      };
      res.render("posts/posts-list", data);
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
router.post("/posts/create", isLoggedIn, (req, res, next) => {

  const postDetails = {
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    author_id: req.session.user._id,
    image: req.body.image,
    name: req.body.name,
    status: req.body.status,
    title: req.body.title,
    genre: req.body.genre,
    instrument: req.body.instrument,
    experience: req.body.experience,
    description: req.body.description,
    location: req.body.location,
    email: req.body.email,
  };

  Post.create(postDetails)
    .then(() => {
      res.redirect("/posts");
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


//--> check session.user = post.author, if he is allowed to edit/delete
// UPDATE: Render form
router.get("/posts/:postId/edit", isLoggedIn, (req, res, next) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((postDetails) => {
       if (req.session.user._id == postDetails.author_id) {
        res.render("posts/post-edit", postDetails);
       }
       //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    })
    .catch((error) => {
      console.log("Error getting post details from DB", error);
      next(error);
    })

});


// UPDATE: Process form
/////////bestätigungsnachricht hinzufügen!!!!!!!!!!!!!!!!!!!!
router.post("/posts/:postId/edit", isLoggedIn, (req, res, next) => {

  const postId = req.params.postId;
  console.log(req.session);
  const newDetails = {

    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    author_id: req.session.user._id,
    image: req.body.image,
    name: req.body.name,
    status: req.body.status,
    title: req.body.title,
    genre: req.body.genre,
    instrument: req.body.instrument,
    experience: req.body.experience,
    description: req.body.description,
    location: req.body.location,
    email: req.body.email,
  }


  Post.findByIdAndUpdate(postId, newDetails)
    .then((edited) => {
      //or maybe to the updated post??
      res.redirect("/posts");
    })
    .catch((error) => {
      console.log("Error updating post in DB", error);
      next(error);
    })


});

//--> check session.user = post.author, if he is allowed to edit/delete
// DELETE: delete post
router.post("/posts/:postId/delete", isLoggedIn, (req, res, next) => {
  const { postId } = req.params;
///XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  Post.findById(postId)
    .then((post)=>{
      if (req.session.user._id == post.author_id) {
        Post.deleteById(postId)
      }
    })
    .catch((error) => {
      console.log("Error deleting post from DB", error);
      next(error);
    })
})

module.exports = router;