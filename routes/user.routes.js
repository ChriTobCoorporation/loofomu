const Post = require("../models/Post.model");
const session = require("express-session");
const router = require("express").Router();



router.get("/user", (req, res, next) => {
    Post.find()
    .then((postsFromDB) => {
      console.log(postsFromDB);

      const allBandPosts = postsFromDB.filter((e) => e.status == "Band" && e.author_id == req.session.user._id)
      const allMusicianPosts = postsFromDB.filter((e) => e.status == "Musician" && e.author_id == req.session.user._id)

      const currentSession = {
        user: req.session.user,
        allBandPosts,
        allMusicianPosts
      }
      res.render("user/user-profile", {currentSession});
    })
    .catch((error) => {
      console.log("Error getting data from DB", error);
      next(error);
    })
});

module.exports = router;