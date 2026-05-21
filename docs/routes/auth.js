const express = require("express");
const router = express.Router();
const db = require("../database/database");
const bcrypt = require("bcrypt");

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

      const senhaValida = await bcrypt.compare(senha, cliente.senha);

      if (senhaValida) {
        return res.json({
          success: true,
          user: {
            id: cliente.id,
            nome: cliente.nome,
            tipo: "cliente"
          }
        });
      }
    }

    // VENDEDOR
    const [vendedores] = await db.query(
      "SELECT * FROM vendedor WHERE email = ?",
      [email]
    );

    if (vendedores.length > 0) {
      const vendedor = vendedores[0];

      const senhaValida = await bcrypt.compare(senha, vendedor.senha);

      if (senhaValida) {
        return res.json({
          success: true,
          user: {
            id: vendedor.id,
            nome: vendedor.nome,
            tipo: "vendedor"
          }
        });
      }
    }

    return res.status(401).json({
      success: false,
      error: "Email ou senha inválidos"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Erro no servidor"
    });
  }
});

module.exports = router;