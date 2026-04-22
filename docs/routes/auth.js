const express = require("express");
const router = express.Router();
const db = require("../database/database");
const bcrypt = require("bcrypt");

// TELA
router.get("/", (req, res) => {
  res.render("register");
});

// CADASTRO
router.post("/", async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  const tabela = tipo === "cliente" ? "cliente" : "vendedor";

  try {
    const hash = await bcrypt.hash(senha, 10);

    await db.query(
      `INSERT INTO ${tabela} (nome, email, senha) VALUES (?, ?, ?)`,
      [nome, email, hash]
    );

    res.redirect("/login");

  } catch (err) {
    console.error(err);
    res.send("Erro ao cadastrar");
  }
});

module.exports = router;