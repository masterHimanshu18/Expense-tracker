import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API /login invoked");

  if (req.method === "POST") {
    try {
      console.log("Connecting to database...");
      await dbConnect();

      const { email, password } = req.body;
      console.log("Request body:", { email, password });

      const user = await User.findOne({ email });
      if (!user) {
        console.warn("User not found:", email);
        return res.status(404).json({ error: "User not found" });
      }

      console.log("Validating password...");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.warn("Invalid credentials for user:", email);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      console.log("Generating JWT...");
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

      console.log("Login successful for user:", email);
      res.status(200).json({ token, user: { name: user.name, email: user.email } });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    console.warn("Invalid request method:", req.method);
    res.status(405).json({ error: "Method not allowed" });
  }
}
