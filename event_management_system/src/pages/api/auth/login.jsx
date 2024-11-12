import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

import connectToDatabase from "../../../lib/mongoose";
import User from "../../../models/User";

const validate = [
  body("username")
    .isString().withMessage("Username must be a string")
    .trim().escape().withMessage("Username must be trimmed and escaped"),
  body("password")
    .isString().withMessage("Password must be a string")
    .trim().escape().withMessage("Password must be trimmed and escaped"),
];

const loginHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const { username, password } = req.body;

  try {
    await connectToDatabase();

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("%c Login successful","color:green");
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default [validate, handler];
