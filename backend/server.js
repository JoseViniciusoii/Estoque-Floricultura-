const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

/* 📌 LISTAR PRODUTOS */
app.get('/produtos', (req, res) => {
  db.all('SELECT * FROM produtos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* 📌 CADASTRAR PRODUTO */
app.post('/produtos', (req, res) => {
  const { nome, tipo, quantidade, quantidade_minima, data_validade, preco } = req.body;

  db.run(
    `INSERT INTO produtos (nome, tipo, quantidade, quantidade_minima, data_validade, preco)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nome, tipo, quantidade, quantidade_minima, data_validade, preco],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

/* 📌 ROTA DE MOVIMENTAÇÃO ATUALIZADA PARA O PROMPT */
app.patch('/produtos/:id/movimentar', (req, res) => {
  const { id } = req.params;
  const { tipo, quantidadeManual } = req.body;

  console.log(`Log: Alterando ID ${id} | Tipo: ${tipo} | Qtd: ${quantidadeManual}`);

  // Buscamos o produto para saber a quantidade atual
  db.get('SELECT * FROM produtos WHERE id = ?', [id], (err, produto) => {
    if (err) {
      console.error("Erro ao buscar:", err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });

    const valor = Number(quantidadeManual) || 1;
    let novaQtd = tipo === 'entrada' 
      ? Number(produto.quantidade) + valor 
      : Math.max(0, Number(produto.quantidade) - valor);

    // 🚩 ATENÇÃO: Verifique se sua coluna chama 'quantidade' ou 'estoque'
    db.run('UPDATE produtos SET quantidade = ? WHERE id = ?', [novaQtd, id], function(err) {
      if (err) {
        console.error("ERRO NO UPDATE:", err.message); // Este log aparecerá no seu terminal se falhar
        return res.status(500).json({ error: err.message });
      }
      console.log(`Sucesso! Nova quantidade do ID ${id}: ${novaQtd}`);
      res.json({ success: true, novaQuantidade: novaQtd });
    });
  });
});

/* ✏️ EDITAR PRODUTO COMPLETO */
app.put('/produtos/:id', (req, res) => {
  let { id } = req.params;
  const { nome, tipo, quantidade, quantidade_minima, data_validade } = req.body;

  // Limpeza de ID para evitar erros de formato (ex: 10:1)
  id = id.includes(':') ? id.split(':')[0] : id;

  const sql = `
    UPDATE produtos 
    SET nome = ?, tipo = ?, quantidade = ?, quantidade_minima = ?, data_validade = ?
    WHERE id = ?
  `;

  const params = [nome, tipo, quantidade, quantidade_minima, data_validade, id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error("ERRO NA EDIÇÃO:", err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    console.log(`Sucesso! Produto ${id} editado.`);
    res.json({ message: "Produto atualizado com sucesso" });
  });
});

/* ❌ EXCLUIR PRODUTO */
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM produtos WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Produto excluído com sucesso' });
  });
});

/* 🚀 INICIAR SERVIDOR */
app.listen(3000, () => {
  console.log('Backend Urban Flora rodando em http://localhost:3000');
});