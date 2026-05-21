const express = require("express");
const router = express.Router();
const db = require("../database/database");

// DASHBOARD COMPLETO
router.get("/:vendedorId", async (req, res) => {
  const { vendedorId } = req.params;
  const hoje = new Date().toISOString().slice(0, 10);

  try {
    const [produtos] = await db.query(
      "SELECT * FROM produtos WHERE vendedor_id = ?",
      [vendedorId]
    );

    const [pedidos] = await db.query(`
      SELECT 
        p.id,
        p.valor_total,
        p.status,
        p.data_pedido,
        c.nome AS cliente_nome,
        GROUP_CONCAT(pr.nome SEPARATOR ', ') AS itens
      FROM pedidos p
      JOIN cliente c ON c.id = p.cliente_id
      JOIN itens_pedido i ON i.pedido_id = p.id
      JOIN produtos pr ON pr.id = i.produto_id
      WHERE p.vendedor_id = ?
      GROUP BY p.id
      ORDER BY p.id DESC
    `, [vendedorId]);

    const [[hojeData]] = await db.query(`
      SELECT 
        COUNT(*) as pedidosHoje,
        IFNULL(SUM(valor_total), 0) as faturamentoHoje
      FROM pedidos
      WHERE vendedor_id = ? AND DATE(data_pedido) = ?
    `, [vendedorId, hoje]);

    const [faturamentoSemana] = await db.query(`
      SELECT 
        DATE(data_pedido) as dia,
        IFNULL(SUM(valor_total), 0) as total
      FROM pedidos
      WHERE vendedor_id = ?
      GROUP BY DATE(data_pedido)
      ORDER BY dia DESC
      LIMIT 7
    `, [vendedorId]);

    const [maisVendidos] = await db.query(`
      SELECT pr.nome, COUNT(*) as total
      FROM itens_pedido i
      JOIN produtos pr ON pr.id = i.produto_id
      WHERE pr.vendedor_id = ?
      GROUP BY pr.id
      ORDER BY total DESC
      LIMIT 5
    `, [vendedorId]);

    res.json({
      success: true,
      data: {
        produtos,
        pedidos,
        pedidosHoje: hojeData?.pedidosHoje || 0,
        faturamentoHoje: hojeData?.faturamentoHoje || 0,
        faturamentoSemana,
        maisVendidos
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Erro no dashboard" });
  }
});

module.exports = router;