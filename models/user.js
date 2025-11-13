import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: Number, default: 0, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model("users", userSchema);
