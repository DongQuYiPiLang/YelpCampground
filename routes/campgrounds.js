var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// INDEX
router.get("/", function(req,res){
    Campground.find({}, function(err, campgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// CREATE
router.post("/", isLoggedIn, function(req,res){
    // get data from form and add to campgrounds array
    // redirect
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author: author};
    Campground.create(newCampground,function(err, campground){
        if (err) {
            console.log(err);  
        } else {
            res.redirect("campgrounds");
        }
    });
    //campgrounds.push({name: name, image: image});
});

// NEW
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW
router.get("/:id", function(req, res) {
    var id = req.params.id;
    // find campgorund match id, and show details of the campground
    Campground.findById(id).populate("comments").exec(function (err, foundCampground) {
        // body...
        if (err) {
            console.log(err);
        } else {
            //console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
    
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});

        }
    });
    
});

// UPDATE ROUTE
router.put("/:id", checkCampgroundOwnership, function (req,res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if (err) {
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id)
       }
    });  
});

// DESTROY ROUTE
router.delete("/:id", checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds")
        }
    })
})

// middleware
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }    
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        // does user own the campground
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;