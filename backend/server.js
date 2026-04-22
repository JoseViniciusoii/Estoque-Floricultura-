const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

/* 📌 LISTAR PRODUTOS */
app.get('/produtos', (req, res) => {
  db.all('SELECT * FROM produtos', [], (err, rows) => {
    res.json(rows);
  });
});

/* 📌 CADASTRAR PRODUTO */
app.post('/produtos', (req, res) => {
  const { nome, tipo, quantidade, quantidade_minima, data_validade } = req.body;

  db.run(
    `INSERT INTO produtos (nome, tipo, quantidade, quantidade_minima, data_validade)
     VALUES (?, ?, ?, ?, ?)`,
    [nome, tipo, quantidade, quantidade_minima, data_validade],
    function (err) {
      res.json({ id: this.lastID });
    }
  );
});

/* 📌 MOVIMENTAÇÃO */
app.post('/movimentacao', (req, res) => {
  const { produto_id, tipo, quantidade } = req.body;

  db.get('SELECT quantidade FROM produtos WHERE id = ?', [produto_id], (err, produto) => {
    let novaQuantidade = produto.quantidade;

    if (tipo === 'entrada') {
      novaQuantidade += quantidade;
    } else {
      novaQuantidade -= quantidade;
    }

    db.run('UPDATE produtos SET quantidade = ? WHERE id = ?', [novaQuantidade, produto_id]);

    db.run(
      `INSERT INTO movimentacoes (produto_id, tipo, quantidade, data)
       VALUES (?, ?, ?, datetime('now'))`,
      [produto_id, tipo, quantidade]
    );

    res.json({ message: 'Movimentação registrada' });
  });
});

/* 🚀 INICIAR SERVIDOR */
app.listen(3000, () => {
  console.log('Backend rodando em http://localhost:3000');
});

/* ❌ EXCLUIR PRODUTO */
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM produtos WHERE id = ?', [id], function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'Produto excluído com sucesso' });
  });
});

/* ✏️ EDITAR PRODUTO */
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, tipo, quantidade, quantidade_minima, data_validade } = req.body;

  db.run(
    `UPDATE produtos 
     SET nome = ?, tipo = ?, quantidade = ?, quantidade_minima = ?, data_validade = ?
     WHERE id = ?`,
    [nome, tipo, quantidade, quantidade_minima, data_validade, id],
    function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: 'Produto atualizado com sucesso' });
    }
  );
});