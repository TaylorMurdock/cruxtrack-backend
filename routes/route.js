const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

// Create a new route - POST
router.post("/", async (req, res, next) => {
  try {
    // Create a new route using Prisma's create method
    const newRoute = await prisma.route.create({
      data: {
        name: req.body.name,
        grade: req.body.grade,
        description: req.body.description,
        location: req.body.location,
        protection: req.body.protection,
        date: new Date(),
        routeCompleted: false,
        climber: {
          connect: { id: req.body.authorId },
        },
      },
    });

    res.status(201).json(newRoute);
  } catch (error) {
    next(error);
  }
});

// Retrieve all routes - GET
router.get("/", async (req, res, next) => {
  try {
    // Retrieve all routes from the database using Prisma's findMany method
    const routes = await prisma.route.findMany();

    res.json(routes);
  } catch (error) {
    next(error);
  }
});

// Retrieve a single route by ID - GET
router.get("/:id", async (req, res, next) => {
  try {
    // Retrieve a single route from the database by its ID using Prisma's findUnique method
    const route = await prisma.route.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!route) {
      res.status(404).json({ error: "Route not found" });
    } else {
      res.json(route);
    }
  } catch (error) {
    next(error);
  }
});

// Update a route by ID - PUT
router.put("/:id", async (req, res, next) => {
  try {
    const updatedRoute = await prisma.route.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: req.body.name,
        grade: req.body.grade,
        description: req.body.description,
        location: req.body.location,
        protection: req.body.protection,
        routeCompleted: req.body.routeCompleted,
      },
    });

    res.json(updatedRoute);
  } catch (error) {
    next(error);
  }
});

// Delete a route by ID - DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.route.delete({
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
