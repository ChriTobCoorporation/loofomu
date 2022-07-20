const Post = require("../models/Post.model");
const session = require("express-session");
const router = require("express").Router();



router.get("/user", (req, res, next) => {

    let allMusicianPosts;

    Post.find()
    .then((postsFromDB) => {
      console.log("begin.......");
      console.log("postsFromDB:");
      console.log(postsFromDB);
      console.log("all postfromDB filtered by status and hardcode id:");

      const allBandPosts = postsFromDB.filter((e) => e.status == "band" && e.author_id == req.session.user._id)
      const allMusicianPosts = postsFromDB.filter((e) => e.status == "musician" && e.author_id == req.session.user._id)

      const currentSession = {
        user: req.session.user,
        allBandPosts,
        allMusicianPosts
      }
console.log("the singleUser:");
      console.log(currentSession);
      res.render("user/user-profile", {currentSession});


    })
    .catch((error) => {
      console.log("Error getting data from DB", error);
      next(error);
    })




});

module.exports = router;