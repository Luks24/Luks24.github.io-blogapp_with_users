const flash              = require("connect-flash"),
      Blog               =require("../models/blogs"),
      Comment            =require("../models/comment");


const middlewareObject ={}

middlewareObject.checkUserBlog = function (req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                req.flash("error", "Bloged not found.")
                res.redirect("/blogs");
            }else{
                //if user owns blog
                if(foundBlog.author.id.equals(req.user._id)){
                    next(); 
                }else{
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back");
                }   
            };
        });
    }else{
        req.flash("error", "You need to be logged in.")
        res.redirect("back");
    }  
};
middlewareObject.checkUserComment = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                //if user owns comment
                if(foundComment.author.id.equals(req.user._id)){
                    next(); 
                }else{
                    req.flash("error", "You don't have permisson to do that.")
                    res.redirect("back");
                }   
            };
        });
    }else{
        req.flash("error", "You need to be logged in.")
        res.redirect("back");
    }  
};
middlewareObject.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first.")
    res.redirect("/login");
};

module.exports = middlewareObject;