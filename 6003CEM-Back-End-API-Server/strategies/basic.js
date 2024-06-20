const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('../models/users');
const passport = require("koa-passport");

const checkPassword = function(user, password) {
    return user.password == password;
}

const authenticateUser = async (username, password, done) => {
    let result;
    try {
        result = await users.getByUsername(username);
    } catch(error) {
        console.error(`${username} authentication error`);
        return done(error);
    }
    if(result.length) {
        const user = result[0];
        if(checkPassword(user, password)) {
            console.log(`Authenticated: ${username}`);
            return done(null, user);
        } else {
            console.log(`Incorrect password: ${username}`);
        }
    } else {
        console.log(`${username} not found`);
    }
    return done(null, false);
}

passport.use(new BasicStrategy(authenticateUser));

module.exports = {
    basicStrategy: passport.authenticate(["basic"], {session:false}),
}
