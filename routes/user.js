const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create an Express router
const router = express.Router();

// Create a new user - POST
router.post("/", async (req, res, next) => {
  try {
    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        email: req.body.email,
        password: req.body.password,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Retrieve user with ID - GET
router.get("/:id", async (req, res, next) => {
  try {
    // Retrieve a User from the database
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update a route by ID - PUT
router.put("/:id", async (req, res, next) => {
  try {
    // Update a user in the database by its ID using Prisma's update method
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        email: req.body.email,
        password: req.body.password,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// Retrieve all users - GET
router.get("/", async (req, res, next) => {
  try {
    // Retrieve all users from the database
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Delete a user - DELETE request handler
router.delete("/:id", async (req, res, next) => {
  // Handle DELETE requests to "/users/:id" endpoint
  try {
    // Delete a user from the database based on the provided user ID
    await prisma.user.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
