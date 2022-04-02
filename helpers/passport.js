const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models");

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID:
        "750121174033-dr287087lrjri680f2jqrkef9mtdt0vd.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/api/v1/user/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      const [user, created] = await User.findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: { first_name: profile.displayName },
      });
      cb(null, user);
    }
  )
);
