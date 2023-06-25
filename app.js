import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import User from "./Models/UserModel.js";
import Post from ".Models/PostModel.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as SteamStrategy } from "passport-steam";

//import env variables
dotenv.config();

//connect to mongodb
mongoose.connect(process.env.MONGODB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//init express
const app = express();

//setup express middlewares
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//serialization of sessions signed in user. user is stored as their id
passport.serializeUser((user, done) => {
  return done(null, user._id);
});

//deserialization of sessions signed in user. for retrieval of user details. finds database record from the serialized data. (id)
passport.deserializeUser((id, done) => {
  const findUserById = async () => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(null, null);
      } else {
        return done(null, user);
      }
    } catch (err) {
      console.log(err);
      return done(err, null);
    }
  };
  findUserById();
});

//setup of the google sign in strategy to be used by passport
passport.use(
  new GoogleStrategy(
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
  )
);

//setup of the steam sign in strategy to be used by passport
passport.use(
  new SteamStrategy(
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
    }
  )
);

//authorization api routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    //Succesful auth
    res.redirect(process.env.CLIENT_URL + "/profile");
  }
);

app.get("/auth/steam", passport.authenticate("steam"));

app.get(
  /^\/auth\/steam(\/callback)?$/,
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {
    //Successful auth
    res.redirect(process.env.CLIENT_URL + "/profile");
  }
);

app.get("/auth/logout", (req, res, next) => {
  if (req.user) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
    });
    res.clearCookie("connect.sid");
    res.send("Logged out");
  }
});

//application api routes
app.get("/", (req, res) => {
  res.send("Hello world :)");
});

app.get("/getuser", (req, res) => {
  res.send(req.user);
});

app.post("/savepost", async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!req.user.savedPosts.includes(req.body.postId)) {
      req.user.savedPosts.push(req.body.postId);
      post.saves += 1;
      await post.save();
      await req.user.save();

      res.status(201).json({ message: "saved" });
    } else {
      res.status(201).json({ message: "already was saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.post("/unsavepost", async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const indexofpost = req.user.savedPosts.indexOf(req.body.postId);
    if (indexofpost !== -1) {
      req.user.savedPosts.splice(indexofpost, 1);
      post.saves -= 1;
      await post.save();
      await req.user.save();
      res.status(201).json({ message: "unsaved" });
    } else {
      res.status(201).json({ message: "not a saved post" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

//when sending a post to the client, after retrieving it from the database, this function is called to add an isSaved prop to the post to match the type definition of the client
const addIsSavedProp = (savedIds, posts) => {
  for (let i = 0; i < posts.length; i++) {
    if (savedIds.includes(posts[i]._id)) {
      posts[i]._doc.isSaved = true;
    } else {
      posts[i]._doc.isSaved = false;
    }
  }
};

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({});
    if (req.user) {
      addIsSavedProp(req.user.savedPosts, posts);
    } else {
      addIsSavedProp([], posts);
    }
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    let posts = [post];
    if (req.user) {
      addIsSavedProp(req.user.savedPosts, posts);
    } else {
      posts[0]._doc.isSaved = false;
    }
    res.status(200).json(posts[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.post("/newpost", async (req, res) => {
  try {
    if (req.user) {
      const newPost = await Post.create(req.body);
      res.status(200).json(newPost);
    } else {
      res
        .status(401)
        .json({ message: "May not create post while not signed in" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.get("/users/:id/savedpostIDs", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.savedPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.get("/users/:id/savedposts", async (req, res) => {
  try {
    const { id } = req.params;

    if (id == undefined) {
      return res.status(404).json({ error: "No User ID Provided" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ _id: { $in: user.savedPosts } });

    if (req.user) {
      addIsSavedProp(req.user.savedPosts, posts);
    } else {
      addIsSavedProp([], posts);
    }

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.get("/users/:id/posts", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ authorID: id });

    if (req.user) {
      addIsSavedProp(req.user.savedPosts, posts);
    } else {
      addIsSavedProp([], posts);
    }
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

//start the express server
app.listen(5000, () => {
  console.log("Server started");
});
