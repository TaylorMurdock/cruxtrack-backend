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

module.exports = router;
