const Post = require("../models/Post.model");
const User = require("../models/User.model");
const { Model } = require("mongoose");

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
router.get("/posts/create", (req, res) => {

  res.render("posts/post-create")

})

// CREATE: Process form
router.post("/posts/create", (req, res) => {

  const postDetails = {
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    //  author_id: req.session.user._id,

    status: req.body.status,
    name: req.body.name,
    title: req.body.title,
    instrument: req.body.instrument,
    description: req.body.description,
    //   mail: req.body.mail,  //bekommen wir beim Login - req.sessions.email?
    experience: req.body.experience,
    location: req.body.location,
    //   creationDate: req.body.creationDate,
    //   image: req.body.image
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
router.get("/posts/:postId", (req, res) => {
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
router.get("/posts/:postId/edit", (req, res) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((postDetails) => {
      res.render("posts/post-edit", postDetails);
    })
    .catch((error) => {
      console.log("Error getting post details from DB", error);
      next(error);
    })

});


// UPDATE: Process form
/////////bestätigungsnachricht hinzufügen!!!!!!!!!!!!!!!!!!!!
router.post("/posts/:postId/edit", (req, res, next) => {

  const postId = req.params.postId;
  console.log("i'm inside edit post route")
  console.log(req.body);
  const newDetails = {

    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    //    author_id: req.session.user._id,
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
      console.log(edited)
      res.redirect("/posts");
    })
    .catch((error) => {
      console.log("Error updating post in DB", error);
      next(error);
    })


});

//--> check session.user = post.author, if he is allowed to edit/delete
// DELETE: delete post
router.post("/posts/:postId/delete", (req, res) => {
  const { postId } = req.params;

  Post.findByIdAndRemove(postId)
    .then(() => {
      res.redirect('/posts');
    })
    .catch((error) => {
      console.log("Error deleting post from DB", error);
      next(error);
    })

})

module.exports = router;