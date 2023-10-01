const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

// Create a new user
router.post("/users", async (req, res, next) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Delete a user
router.delete("/users/:id", async (req, res, next) => {
  try {
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
