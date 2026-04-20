const express = require("express");
const router = express.Router();
const db = require("../database/database");

// 🔒 Middleware
function authCliente(req, res, next) {
  if (!req.session.user || req.session.user.tipo !== "cliente") {
    return res.redirect("/login");
  }
  next();
}

// 📦 LISTAR PEDIDOS
router.get("/", authCliente, async (req, res) => {
  const clienteId = req.session.user.id;

  try {
    const [pedidos] = await db.query(`
      SELECT 
        p.id,
        p.valor_total,
        p.status,
        p.data_pedido,
        v.nome AS vendedor_nome,
        GROUP_CONCAT(pr.nome SEPARATOR ', ') AS itens
      FROM pedidos p
      JOIN vendedor v ON v.id = p.vendedor_id
      JOIN itens_pedido i ON i.pedido_id = p.id
      JOIN produtos pr ON pr.id = i.produto_id
      WHERE p.cliente_id = ?
      GROUP BY p.id
      ORDER BY p.id DESC
    `, [clienteId]);

    res.render("pedidos", {
      pedidos: pedidos || [],
      user: req.session.user
    });

  } catch (err) {
    console.error(err);
    res.send("Erro ao buscar pedidos");
  }
});

// 🛒 FINALIZAR PEDIDO
router.post("/finalizar", authCliente, async (req, res) => {
  const clienteId = req.session.user.id;
  const carrinho = req.session.carrinho || [];

  if (carrinho.length === 0) {
    return res.redirect("/cliente");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const vendedorId = carrinho[0].vendedor_id;

    const total = carrinho.reduce((soma, item) => {
      return soma + item.preco * item.quantidade;
    }, 0);

    // ✅ agora salva com vendedor_id
    const [pedidoResult] = await connection.query(
      "INSERT INTO pedidos (cliente_id, vendedor_id, valor_total, status) VALUES (?, ?, ?, 'PENDENTE')",
      [clienteId, vendedorId, total]
    );

    const pedidoId = pedidoResult.insertId;

    for (const item of carrinho) {
      await connection.query(
        "INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)",
        [pedidoId, item.id, item.quantidade, item.preco]
      );
    }

    await connection.commit();

    req.session.carrinho = [];

    res.redirect("/pedidos");

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.send("Erro ao finalizar pedido");
  } finally {
    connection.release();
  }
});

module.exports = router;