const Blog               =require("../models/blogs"),
      Comment            =require("../models/comment");


const middlewareObject ={}

middlewareObject.checkUserBlog = function (req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/blogs");
            }else{
                //if user owns blog
                if(foundBlog.author.id.equals(req.user._id)){
                    next(); 
                }else{
                    res.redirect("back");
                }   
            };
        });
    }else{
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
                    res.redirect("back");
                }   
            };
        });
    }else{
        res.redirect("back");
    }  
};
middlewareObject.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObject;