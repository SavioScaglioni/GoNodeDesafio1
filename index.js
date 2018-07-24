const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app
});

app.set("view engine", "njk");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/check", (req, res) => {
  // Verificação da idade
  let d1 = new Date(req.body.data_nascimento);
  let d2 = new Date();
  let diff = d2.getTime() - d1.getTime();
  let idade = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));

  if (idade < 18) {
    res.redirect(`/minor?nome=${req.body.nome}`);
  } else {
    res.redirect(`/major?nome=${req.body.nome}`);
  }
});

const userMiddlaware = (req, res, next) => {
  if (req.query.nome === undefined || req.query.data_nascimento === undefined) {
    console.log("Campos nome e data de nascimento são obrigatórios!");
    res.redirect("/");
  } else {
    next();
  }
};

app.get("/major", userMiddlaware, (req, res) => {
  res.render("major", { nome: req.query.nome });
});

app.get("/minor", userMiddlaware, (req, res) => {
  res.render("minor", { nome: req.query.nome });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000);
