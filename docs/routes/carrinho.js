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

// VER CARRINHO (opcional, pode nem usar)
router.get("/", authCliente, (req, res) => {
  res.render("carrinho", {
    carrinho: req.session.carrinho || []
  });
});

// ADICIONAR PRODUTO
router.post("/add", authCliente, async (req, res) => {
  const { id } = req.body;

  try {
    const [produtos] = await db.query(
      "SELECT id, nome, preco, vendedor_id FROM produtos WHERE id = ?",
      [id]
    );

    if (produtos.length === 0) {
      return res.redirect("/cliente?erro=Produto não encontrado");
    }

    const produto = produtos[0];

    if (!req.session.carrinho) {
      req.session.carrinho = [];
    }

    const carrinho = req.session.carrinho;

    // impedir múltiplos vendedores
    if (carrinho.length > 0 && carrinho[0].vendedor_id !== produto.vendedor_id) {
      return res.redirect("/cliente?erro=Você só pode comprar de um vendedor por vez");
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

    return res.redirect("/cliente?openCart=1");

  } catch (err) {
    console.error(err);
    return res.redirect("/cliente?erro=Erro ao adicionar produto");
  }
});

// ALTERAR QUANTIDADE
router.post("/update", authCliente, (req, res) => {
  const { id, acao } = req.body;

  let carrinho = req.session.carrinho || [];
  const item = carrinho.find(p => p.id == id);

  if (!item) return res.redirect("/cliente");

  if (acao === "mais") {
    item.quantidade++;
  }

  if (acao === "menos") {
    item.quantidade--;
  }

  // remove automaticamente se chegar a 0
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(p => p.id != id);
  }

  req.session.carrinho = carrinho;

  return res.redirect("/cliente?openCart=1");
});

// REMOVER ITEM
router.post("/remove", authCliente, (req, res) => {
  const { id } = req.body;

  const carrinho = req.session.carrinho || [];

  req.session.carrinho = carrinho.filter(p => p.id != id);

  return res.redirect("/cliente?openCart=1");
});

module.exports = router;