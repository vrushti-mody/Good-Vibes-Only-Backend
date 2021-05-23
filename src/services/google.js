import passport from "passport";
import { config } from "dotenv";
const User  = require("../db/models/user");

const GoogleTokenStrategy = require("passport-google-oauth-token");

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const { displayName, emails } = profile;
      const email = emails[0].value;
      try {
        const existingGoogleAccount = await User.findOne({
          where: { email: email },
        });
        if (!existingGoogleAccount) {
          const user= new User({
            name:displayName,
            email:email,
            about: 'Hi there! I like to spread some good vibes!',
          });
          await user.save()
          const newUser = await User.findOne({
            where: { email: email },
          });
          return done(null, newUser);
        }

        return done(null, existingGoogleAccount);
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
