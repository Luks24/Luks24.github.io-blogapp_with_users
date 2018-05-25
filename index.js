
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

// Conecting to routes files

const blogRoutes = require("./routes/blogs"),
      commentsRoutes = require("./routes/comments"),
      indexRoutes    = require("./routes/index");

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
//seting currentUser
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
//Using the routes
app.use(blogRoutes);
app.use(commentsRoutes);
app.use(indexRoutes);





/*listening for app

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});

*/


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});