const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { parseISO, format } = require("date-fns");
const prisma = new PrismaClient();
const router = express.Router();

// Create a new gear item - POST
router.post("/", async (req, res, next) => {
  try {
    // Parse the date from the request body in "yyyy-mm-dd" format
    const parsedDate = parseISO(req.body.dateBought);

    // Format the parsed date as "mm-dd-yyyy"
    const formattedDate = format(parsedDate, "mm-dd-yyyy");

    // Create a new gear item in the database
    const newGearItem = await prisma.gear.create({
      data: {
        item: req.body.item,
        dateBought: formattedDate, // Use the formatted date
      },
    });

    res.status(201).json(newGearItem);
  } catch (error) {
    next(error);
  }
});

// Retrieve all gear items - GET
router.get("/", async (req, res, next) => {
  try {
    // Retrieve all gear items from the database
    const gearItems = await prisma.gear.findMany();
    res.json(gearItems);
  } catch (error) {
    next(error);
  }
});

// Retrieve a single gear item by ID - GET
router.get("/:id", async (req, res, next) => {
  try {
    // Retrieve a single gear item from the database based on the provided ID
    const gearItem = await prisma.gear.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!gearItem) {
      res.status(404).json({ error: "Gear item not found" });
    } else {
      res.json(gearItem);
    }
  } catch (error) {
    next(error);
  }
});

// Update a gear item by ID - PUT
router.put("/:id", async (req, res, next) => {
  try {
    // Update a gear item in the database based on the provided ID
    const updatedGearItem = await prisma.gear.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        item: req.body.item,
        dateBought: new Date(req.body.dateBought),
      },
    });

    res.json(updatedGearItem);
  } catch (error) {
    next(error);
  }
});

// Delete a gear item by ID - DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    // Delete a gear item from the database based on the provided ID
    await prisma.gear.delete({
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
