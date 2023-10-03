const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create an Express router
const router = express.Router();

// Create a new user - POST
router.post("/users", async (req, res, next) => {
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
    next(error);
  }
});

// Delete a user - DELETE request handler
router.delete("/users/:id", async (req, res, next) => {
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
