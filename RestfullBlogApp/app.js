//RUN npm install express mongoose body-parser ejs method-override express-sanitizer --save 
// Necessary Things To Add, Just Copy and Paste Everytime
// loading modules
var express = require("express");
var methodOverride = require("method-override");
var app = express()
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");

// Setting the environment
mongoose.connect("mongodb://localhost:27017/restfullBlogApp",{ useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// creating schema MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: 		String,
	image: 		{type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB8Mn-UIzcpJQ_sHBBgchv8eewcXojQDkdnVmNA0e0SWqxrQd1KQ&s"},
	body:  		String,
	author: 	String,
	created: 	{type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Creating a sample Blog and adding to database
// After creating, comments it out to prevent adding it everytime we run the code
// Blog.create({
// 	title: "Welcome to the world of Machine Learning",
// 	image: "https://cdn3.datascience.berkeley.edu/content/ce8da8979df641eebae4b0837f6a54fd/4430_whatismachinelearning_hero.jpg",
// 	body:  "Hello this is a blog post!!! will edit later",
// })

// ALL THE RESTFUL ROUTES ARE AS FOLLOWS
app.get("/", function(req, res){
	res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		}else{
			console.log("running!!!");
			res.render("index", {blogs: blogs});
		}
	});
});

// NEW ROUTE 
app.get("/blogs/new", function(req, res){
	res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	// 	Create Blog
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}else{
			// 	Then redirect to the blog page
			res.redirect("/blogs");
		}
	})
})

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect('/blogs');
		}else{
			res.render("show", {blog: foundBlog});
		}
	});
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit", {blog: foundBlog});
		}
	});
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+ req.params.id);
		}
	});
});

// DESTROY ROUTE
app.delete("/blogs/:id", function(req, res){
	//Destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
			console.log(err);
		}else{
			//Redirect somewhere 
			res.redirect("/blogs");
		}
	});	
});


// Setting the server and checking it
app.listen(3000, function(){
	console.log("server running on port 3000");
	console.log("Happy Coding!!!!");
});