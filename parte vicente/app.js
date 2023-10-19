const express = require("express");
const handlebars = require("express-handlebars");

const app = express();

app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
    defaultLayout: "index",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


module.exports = app