import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Randomstring from "randomstring";
import User from "./models/userScema.js";
import { format } from "date-fns";
import Token from "./models/tokenSchema.js";
const db = "mongodb+srv://seif:seif123@cluster0.g9keomu.mongodb.net/";
const app = express();

app.use(express.json());

mongoose.connect(db).then(() => {
  app.listen(3000, () => {
    console.log("db and server already connected");
  });
});
app.get("/", (req, res) => {
  res.json("wow");
});
app.post("/api/v1/user", async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    // token
    const secretKey = "123456";
    const person = { name, email };
    // save token in DB
    const token = Randomstring.generate(30);
    const newToken = await new Token({
      email,
      token,
      status: "valid",
      addin: Date.now(),
    });
    await newToken.save();

    const newUser = new User({ name, password: hashPassword, email });
    await newUser.save();
    res.status(201).json({ token });
  } catch (err) {
    res.status(402).json("faild");
  }
});

//

app.post("/api/v1/signin", async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  const is_password = await bcrypt.compare(password, findUser.password);
  if (!findUser || !is_password) {
    return res.status(400).send("username or passwoed not exist");
  }

  // still valid

  const findToken = await Token.findOne({ email });
  const remainDate = Date.now() - findToken.addin;
  console.log(format(remainDate, "dd"));
  if (format(remainDate, "dd") > 2) {
    return res.status(401).send("token expired");
  }

  res.status(200).send("yes");
});
