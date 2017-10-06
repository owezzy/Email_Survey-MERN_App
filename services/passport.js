const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose =  require('mongoose');
const keys = require("../config/keys");

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    "use strict";
    done(null, user.id);
});

passport.deserializeUser((id, done) =>{
    "use strict";
    User.findById(id)
        .then(user  => {
            done(null, user);
        });
});



passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "/auth/google/callback"
        },
        (accessToken, refreshToken, profile, done) => {
           User.findOne({googleId: profile.id })
               .then((existingUser)=> {
               "use strict";
               if (existingUser){
                   //profile id is present in DB
                   done(null,existingUser);
               }else{
                   // save the new user profile id to db
                   new User({googleId: profile.id}).save().then(user => done(null, user));
               }
               });

        }
    )
);