
const hostname = '127.0.0.1';
const port = 3000;

// requiring the different packages
const express            = require("express"),
      mongoose           = require("mongoose"),
      bodyParser         = require("body-parser"),
      ejs                = require("ejs"),
      app                = express(),
      methodOverride     = require("method-override"),
      expressSanitizer   = require("express-sanitizer"),
//model required
      Blog               =require("./models/blogs"),
      Comment            =require("./models/comment"),
      User               =require("./models/user"),
//Requirements for authentication
      passport           =require("passport"),
      LocalStrategy      =require("passport-local");


// connecting to database
mongoose.connect("mongodb://localhost/blog_web_app");
//set ejs for view
app.set("view engine", "ejs");
//set express for serving our style sheet
app.use(express.static(__dirname + "/public"));
// get the app to use body parser
app.use(bodyParser.urlencoded({extended: true}));
//Use sanitizer to prevent script from runing when adding to blog body
app.use(expressSanitizer());
//use method override for put and delete request
app.use(methodOverride("_method"));

//Setting up passport for users
app.use(require("express-session")({
    secret: "this is the secret for the password",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});



//Routes
app.get("/", function(req, res){
    res.render("first");
});

// render blogs page and get all blogs data and pass it to blog
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("err");
        }else{
            res.render("blogs/blog", {blogs: blogs}); 
        }
    });
});

//NEW route

app.get("/blogs/new", function(req, res){
    res.render("blogs/new");
});

//CREATE route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
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
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});

//EDIT route

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("blogs/edit", {blog: foundBlog});
        };
    });
});

//UPDATE route
app.put("/blogs/:id", function(req, res){
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
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});
/////////////////////////////////
////////////////////////////////
//Comment routes

//NEW comment route

app.get("/blogs/:id/comments/new",isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new", {blog: blog});
        }
    });
    
});

app.post("/blogs/:id/comments",isLoggedIn, function(req, res){
    Blog.findById(req.params.id,function(err, blog){
        if(err){
            res.redirect("/blogs");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    blog.comments.push(comment);
                    blog.save();
                    res.redirect("/blogs/" + blog._id)
                }
            })
        }
    })
});

//Authorization routes

app.get("/register", function(req, res){
    res.render("register");
});

//post route for sign up
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
    res.render("login");
});
//post route for Login
app.post("/login",passport.authenticate("local",{successRedirect: "/blogs", failureRedirect: "/login"}), function(req, res){

});
//logout route
app.get("/logout", function(req, res){
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

/*listening for app

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});

*/


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});