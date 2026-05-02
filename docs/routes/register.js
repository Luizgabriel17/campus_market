const express = require("express");
const router = express.Router();
const db = require("../database/database");
const bcrypt = require("bcrypt");

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

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, error: "Erro ao cadastrar" });
  }
});

module.exports = router;