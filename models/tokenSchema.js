import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  addin: {
    type: Date,
    require: true,
  },
});

const Token = mongoose.model("Token", tokenSchema);
export default Token;
