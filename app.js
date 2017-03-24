var express             = require("express");
var app                 = express();
var bodyParser          = require("body-parser");
var mongoose            = require("mongoose");
var flash               = require("connect-flash");
var passport            = require("passport");
var LocalStrategy       = require("passport-local");
var methodOverride      = require("method-override");
var Campground          = require("./models/campground");
var Comment             = require("./models/comment");
var User                = require("./models/user");
var seedDB              = require("./seeds");
// requiring routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    authRoutes          = require("./routes/index");
    
//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://mike:11111@ds141410.mlab.com:41410/yelp_camp");
//mongodb://mike:11111@ds141410.mlab.com:41410/yelp_camp
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "this is a secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//RESTful ROUTES
app.get("/", function(req,res){
    res.render("landing"); 
        
});



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Started!!"); 
});