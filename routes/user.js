//cruxtrack-backend/routes/user.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

// Create an Express router
const router = express.Router();

// Secret key for JWT token generation
const secretKey = process.env.JWT_SECRET; // Use the retrieved secret key from environment variables

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

// Signup route - Create a new user and issue a JWT token
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

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser.id }, secretKey, {
      expiresIn: "1h",
    });

    // Send the JWT token as part of the response
    res
      .status(201)
      .json({ token, userId: newUser.id, username: req.body.username });
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
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    console.log(`Login successful: User ${user.username} logged in`);

    // Send the JWT token as a response
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
});

// Delete user route - Delete a user by ID
router.delete("/:userId", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10); // Parse the user ID from the URL

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    console.log(`User deleted: ID ${userId}`);

    res.status(204).end(); // Respond with no content (user deleted)
  } catch (error) {
    console.error("Delete user error:", error);
    next(error);
  }
});

module.exports = router;
