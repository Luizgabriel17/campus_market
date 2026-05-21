const express = require("express");
const router = express.Router();
const db = require("../database/database");

// LISTAR PEDIDOS
router.get("/:clienteId", async (req, res) => {
  const { clienteId } = req.params;

  try {
    const [pedidos] = await db.query(`
      SELECT 
        p.id,
        p.valor_total,
        p.status,
        p.data_pedido,
        v.nome AS vendedor_nome,
        v.id AS vendedor_id,
        GROUP_CONCAT(pr.nome SEPARATOR ', ') AS itens,
        EXISTS(
          SELECT 1 FROM avaliacoes a WHERE a.pedido_id = p.id
        ) AS avaliado
      FROM pedidos p
      JOIN vendedor v ON v.id = p.vendedor_id
      JOIN itens_pedido i ON i.pedido_id = p.id
      JOIN produtos pr ON pr.id = i.produto_id
      WHERE p.cliente_id = ?
      GROUP BY p.id
      ORDER BY p.id DESC
    `, [clienteId]);

    res.json({ success: true, data: pedidos });

  } catch (err) {
    res.status(500).json({ success: false, error: "Erro ao buscar pedidos" });
  }
});
router.post("/finalizar", async (req, res) => {
  const { cliente_id, carrinho } = req.body;

  if (!carrinho || carrinho.length === 0) {
    return res.status(400).json({ success: false, error: "Carrinho vazio" });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const vendedorId = carrinho[0].vendedor_id;

    const total = carrinho.reduce((soma, item) => {
      return soma + item.preco * item.quantidade;
    }, 0);

    const [pedidoResult] = await connection.query(
      "INSERT INTO pedidos (cliente_id, vendedor_id, valor_total, status) VALUES (?, ?, ?, 'PENDENTE')",
      [cliente_id, vendedorId, total]
    );

    const pedidoId = pedidoResult.insertId;

    for (const item of carrinho) {
      await connection.query(
        "INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)",
        [pedidoId, item.id, item.quantidade, item.preco]
      );
    }

    await connection.commit();

    res.json({ success: true, pedidoId });

  } catch (err) {
    await connection.rollback();
    res.status(500).json({ success: false, error: "Erro ao finalizar pedido" });
  } finally {
    connection.release();
  }
});

module.exports = router;