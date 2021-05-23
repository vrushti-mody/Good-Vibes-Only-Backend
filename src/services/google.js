import passport from "passport";
import { config } from "dotenv";
import { User } from "../db/models/user";

const GoogleTokenStrategy = require("passport-google-oauth-token");

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("working");
      try {
        return done(null, profile);
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
