const express  = require("express"),
      router   = express.Router(),

      Blog               =require("../models/blogs"),
      Comment            =require("../models/comment");

//Comment routes

//NEW comment route

router.get("/blogs/:id/comments/new",isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new", {blog: blog});
        }
    });
    
});

router.post("/blogs/:id/comments",isLoggedIn, function(req, res){
    Blog.findById(req.params.id,function(err, blog){
        if(err){
            res.redirect("/blogs");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    blog.comments.push(comment);
                    blog.save();
                    res.redirect("/blogs/" + blog._id)
                }
            })
        }
    })
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;