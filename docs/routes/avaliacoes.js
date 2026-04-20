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

// ⭐ AVALIAR
router.post("/avaliar", authCliente, async (req, res) => {
  const { pedido_id, nota, comentario } = req.body;
  const cliente_id = req.session.user.id;

  try {
    // ✅ validação
    if (!pedido_id || !nota) {
      return res.redirect("/pedidos?erro=Dados inválidos");
    }

    if (nota < 1 || nota > 5) {
      return res.redirect("/pedidos?erro=Nota inválida");
    }

    // 🔎 buscar pedido (garante que é do cliente)
    const [pedidoResult] = await db.query(
      "SELECT vendedor_id, status FROM pedidos WHERE id = ? AND cliente_id = ?",
      [pedido_id, cliente_id]
    );

    if (pedidoResult.length === 0) {
      return res.redirect("/pedidos?erro=Pedido não encontrado");
    }

    const pedido = pedidoResult[0];

    // 🚨 só pode avaliar se estiver ENTREGUE
    if (pedido.status !== "ENTREGUE") {
      return res.redirect("/pedidos?erro=Pedido ainda não foi entregue");
    }

    const vendedor_id = pedido.vendedor_id; // 🔐 vem do banco, não do usuário

    // ❌ evitar duplicidade
    const [avaliacaoExistente] = await db.query(
      "SELECT id FROM avaliacoes WHERE pedido_id = ? LIMIT 1",
      [pedido_id]
    );

    if (avaliacaoExistente.length > 0) {
      return res.redirect("/pedidos?erro=Pedido já avaliado");
    }

    // ✅ inserir avaliação
    await db.query(
      `INSERT INTO avaliacoes 
       (cliente_id, vendedor_id, pedido_id, nota, comentario) 
       VALUES (?, ?, ?, ?, ?)`,
      [cliente_id, vendedor_id, pedido_id, nota, comentario || null]
    );

    res.redirect("/pedidos?sucesso=Avaliação enviada");

  } catch (err) {
    console.error("Erro ao avaliar:", err);
    res.redirect("/pedidos?erro=Erro no servidor");
  }
});

module.exports = router;