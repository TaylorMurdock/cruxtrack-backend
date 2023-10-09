const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;
const userRouter = require("./routes/user");
const routeRouter = require("./routes/route");
const journalRouter = require("./routes/journal");
const gearRouter = require("./routes/gear");

// Enable CORS for all routes
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Enable JSON parsing for incoming requests
app.use(express.json());

app.use("/user", userRouter);
app.use("/routes", routeRouter);
app.use("/journal", journalRouter);
app.use("/gear", gearRouter);

app.listen(PORT, () => console.log(`server is running on ${PORT}`));
