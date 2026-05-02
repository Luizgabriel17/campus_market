const express = require("express");
const router = express.Router();
const db = require("../database/database");

router.post("/", async (req, res) => {
  const { cliente_id, pedido_id, nota, comentario } = req.body;

  try {
    if (!pedido_id || !nota) {
      return res.status(400).json({ success: false, error: "Dados inválidos" });
    }

    if (nota < 1 || nota > 5) {
      return res.status(400).json({ success: false, error: "Nota inválida" });
    }

    const [pedidoResult] = await db.query(
      "SELECT vendedor_id, status FROM pedidos WHERE id = ? AND cliente_id = ?",
      [pedido_id, cliente_id]
    );

    if (pedidoResult.length === 0) {
      return res.status(404).json({ success: false, error: "Pedido não encontrado" });
    }

    const pedido = pedidoResult[0];

    if (pedido.status !== "ENTREGUE") {
      return res.status(400).json({ success: false, error: "Pedido não entregue" });
    }

    const [avaliacaoExistente] = await db.query(
      "SELECT id FROM avaliacoes WHERE pedido_id = ? LIMIT 1",
      [pedido_id]
    );

    if (avaliacaoExistente.length > 0) {
      return res.status(400).json({ success: false, error: "Pedido já avaliado" });
    }

    await db.query(
      `INSERT INTO avaliacoes 
       (cliente_id, vendedor_id, pedido_id, nota, comentario) 
       VALUES (?, ?, ?, ?, ?)`,
      [cliente_id, pedido.vendedor_id, pedido_id, nota, comentario || null]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Erro no servidor" });
  }
});

module.exports = router;