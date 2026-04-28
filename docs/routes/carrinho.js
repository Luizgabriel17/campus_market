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

// ADICIONAR PRODUTO (AJAX)
router.post("/add", authCliente, async (req, res) => {
  const { id } = req.body;

  try {
    const [produtos] = await db.query(
      "SELECT id, nome, preco, vendedor_id FROM produtos WHERE id = ?",
      [id]
    );

    if (produtos.length === 0) {
      return res.json({ erro: "Produto não encontrado" });
    }

    const produto = produtos[0];

    if (!req.session.carrinho) {
      req.session.carrinho = [];
    }

    const carrinho = req.session.carrinho;

    if (carrinho.length > 0 && carrinho[0].vendedor_id !== produto.vendedor_id) {
      return res.json({ erro: "Você só pode comprar de um vendedor por vez" });
    }

    const item = carrinho.find(p => p.id == produto.id);

    if (item) {
      item.quantidade++;
    } else {
      carrinho.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        vendedor_id: produto.vendedor_id,
        quantidade: 1
      });
    }

    return res.json({
      sucesso: true,
      carrinho
    });

  } catch (err) {
    console.error(err);
    return res.json({ erro: "Erro interno" });
  }
});

// UPDATE
router.post("/update", authCliente, (req, res) => {
  const { id, acao } = req.body;

  let carrinho = req.session.carrinho || [];
  const item = carrinho.find(p => p.id == id);

  if (!item) return res.redirect("/cliente");

  if (acao === "mais") item.quantidade++;
  if (acao === "menos") item.quantidade--;

  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(p => p.id != id);
  }

  req.session.carrinho = carrinho;

  return res.redirect("/cliente?openCart=1");
});

// REMOVE
router.post("/remove", authCliente, (req, res) => {
  const { id } = req.body;

  req.session.carrinho = (req.session.carrinho || []).filter(p => p.id != id);

  return res.redirect("/cliente?openCart=1");
});

module.exports = router;