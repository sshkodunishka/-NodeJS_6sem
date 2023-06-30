const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID:
                "336528158595-q6ut65r44qbnjqdpl9ngsjjc7o9rqi7c.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        function (accessToken, refreshToken, profile, cb) {
            console.log(accessToken)
            console.log(refreshToken)
            console.log(profile)
            return cb(null, profile);
        }
    )
);
