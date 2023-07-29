import mongoose from "mongoose";

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
    required: [true, "No saves"],
    default: 0,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
