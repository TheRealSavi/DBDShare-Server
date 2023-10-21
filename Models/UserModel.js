import mongoose from "mongoose";

const SettingsSchema = mongoose.Schema({
  perkSkin: {
    type: String,
  },
});

const UserSchema = mongoose.Schema({
  googleId: {
    type: String,
  },
  steamId: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  savedPosts: {
    type: [String],
    required: true,
    default: [],
  },
  profilePic: {
    type: String,
  },
  following: {
    type: [String],
    required: true,
    default: [],
  },
  followers: {
    type: Number,
    required: [true, 0],
    default: 0,
  },
  saveCount: {
    type: Number,
    required: [true, 0],
    default: 0,
  },
  postCount: {
    type: Number,
    required: [true, 0],
    default: 0,
  },
  settings: {
    type: SettingsSchema,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
