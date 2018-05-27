const express  = require("express"),
      router   = express.Router(),
      Blog               =require("../models/blogs"),
      middleware         =require("../middleware");

// render blogs page and get all blogs data and pass it to blog
router.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("err");
        }else{
            res.render("blogs/blog", {blogs: blogs}); 
        }
    });
});

//NEW route

router.get("/blogs/new", middleware.isLoggedIn, function(req, res){
    res.render("blogs/new");
});

//CREATE route
router.post("/blogs", middleware.isLoggedIn,function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    const  title  = req.body.blog.title,
           image  = req.body.blog.image,
           body   = req.body.blog.body,
           author = {
                id: req.user._id,
                username: req.user.username
           };
    const newBlogPost = {title:title, image: image, body: body, author: author}
    //create blog
    Blog.create(newBlogPost, function(err, newBlog){
        if(err){
            //if error show new page again
            res.render("blogs/new");
        }else{
            //if it works go back to blogs
            res.redirect("/blogs");
        }
    })
});

//SHOW route
//the function looks for blog id and if found it renders show.ejs and passes blog data in
router.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});

//EDIT route

router.get("/blogs/:id/edit",middleware.checkUserBlog, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("blogs/edit", {blog: foundBlog});  
        }      
    });   
});

//UPDATE route
router.put("/blogs/:id",middleware.checkUserBlog, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE route
router.delete("/blogs/:id",middleware.checkUserBlog, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

module.exports = router;