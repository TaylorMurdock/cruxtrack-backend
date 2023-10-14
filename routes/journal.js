const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

// Create a new journal entry - POST
router.post("/", async (req, res, next) => {
  try {
    const newEntry = await prisma.journal.create({
      data: {
        entryName: req.body.entryName,
        description: req.body.description,
        date: new Date(), // Automatically set the current date
      },
    });

    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
});

// Retrieve all journal entries - GET
router.get("/", async (req, res, next) => {
  try {
    const entries = await prisma.journal.findMany();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

// Retrieve a single journal entry by ID - GET
router.get("/:id", async (req, res, next) => {
  try {
    const entry = await prisma.journal.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!entry) {
      res.status(404).json({ error: "Journal entry not found" });
    } else {
      res.json(entry);
    }
  } catch (error) {
    next(error);
  }
});

// Update a journal entry by ID - PUT
router.put("/:id", async (req, res, next) => {
  try {
    const updatedEntry = await prisma.journal.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        entryName: req.body.entryName,
        description: req.body.description,
      },
    });

    res.json(updatedEntry);
  } catch (error) {
    next(error);
  }
});

// Delete a journal entry by ID - DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.journal.delete({
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
