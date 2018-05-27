const express  = require("express"),
      router   = express.Router(),

      Blog               =require("../models/blogs"),
      Comment            =require("../models/comment");
      middleware         =require("../middleware")

//Comment routes

//NEW comment route

router.get("/blogs/:id/comments/new",middleware.isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new", {blog: blog});
        }
    });
    
});
//crate route
router.post("/blogs/:id/comments",middleware.isLoggedIn, function(req, res){
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
//edit
router.get("/blogs/:id/comments/:comment_id/edit",middleware.checkUserComment, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit", {blog_id: req.params.id, comment: foundComment});
        }
    })
});
//update
router.put("/blogs/:id/comments/:comment_id",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/blogs/" + req.params.id )
        }
    })
});

//destroy route
router.delete("/blogs/:id/comments/:comment_id",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

module.exports = router;