import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      default:0
    },
  },
  { timestamps: true }
);

export default mongoose.model("accounts", accountSchema);
