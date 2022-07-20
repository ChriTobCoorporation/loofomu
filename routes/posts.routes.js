const Post = require("../models/Post.model");
const User = require("../models/User.model");
const { Model } = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAuthor = require("../middleware/isAuthor");
const session = require("express-session");
const summer = require("../utils/cloudinary")
const router = require("express").Router();
//const nodemailer = require("../config/index")
var nodemailer = require('nodemailer')

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
console.log("xxxxxxxxxxxxxx")

let {author_id, image, name, status, title, genre, instrument, experience, description, location, email} = req.body
console.log(req.body)
//image = req.file.path
email = req.session.user.email
console.log("email:" ,email)
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


//--> check session.user = post.author, if he is allowed to edit/delete
// UPDATE: Render form
router.get("/posts/:postId/edit",  isLoggedIn, (req, res, next) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((postDetails) => {
//      console.log("huhu", req.session.user._id, "haha", postDetails.author_id.toString())
       if (req.session.user._id !== postDetails.author_id) {
        res.render("posts/post-edit", postDetails);
       }
       //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX add some response
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
  image = req.file.path
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

// router.post("/posts/:postId/contact", isLoggedIn, (req, res, next) => {
//   console.log(req.body, "huhu")
//   const postId = req.params.postId
//   let {emailAuthor, subject, message } = req.body
//   Post.findById(postId)
//   .then((foundPost) => {
//     console.log(foundPost)
//   let transporter = nodemailer.createTransport({
//     service: 'Yahoo',
//     auth: {
//       user: 'max.tobiasconrad@yahoo.com',
//       pass: 'Z^wm3V2Tzybe'
//     }
//   })
//   console.log(foundPost.email)
//   transporter.sendMail({
//     from: `"LOOFOMU" <max.tobias.conrad@gmail.com>`, // replace with variables
//     to: "maktub1006@gmail.com", 
//     subject: subject, 
//     text: message,
//     html: `<b>${message}</b>`
//   })
//   })
//   .then(info => {
//     console.log(info)
//     res.redirect("/")
// })
//   .catch(error => console.log(error))
// })

router.post('/posts/:postId/contact', (req, res, next) => {
  let { emailSender, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'Hotmail',
        auth: {
           user: 'maxtobiasconrad@hotmail.com',
           pass: 'Lilalila1' 
    }
  });
  transporter.sendMail({
    from: '"My Awesome Project " <maxtobiasconrad@hotmail.com>',
    to: "maktub1006@gmail.com", 
    subject: subject, 
    text: message,
    html: `<b>${message}</b>`
  })
  .then(info => console.log('message', {subject, message, info}))
  .catch(error => console.log(error));
});


module.exports = router;