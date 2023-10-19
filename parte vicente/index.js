const app = require("./app");
const mainRouter = require("./routes/main");
const userRouter = require("./routes/user");

const port = 3001;

app.use("", mainRouter);
app.use("", userRouter);

app.get("/health", (req, res) => {
  res.send("I'M ALIVE");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
