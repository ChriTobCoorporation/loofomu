module.exports = (req, res, next) => {
    // checks if the user is logged in when trying to access a specific page
console.log(req.session.user._id ,"");
console.log(req.body);

    if (req.session.user._id !== req.body.author_id) {
      return res.redirect("/login");
    }
    next();
  };
  