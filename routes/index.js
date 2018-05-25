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
            console.log(err)
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
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
    res.redirect("/blogs");
})

//middlewear

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;