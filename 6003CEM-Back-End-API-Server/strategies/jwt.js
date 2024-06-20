const users = require("../models/users")
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const passport = require("koa-passport")

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "A3ACB164C22AE94FEE4334CB28D0B0CF";

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try{
        const userT = await users.getUserById(jwt_payload.ID);
        const user = userT[0];
        if (userT) {
            console.log(`${user.username} validated wih JWT`);
            return done(null, user);
        } else {
            console.log("user failed validation wih JWT");
            return done(null, false);
        }
    } catch {
        console.error("Error validating JWT:", error);
        return done(error, false);
    }
}));

const generateToken = (user) => {
    const payload = {
        ID: user.ID,
        username: user.username,
        access: user.access
    };
    return jwt.sign(payload, opts.secretOrKey)
}

module.exports = {
    jwtAuthentication: passport.authenticate("jwt", {session: false}),
    generateToken
}