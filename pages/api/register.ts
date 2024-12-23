import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API /register invoked"); // Debugging statement
  if (req.method !== "POST") {
    console.error("Invalid request method:", req.method);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.error("Missing required fields:", { name, email, password });
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const db = (await connectToDatabase()).db;

    if (!db) {
      console.error("Database connection failed");
      return res.status(500).json({ message: "Database connection failed" });
    }

    console.log("Connected to database");

    // Check if the user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      console.warn("User already exists with email:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    console.log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    console.log("Saving user to the database");
    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
    });

    console.log("User registered successfully");
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
