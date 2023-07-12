//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { log } = require("console");
const _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
require('dotenv').config()
app.use(bodyParser.urlencoded({extended: true},{ useNewUrlParser: true }));
app.use(express.static("public"));
//{ useNewUrlParser: true }
if (!process.env.MONGODB) {
  throw new Error("MONGODB is not defined");
}

mongoose.connect(process.env.MONGODB).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.log("Error connecting to MongoDB", error);
});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", async function(req, res){

  try{
    const foundPost=await Post.find({});
    if(foundPost){
      res.render("home", { startingContent: homeStartingContent,posts: foundPost});
    }

  }
  catch(err){
    console.log(err);
  }

  // Post.find({}, function(err, posts){
  //   res.render("home", {
  //     startingContent: homeStartingContent,
  //     posts: posts
  //     });
  // });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose",async function(req, res){
  try{
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
    });
    const savepost=await post.save();
    if(savepost){
      res.redirect("/");
    }
  }
  
  
 catch(err){
  res.status(500).send(err);
 }


  

});

app.get("/posts/:postId",async function(req, res){

const requestedPostId = req.params.postId;
try{

  const foundPost=await Post.findOne({title: requestedPostId});
  // if(foundPost){
    res.render("post", {
      title: foundPost.title,
      content: foundPost.content
    });
  // }
}
catch(error){
  console.log(error);
}

  // Post.findOne({_id: requestedPostId}, function(err, post){
   
  // });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
// app.listen(port);

app.listen(port, function() {
  console.log("Server started on port 3000");
});
