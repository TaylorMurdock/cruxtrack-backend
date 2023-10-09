const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { parseISO, set } = require("date-fns");
const prisma = new PrismaClient();
const router = express.Router();

// Create a new gear item associated with a user - POST
router.post("/:climberId", async (req, res, next) => {
  try {
    const parsedDate = parseISO(req.body.dateBought);
    const dateBought = set(parsedDate, { hours: 0, minutes: 0, seconds: 0 });

    const newGearItem = await prisma.gear.create({
      data: {
        item: req.body.item,
        dateBought: dateBought,
        climber: {
          connect: { id: parseInt(req.params.climberId) }, // Associate gear with user
        },
      },
    });

    res.status(201).json(newGearItem);
  } catch (error) {
    next(error);
  }
});

// Retrieve all gear items associated with a specific user - GET
router.get("/:climberId", async (req, res, next) => {
  try {
    const climberId = parseInt(req.params.climberId);
    const gearItems = await prisma.gear.findMany({
      where: {
        climberId: climberId,
      },
    });

    res.json(gearItems);
  } catch (error) {
    next(error);
  }
});

// Retrieve a single gear item by ID - GET
router.get("/:climberId/:id", async (req, res, next) => {
  try {
    const climberId = parseInt(req.params.climberId);
    const gearItemId = parseInt(req.params.id);

    const gearItem = await prisma.gear.findUnique({
      where: {
        id: gearItemId,
        climberId: climberId,
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
router.put("/:climberId/:id", async (req, res, next) => {
  try {
    const climberId = parseInt(req.params.climberId);
    const gearItemId = parseInt(req.params.id);

    const updatedGearItem = await prisma.gear.update({
      where: {
        id: gearItemId,
        climberId: climberId,
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
router.delete("/:climberId/:id", async (req, res, next) => {
  try {
    const climberId = parseInt(req.params.climberId);
    const gearItemId = parseInt(req.params.id);

    await prisma.gear.delete({
      where: {
        id: gearItemId,
        climberId: climberId,
      },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
