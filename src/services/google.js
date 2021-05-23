import passport from "passport";
import { config } from "dotenv";
const User = require("../db/models/user");

const GoogleTokenStrategy = require("passport-google-oauth-token");

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { displayName, emails } = profile;
      const email = emails[0].value;
      const id = profile.id;

      try {
        const existingAccount = await User.findOne({
          id: id,
        });

        if (existingAccount) {
          done(null, existingAccount);
        } else {
          const user = await new User({
            id,
            name: displayName,
            email,
            about: "Hi there! I like to spread some good vibes!",
          });

          await user.save();

          done(null, user);
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => done(error));
});
