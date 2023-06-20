import { Strategy as SteamStrategy } from "passport-steam";

const steamStrategy = new SteamStrategy(
  {
    returnURL: "http://localhost:5000/auth/steam/callback",
    realm: "http://localhost:5000/",
    apiKey: process.env.STEAM_API_KEY,
  },
  async (identifier, profile, done) => {
    try {
      const user = await User.findOne({ steamId: profile._json.steamid });
      if (!user) {
        //create new user in database
        const newUser = new User({
          steamId: profile._json.steamid,
          username: profile._json.personaname,
        });
        await newUser.save();
        return done(null, newUser);
      } else {
        //user found in database
        return done(null, user);
      }
    } catch (err) {
      console.log(err);
      return done(err, null);
    }
    //all availible profile info returned by steam
    //console.log(profile);
    handleAccount();
  }
);

export default steamStrategy;
