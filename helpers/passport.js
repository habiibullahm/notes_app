const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Users } = require("../models");
const baseUrl = "https://team-b-see-event.herokuapp.com"

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID:
        "411995268360-kc634skja3qnnu3qfgq1t0h5iqn7hhpp.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: `${baseUrl}/api/v1/sign/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      const [user, created] = await Users.findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: { first_name: profile.displayName },
      });
      cb(null, user);
    }
  )
);
// passport.use("facebook",
//     new FacebookStrategy());
