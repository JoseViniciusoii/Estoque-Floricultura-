const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

/* LISTAR PRODUTOS */
app.get('/produtos', (req, res) => {
  db.all('SELECT * FROM produtos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* CADASTRAR PRODUTO */
app.post('/produtos', (req, res) => {
  const { nome, tipo, quantidade, quantidade_minima, data_validade } = req.body;

  // Removido o campo 'preco' que estava causando erro no SQLite
  const sql = `INSERT INTO produtos (nome, tipo, quantidade, quantidade_minima, data_validade) VALUES (?, ?, ?, ?, ?)`;
  const params = [nome, tipo, Number(quantidade) || 0, Number(quantidade_minima) || 0, data_validade];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("❌ ERRO NO CADASTRO:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`✅ Produto cadastrado! ID: ${this.lastID}`);
    res.json({ id: this.lastID });
  });
});

/* ROTA DE MOVIMENTAÇÃO */
app.patch('/produtos/:id/movimentar', (req, res) => {
  const { id } = req.params;
  const { tipo, quantidadeManual } = req.body;
  const idLimpo = id.includes(':') ? id.split(':')[0] : id;

  db.get('SELECT * FROM produtos WHERE id = ?', [idLimpo], (err, produto) => {
    if (err || !produto) return res.status(404).json({ error: "Produto não encontrado" });

    const valor = Number(quantidadeManual) || 1;
    let novaQtd = tipo === 'entrada' 
      ? Number(produto.quantidade) + valor 
      : Math.max(0, Number(produto.quantidade) - valor);

    db.run('UPDATE produtos SET quantidade = ? WHERE id = ?', [novaQtd, idLimpo], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      console.log(`📦 Movimentação: ${tipo} | ID ${idLimpo} agora é ${novaQtd}`);
      res.json({ success: true, novaQuantidade: novaQtd });
    });
  });
});

/* EDITAR PRODUTO COMPLETO */
app.put('/produtos/:id', (req, res) => {
  let { id } = req.params;
  const { nome, tipo, quantidade, quantidade_minima, data_validade } = req.body;
  const idLimpo = id.includes(':') ? id.split(':')[0] : id;

  const sql = `UPDATE produtos SET nome = ?, tipo = ?, quantidade = ?, quantidade_minima = ?, data_validade = ? WHERE id = ?`;
  const params = [nome, tipo, Number(quantidade), Number(quantidade_minima), data_validade, idLimpo];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    console.log(`✏️ Sucesso! Produto ${idLimpo} editado.`);
    res.json({ message: "Produto atualizado com sucesso" });
  });
});

/* EXCLUIR PRODUTO */
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const idLimpo = id.includes(':') ? id.split(':')[0] : id;

  db.run('DELETE FROM produtos WHERE id = ?', [idLimpo], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    console.log(`🗑️ Produto ${idLimpo} removido.`);
    res.json({ message: 'Produto excluído com sucesso' });
  });
});

/* 🚀 INICIAR SERVIDOR */
app.listen(3000, () => {
  console.log('Backend Urban Flora rodando em http://localhost:3000');
});