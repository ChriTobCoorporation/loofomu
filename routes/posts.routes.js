const Post = require("../models/Post.model");
const Author = require("../models/Author.model");
const { Model } = require("mongoose");

const router = require("express").Router();


// READ: List all posts
router.get("/posts", (req, res, next) => {
  Post.find()
    .then( (postsFromDB) => {
      const data = {
        postsArr: postsFromDB
      };
      res.render("posts/posts-list", data);
    })
    .catch( (error) => {
      console.log("Error getting data from DB", error);
      next(error);
    })
});


// CREATE: Render form
router.get("/posts/create", (req, res) => {

  Post.find()
    .then( postsArr => {
      res.render("posts/post-create", {postsArr});
    })
    .catch( (error) => {
      console.log("Error getting authors from DB", error);
      next(error);
    })

  
})

// CREATE: Process form
router.post("/posts/create", (req, res) => {

  const postDetails = {
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    author_id: req.session.user._id,

    status: req.body.status,
    name: req.body.name,
    lookingForTitle: req.body.lookingForTitle,
    instrument: req.body.instrument,
    description: req.body.description,
    mail: req.body.mail,
    experience: req.body.experience,
    location: req.body.location,
    creationDate: req.body.creationDate,
    image: req.body.image
  };

  Post.create(postDetails)
    .then( () => {
      res.redirect("/posts");
    })
    .catch( (error) => {
      console.log("Error creating post in the DB", error);
      next(error);
    })
})

// READ: post details
router.get("/posts/:postId", (req, res) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then( (postDetails) => {
      res.render("posts/post-details", postDetails);
    })
    .catch( (error) => {
      console.log("Error getting post details from DB", error);
      next(error);
    })

})


//--> check session.user = post.author, if he is allowed to edit/delete
// UPDATE: Render form
router.get("/posts/:postId/edit", (req, res) => {
  const {postId} = req.params;

  Post.findById(postId)
    .then( (postDetails) => {
      res.render("posts/post-edit", postDetails);
    })
    .catch( (error) => {
      console.log("Error getting post details from DB", error);
      next(error);
    })

});


// UPDATE: Process form
router.post("/post/:postId/edit", (req, res) => {

  const postId = req.params.postId;

  const newDetails = {

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    author_id: req.session.user._id,

    status: req.body.status,
    name: req.body.name,
    lookingForTitle: req.body.lookingForTitle,
    instrument: req.body.instrument,
    description: req.body.description,
    mail: req.body.mail,
    experience: req.body.experience,
    location: req.body.location,
    creationDate: req.body.creationDate,
    image: req.body.image
  }


  Post.findByIdAndUpdate(postId, newDetails)
    .then( () => {
        //or maybe to the updated post??
      res.redirect("/posts");
    })
    .catch( (error) => {
      console.log("Error updating post in DB", error);
      next(error);
    })


});

//--> check session.user = post.author, if he is allowed to edit/delete
// DELETE: delete post
router.post("/posts/:postId/delete", (req, res) => {
  const {postId} = req.params;

  Post.findByIdAndRemove(postId)
    .then( () => {
      res.redirect('/posts');
    })
    .catch( (error) => {
      console.log("Error deleting post from DB", error);
      next(error);
    })

})

module.exports = router;