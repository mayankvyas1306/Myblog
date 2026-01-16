const mongoose = require('mongoose');
const User = require("./models/user.js");

function connectMongoDB(url){
mongoose.connect(url)
    .then(console.log("Mongodb Connected Successfully"));
}
module.exports = connectMongoDB;