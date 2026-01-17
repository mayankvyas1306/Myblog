const express = require("express");
const path = require("path");
const userRoute = require("./routes/user.js");
const blogRoute = require("./routes/blog.js");
const connectMongoDB = require('./db.js');
const cookieParser = require("cookie-parser");
const { checkForAuthenticaionCookie } = require("./middlewares/authentication.js");
const Blog = require("./models/blog.js");



const app = express();
const PORT = 8000;


connectMongoDB("mongodb://localhost:27017/blog-app");

app.set('view engine',"ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticaionCookie("token"));

//express doest give static file by its own like from public folder etc so we need to use a middleware to get them
app.use(express.static(path.resolve("./public")));

app.get('/',async(req,res)=>{
    const allBlogs = await (await Blog.find({}));
    res.render('home',{
        user: req.user,
        blogs: allBlogs
    });
});

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.listen(PORT,()=>{
    console.log(`Server started at PORT http://localhost:${PORT}`);
    
})