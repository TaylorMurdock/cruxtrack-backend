const userRouter = require("./routes/user");
const routeRouter = require("./routes/route");
const journalRouter = require("./routes/journal");
const gearRouter = require("./routes/gear");

app.use("/user", userRouter);
app.use("/routes", routeRouter);
app.use("/journals", journalRouter);
app.use("/gear", gearRouter);
