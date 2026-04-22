const express = require("express");
const router = express.Router();
const db = require("../database/database");

// Middleware
function authCliente(req, res, next) {
  if (!req.session.user || req.session.user.tipo !== "cliente") {
    return res.redirect("/login");
  }
  next();
}

// SESSÃO INICIAL CLIENTE
router.get("/", authCliente, async (req, res) => {
  try {
    const [produtos] = await db.query(`
      SELECT 
        p.id,
        p.nome,
        p.descricao,
        p.preco,
        p.estoque,
        p.vendedor_id,
        v.nome AS vendedor_nome,
        ROUND(IFNULL(AVG(a.nota), 0), 1) AS media_avaliacao
      FROM produtos p
      JOIN vendedor v ON p.vendedor_id = v.id
      LEFT JOIN avaliacoes a ON a.vendedor_id = v.id
      WHERE p.status = 'ATIVO'
      GROUP BY p.id
      ORDER BY p.id DESC
    `);

    const [vendedores] = await db.query(
      "SELECT id, nome FROM vendedor"
    );

    res.render("cliente", {
  user: req.session.user,
  produtos: produtos || [],
  vendedores: vendedores || [],
  carrinho: req.session.carrinho || []
});

  } catch (err) {
    console.error(err);
    res.send("Erro ao carregar página");
  }
});

// PRODUTOS POR VENDEDOR
router.get("/vendedor/:id", authCliente, async (req, res) => {
  const vendedorId = req.params.id;

  try {
    const [produtos] = await db.query(`
      SELECT 
        p.*,
        v.nome AS vendedor_nome,
        ROUND(IFNULL(AVG(a.nota), 0), 1) AS media_avaliacao
      FROM produtos p
      JOIN vendedor v ON p.vendedor_id = v.id
      LEFT JOIN avaliacoes a ON a.vendedor_id = v.id
      WHERE v.id = ?
      GROUP BY p.id
    `, [vendedorId]);

    res.render("cliente", {
  user: req.session.user,
  produtos: produtos || [],
  vendedores: vendedores || [],
  carrinho: req.session.carrinho || []
});

  } catch (err) {
    console.error(err);
    res.send("Erro ao buscar produtos");
  }
});

module.exports = router;