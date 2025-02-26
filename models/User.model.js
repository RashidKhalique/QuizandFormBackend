import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  },
  profilePic: {
    type: String
  },
  Quiz: [{
    type: Schema.Types.ObjectId,
    ref: "Quiz"
  }],
  Score: [{
    type: Number,
    default: 0
  }],
  createdBy: {
    type: String,
    default: "user"
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
