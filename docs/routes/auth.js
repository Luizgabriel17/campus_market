const express = require("express");
const router = express.Router();
const db = require("../database/database");
const bcrypt = require("bcrypt");

// LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("login");
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // CLIENTE
    const [clientes] = await db.query(
      "SELECT * FROM cliente WHERE email = ?",
      [email]
    );

    if (clientes.length > 0) {
      const cliente = clientes[0];

      if (await bcrypt.compare(senha, cliente.senha)) {
        req.session.user = {
          id: cliente.id,
          nome: cliente.nome,
          tipo: "cliente"
        };

        return req.session.save(() =>
          res.redirect("/redirect-cliente")
        );
      }
    }

    // VENDEDOR
    const [vendedores] = await db.query(
      "SELECT * FROM vendedor WHERE email = ?",
      [email]
    );

    if (vendedores.length > 0) {
      const vendedor = vendedores[0];

      if (await bcrypt.compare(senha, vendedor.senha)) {
        req.session.user = {
          id: vendedor.id,
          nome: vendedor.nome,
          tipo: "vendedor"
        };

        return req.session.save(() =>
          res.redirect("/dashboard")
        );
      }
    }

    res.send("Email ou senha inválidos");

  } catch (err) {
    console.error(err);
    res.send("Erro no servidor");
  }
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;