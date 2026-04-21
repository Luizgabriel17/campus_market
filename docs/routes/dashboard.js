const express = require("express");
const router = express.Router();
const db = require("../database/database");

// 🔒 Middleware
function authVendedor(req, res, next) {
  if (!req.session.user || req.session.user.tipo !== "vendedor") {
    return res.redirect("/login");
  }
  next();
}

/* =========================
   📊 DASHBOARD PRINCIPAL
========================= */
router.get("/", authVendedor, async (req, res) => {
  const vendedorId = req.session.user.id;
  const hoje = new Date().toISOString().slice(0, 10);

  try {
    // 🛍️ PRODUTOS
    const [produtos] = await db.query(
      "SELECT * FROM produtos WHERE vendedor_id = ?",
      [vendedorId]
    );

    // 📦 PEDIDOS
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

    // 📅 MÉTRICAS DO DIA
    const [[hojeData]] = await db.query(`
      SELECT 
        COUNT(*) as pedidosHoje,
        IFNULL(SUM(valor_total), 0) as faturamentoHoje
      FROM pedidos
      WHERE vendedor_id = ? AND DATE(data_pedido) = ?
    `, [vendedorId, hoje]);

    // 📈 FATURAMENTO SEMANA
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

    // 🏆 MAIS VENDIDOS
    const [maisVendidos] = await db.query(`
      SELECT pr.nome, COUNT(*) as total
      FROM itens_pedido i
      JOIN produtos pr ON pr.id = i.produto_id
      WHERE pr.vendedor_id = ?
      GROUP BY pr.id
      ORDER BY total DESC
      LIMIT 5
    `, [vendedorId]);

    // 🔥 RENDER COM SEGURANÇA
    res.render("dashboard", {
      user: req.session.user,
      produtos: produtos || [],
      pedidos: pedidos || [],
      pedidosHoje: hojeData?.pedidosHoje || 0,
      faturamentoHoje: hojeData?.faturamentoHoje || 0,
      faturamentoSemana: faturamentoSemana || [],
      maisVendidos: maisVendidos || []
    });

  } catch (err) {
    console.error("🔥 ERRO DASHBOARD:", err);

    // fallback seguro (NUNCA quebra o EJS)
    res.render("dashboard", {
      user: req.session.user,
      produtos: [],
      pedidos: [],
      pedidosHoje: 0,
      faturamentoHoje: 0,
      faturamentoSemana: [],
      maisVendidos: []
    });
  }
});

/* =========================
   ATUALIZAR STATUS PEDIDO
========================= */
router.post("/pedidos/status/:id", authVendedor, async (req, res) => {
  const { status } = req.body;

  const statusValidos = ["PENDENTE", "CONFIRMADO", "ENTREGUE", "CANCELADO"];

  if (!statusValidos.includes(status)) {
    return res.redirect("/dashboard?erro=Status inválido");
  }

  try {
    await db.query(
      "UPDATE pedidos SET status = ? WHERE id = ? AND vendedor_id = ?",
      [status, req.params.id, req.session.user.id]
    );

    res.redirect("/dashboard");

  } catch (err) {
    console.error(err);
    res.redirect("/dashboard?erro=Erro ao atualizar status");
  }
});

/* =========================
   ➕ NOVO PRODUTO (TELA)
========================= */
router.get("/produtos/novo", authVendedor, (req, res) => {
  res.render("novo-produto");
});

/* =========================
   ➕ CRIAR PRODUTO
========================= */
router.post("/produtos", authVendedor, async (req, res) => {
  const { nome, descricao, preco, estoque } = req.body;
  const vendedorId = req.session.user.id;

  try {
    await db.query(
      `INSERT INTO produtos (nome, descricao, preco, estoque, vendedor_id, status)
       VALUES (?, ?, ?, ?, ?, 'ATIVO')`,
      [nome, descricao, preco, estoque, vendedorId]
    );

    res.redirect("/dashboard");

  } catch (err) {
    console.error(err);
    res.redirect("/dashboard?erro=Erro ao criar produto");
  }
});

/* =========================
   ✏️ EDITAR PRODUTO (TELA)
========================= */
router.get("/produtos/editar/:id", authVendedor, async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM produtos WHERE id = ? AND vendedor_id = ?",
      [req.params.id, req.session.user.id]
    );

    if (!result || result.length === 0) {
      return res.redirect("/dashboard");
    }

    res.render("editar-produto", { produto: result[0] });

  } catch (err) {
    console.error(err);
    res.redirect("/dashboard?erro=Erro ao carregar produto");
  }
});

/* =========================
   💾 SALVAR EDIÇÃO
========================= */
router.post("/produtos/editar/:id", authVendedor, async (req, res) => {
  const { nome, descricao, preco, estoque } = req.body;

  try {
    await db.query(
      `UPDATE produtos 
       SET nome = ?, descricao = ?, preco = ?, estoque = ?
       WHERE id = ? AND vendedor_id = ?`,
      [nome, descricao, preco, estoque, req.params.id, req.session.user.id]
    );

    res.redirect("/dashboard");

  } catch (err) {
    console.error(err);
    res.redirect("/dashboard?erro=Erro ao atualizar produto");
  }
});

/* =========================
   ❌ DELETAR PRODUTO
========================= */
router.post("/produtos/deletar/:id", authVendedor, async (req, res) => {
  try {
    await db.query(
      "DELETE FROM produtos WHERE id = ? AND vendedor_id = ?",
      [req.params.id, req.session.user.id]
    );

    res.redirect("/dashboard");

  } catch (err) {
    console.error(err);
    res.redirect("/dashboard?erro=Erro ao deletar produto");
  }
});

/* =========================
   📋 LISTAR PRODUTOS
========================= */
router.get("/produtos", authVendedor, async (req, res) => {
  const vendedorId = req.session.user.id;

  try {
    const [produtos] = await db.query(
      "SELECT * FROM produtos WHERE vendedor_id = ?",
      [vendedorId]
    );

    res.render("dashboard-produtos", {
      produtos: produtos || [],
      user: req.session.user
    });

  } catch (err) {
    console.error(err);
    res.redirect("/dashboard?erro=Erro ao listar produtos");
  }
});

/* =========================
   📦 LISTAR PEDIDOS
========================= */
router.get("/pedidos", authVendedor, async (req, res) => {
  const vendedorId = req.session.user.id;

  try {
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

    res.render("dashboard-pedidos", {
      pedidos: pedidos || [],
      user: req.session.user
    });

  } catch (err) {
    console.error(err);
    res.redirect("/dashboard?erro=Erro ao listar pedidos");
  }
});

module.exports = router;