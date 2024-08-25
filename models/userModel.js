
import mongoose from "mongoose";

const useSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    question:{
      type:String,
      required:true
    },
    role: {
      type: Number,
      default: 0,
    },
    token:{
      type: String,
    }
  },

  { timestamps: true }
);

export default mongoose.model("users", useSchema);
