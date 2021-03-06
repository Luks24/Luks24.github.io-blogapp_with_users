const express  = require("express"),
      router   = express.Router(),
      User               =require("../models/user"),
      passport           =require("passport");



//Routes
router.get("/", function(req, res){
    res.render("first");
});


/////////////////////////////////
////////////////////////////////


//Authorization routes

router.get("/register", function(req, res){
    res.render("register");
});

//post route for sign up
router.post("/register", function(req, res){
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
          }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "You registered successfuly.")
            res.redirect("/blogs");
        })
    })
})

//Login templet
router.get("/login", function(req, res){
    res.render("login");
});
//post route for Login
router.post("/login",passport.authenticate("local",{successRedirect: "/blogs", failureRedirect: "/login"}), function(req, res){

});
//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out.")
    res.redirect("/blogs");
})


module.exports = router;