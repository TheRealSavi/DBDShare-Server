import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "No name"],
  },
  description: {
    type: String,
  },
  saves: {
    type: Number,
    required: [true, "No saves"],
    default: 0,
  },
  perks: {
    type: [String],
    required: true,
  },
  authorID: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
