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
});

const User = mongoose.model("User", UserSchema);
export default User;
