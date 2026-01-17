const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require('mongoose')
const mongoose = require('mongoose');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName:{
        type: String,
        required: true,
    },
    email: {
        type:String,
        required: true,
        unique: true,
    },
    // We have to store password in hash so we have to do so using salt whis is of type string
    salt:{
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL:{
        type:String,
        default: '/images/default.png',
    },
    role:{
        type: String,
        //enum are used like we can assign values only if it is present in the enum
        enum: ['USER','ADMIN'],
        default: "USER"
    }

},{timestamps:true});

//Know to crypt the current password we will use crypto package of nodejs 
//to implement the cypt password we will use pre middleware

//pre middleware will tell that whenever you save in schema run the callback function
//in callback we have normal function not arrow function because we have to use 'this' keyword
userSchema.pre("save",function (){
    
    //if password is not modified the simply retun it
    if(!this.isModified("password")) return ;
    //create a salt which is just random string of bytes
    const salt= randomBytes(16).toString();
    
    //createing hashed password using createHmac function which is taking two arguments that are
    //algoritham to use and the field to change i.e. salt
    const hashedPassword = createHmac("sha256",salt)
        .update(this.password)
        .digest("hex");

    //updating the user object
    this.salt=salt;
    this.password = hashedPassword;

});

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    const user = await this.findOne({email});

    if(!user) throw new Error('User Not Found!');

    const salt = user.salt;

    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256",salt)
        .update(password)
        .digest("hex");

    if(hashedPassword!==userProvidedHash){
        throw new Error('Password Not Matched');
    }
   
    const token = createTokenForUser(user);
    return token;

})


const User = model('User',userSchema);

module.exports = User; 