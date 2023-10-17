//cruxtrack-backend/routes/gear.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { parseISO, set } = require("date-fns");
const prisma = new PrismaClient();
const router = express.Router();
const jwt = require("jsonwebtoken"); // Import the jwt module

// Middleware to validate climberId parameter
const validateClimberId = (req, res, next) => {
  // Get the JWT token from the request headers
  const token = req.headers.authorization;
  console.log("Received Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Verify the JWT and extract the user's ID
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log(err);
    // Use the retrieved secret key from environment variables
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log("Decoded User ID:", decoded.userId);

    req.climberId = decoded.userId; // Use the extracted user's ID
    next();
  });
};

// Apply the validation middleware for this route
router.post("/", validateClimberId, async (req, res, next) => {
  try {
    const parsedDate = parseISO(req.body.dateBought);
    const dateBought = set(parsedDate, { hours: 0, minutes: 0, seconds: 0 });

    const newGearItem = await prisma.gear.create({
      data: {
        item: req.body.item,
        dateBought: dateBought,
        climber: {
          connect: { id: req.climberId }, // Use validated climberId
        },
      },
    });

    res.status(201).json(newGearItem);
  } catch (error) {
    next(error);
  }
});

// Add a new route to get all gear items for the authenticated user
router.get("/", validateClimberId, async (req, res, next) => {
  try {
    // Fetch all gear items associated with the authenticated user
    const gearItems = await prisma.gear.findMany({
      where: {
        climberId: req.climberId,
      },
    });

    res.status(200).json(gearItems);
  } catch (error) {
    next(error);
  }
});

// Handle DELETE request to delete a gear item by ID
router.delete("/:id", validateClimberId, async (req, res, next) => {
  const itemId = parseInt(req.params.id);

  try {
    // Check if the gear item belongs to the authenticated climber
    const gearItem = await prisma.gear.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!gearItem || gearItem.climberId !== req.climberId) {
      return res.status(404).json({ error: "Gear item not found" });
    }

    //delete
    await prisma.gear.delete({
      where: {
        id: itemId,
      },
    });

    res.status(204).end(); // No content, indicating successful deletion
  } catch (error) {
    next(error);
  }
});

// Add a new route to update a gear item by ID
router.put("/:id", validateClimberId, async (req, res, next) => {
  const itemId = parseInt(req.params.id);
  const { item, dateBought } = req.body;

  try {
    // Check if the gear item belongs to the authenticated climber
    const gearItem = await prisma.gear.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!gearItem || gearItem.climberId !== req.climberId) {
      return res.status(404).json({ error: "Gear item not found" });
    }

    // Perform the update
    const updatedGearItem = await prisma.gear.update({
      where: { id: itemId },
      data: {
        item,
        dateBought: new Date(dateBought),
      },
    });

    res.status(200).json(updatedGearItem);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
