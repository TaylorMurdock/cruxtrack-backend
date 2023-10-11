const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

// Create an Express router
const router = express.Router();

// Secret key for JWT token generation
const secretKey = "3295";

// List users route - Get a list of all users
router.get("/", async (req, res, next) => {
  try {
    // Fetch a list of users from the database
    const users = await prisma.user.findMany();

    res.status(200).json(users);
  } catch (error) {
    console.error("List users error:", error);
    next(error);
  }
});

// Signup route - Create a new user
router.post("/signup", async (req, res, next) => {
  try {
    // Hash the user's password before saving it
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user in the database with the hashed password
    const newUser = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword, // Store the hashed password
      },
    });

    console.log("User signed up:", newUser); // Log the new user data

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Signup error:", error);
    next(error);
  }
});

// Login route - Authenticate the user and issue a JWT token
router.post("/login", async (req, res, next) => {
  console.log("Received a login request");
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      console.log("Login failed: User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Login failed: Invalid password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "1h",
    });

    console.log("Login successful: User logged in");

    // Send the JWT token as a response
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
});

module.exports = router;
