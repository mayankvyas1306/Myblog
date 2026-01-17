//first importing jwt
const JWT = require("jsonwebtoken");

//create a secret
const secret = "#$%^gvgvoyt%$&^hvyu6514vjbfyuv^%&^(676";

function createTokenForUser(user){
    //creating payload
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };

    //now we sign the token
    const token = JWT.sign(payload,secret);

    return token;
}


function validateToken(token){
    const payload = JWT.verify(token,secret);

    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}
