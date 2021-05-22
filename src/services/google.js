import passport from "passport";
import { config } from "dotenv";
import { User } from "../db/models/user";

const GoogleTokenStrategy = require("passport-google-token").Strategy;

config();

const getProfile = (profile) => {
  const { id, displayName, emails, provider } = profile;
  if (emails?.length) {
    const email = emails[0].value;
    return {
      googleId: id,
      name: displayName,
      email,
      provider,
    };
  }
  return null;
};

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingGoogleAccount = await User.findOne({
          where: { googleId: profile.id },
        });

        if (!existingGoogleAccount) {
       
            const newAccount = new User({
              name: profile.displayName,
              email: profile.email,
              about:"Hi there! I love to spread good vibes"
            })
            newAccount.save()
            return done(null, newAccount);
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
