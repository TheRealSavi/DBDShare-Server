import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await User.findOne({ googleId: profile.id });
      if (!user) {
        //create new user in database
        const newUser = new User({
          googleId: profile.id,
          username: profile.name.givenName,
        });
        await newUser.save();
        cb(null, newUser);
      } else {
        //user found in database
        cb(null, user);
      }
    } catch (err) {
      console.log(err);
      return cb(err, null);
    }
    //all availible profile info returned by google
    //console.log(profile);
  }
);

export default googleStrategy;
