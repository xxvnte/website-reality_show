const app = require("./app")
const userRouter = require('./routes/user');
const mainRouter = require('./routes/main');
const eventoRouter = require('./routes/evento');
const votoRouter = require('./routes/voto');
const routesRouter = require('./routes/routes');

const port = process.env.PORT;

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
})

app.use(userRouter);
app.use(mainRouter);
app.use(eventoRouter);
app.use(votoRouter);
app.use(routesRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

