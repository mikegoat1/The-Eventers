import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
         const salt  = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
                username,
                password: hashedPassword,
         });

         await user.save();

         const payload = { userId: user._id };
         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

         res.status(201).json({ token});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};