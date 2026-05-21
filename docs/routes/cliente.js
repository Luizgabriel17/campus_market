const express = require("express");
const router = express.Router();
const db = require("../database/database");

// TODOS PRODUTOS
router.get("/", async (req, res) => {
  try {
    const [produtos] = await db.query(`
      SELECT 
        p.id,
        p.nome,
        p.descricao,
        p.preco,
        p.estoque,
        v.nome AS vendedor_nome,
        ROUND(IFNULL(AVG(a.nota), 0), 1) AS media_avaliacao
      FROM produtos p
      JOIN vendedor v ON p.vendedor_id = v.id
      LEFT JOIN avaliacoes a ON a.vendedor_id = v.id
      WHERE p.status = 'ATIVO'
      GROUP BY p.id
      ORDER BY p.id DESC
    `);

    res.json({ success: true, data: produtos });

  } catch (err) {
    res.status(500).json({ success: false, error: "Erro ao buscar produtos" });
  }
});

// PRODUTOS POR VENDEDOR
router.get("/vendedor/:id", async (req, res) => {
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

    res.json({ success: true, data: produtos });

  } catch (err) {
    res.status(500).json({ success: false, error: "Erro ao buscar produtos" });
  }
});

module.exports = router;