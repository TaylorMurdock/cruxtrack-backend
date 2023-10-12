//cruxtrack-backend/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;

const userRouter = require("./routes/user");
const gearRouter = require("./routes/gear");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use("/user", userRouter);
app.use("/gear", gearRouter);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
