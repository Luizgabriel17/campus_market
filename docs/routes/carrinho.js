const express = require("express");
const router = express.Router();
const db = require("../database/database");

// BUSCAR PRODUTO (para adicionar no carrinho)
router.get("/produto/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [produtos] = await db.query(
      "SELECT id, nome, preco, vendedor_id FROM produtos WHERE id = ?",
      [id]
    );

    if (produtos.length === 0) {
      return res.status(404).json({ success: false, error: "Produto não encontrado" });
    }

    res.json({ success: true, data: produtos[0] });

  } catch (err) {
    res.status(500).json({ success: false, error: "Erro interno" });
  }
});

module.exports = router;