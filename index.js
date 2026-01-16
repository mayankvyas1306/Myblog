const express = require("express");
const path = require("path");
const userRoute = require("./routes/user.js");
const connectMongoDB = require('./db.js');

const app = express();
const PORT = 8000;


connectMongoDB("mongodb://localhost:27017/blog-app");

app.set('view engine',"ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended: false}));

app.get('/',(req,res)=>{
    res.render('home');
})
app.use('/user',userRoute);
app.listen(PORT,()=>{
    console.log(`Server started at PORT http://localhost:${PORT}`);
    
})