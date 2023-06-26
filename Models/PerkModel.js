import mongoose from "mongoose";

const PerkSchema = mongoose.Schema({
  imgUrl: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const Perk = mongoose.model("Perk", PerkSchema);
export default Perk;
