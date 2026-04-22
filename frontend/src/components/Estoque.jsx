import api from '../services/api';

function Estoque({ produtos, carregarProdutos }) {

  // Ordenação Alfabética para a Entrega 07
  const produtosOrdenados = Array.isArray(produtos)
    ? [...produtos].sort((a, b) => a.nome.localeCompare(b.nome))
    : [];

  // --- FUNÇÕES DE AÇÃO ---

  function movimentar(id, tipo) {
    const idLimpo = String(id).split(':')[0];
    const qtdStr = prompt(`Digite a quantidade para ${tipo}:`);
    const quantidade = Number(qtdStr);

    if (!qtdStr || isNaN(quantidade) || quantidade <= 0) return;

    api.patch(`/produtos/${idLimpo}/movimentar`, {
      tipo: tipo,
      quantidadeManual: quantidade
    })
      .then(() => carregarProdutos()) // Atualiza a tela na hora
      .catch(err => alert("Erro ao movimentar estoque."));
  }

  function excluirProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    api.delete(`/produtos/${id}`)
      .then(() => carregarProdutos()) // Atualiza a tela na hora
      .catch(() => alert('Erro ao excluir'));
  }

function editarProduto(produto) {
    const nome = prompt('Novo nome:', produto.nome);
    const tipo = prompt('Novo tipo:', produto.tipo);
    const quantidade = prompt('Nova quantidade:', produto.quantidade);
    const minimo = prompt('Estoque mínimo:', produto.quantidade_minima || produto.minimo);
    
    const validade = prompt('Nova data de validade (AAAA-MM-DD):', produto.data_validade || produto.validade);

    if (!nome || !tipo || isNaN(quantidade)) {
      alert('Dados inválidos');
      return;
    }

    api.put(`/produtos/${produto.id}`, {
      nome,
      tipo,
      quantidade: Number(quantidade),
      quantidade_minima: Number(minimo),
      // 🚩 GARANTA QUE ESTÁ ENVIANDO A NOVA VALIDADE PARA O BACKEND:
      data_validade: validade 
    })
    .then(() => {
      carregarProdutos(); // Atualiza a tela instantaneamente
    })
    .catch(() => alert('Erro ao editar'));
  }

  // --- RENDERIZAÇÃO ---

  if (produtosOrdenados.length === 0) {
    return <p style={{ padding: '20px' }}>Carregando inventário...</p>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Gerenciamento de Inventário</h2>

      {produtosOrdenados.map(p => {
        // Lógica de Estoque Crítico
        const estoqueAtual = Number(p.quantidade || 0);
        const estoqueMinimo = Number(p.quantidade_minima || p.minimo || 0);
        const isCritico = estoqueAtual <= estoqueMinimo;

        return (
          <div key={p.id} className="card" style={{
            borderLeft: isCritico ? '5px solid #f44336' : '5px solid #4CAF50',
            marginBottom: '15px'
          }}>

            <div className="produto-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="produto-nome" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {p.nome}
                </span>
                <br />
                <small style={{ color: '#666' }}>Tipo: {p.tipo}</small>
                <br />
                {/* CORREÇÃO DA DATA */}
                <small style={{ color: '#e67e22', fontWeight: 'bold' }}>
                  Validade: {p.data_validade || p.validade || 'Não informada'}
                </small>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: '8px' }}>
                  Quantidade: <strong style={{ color: isCritico ? '#f44336' : '#2e7d32' }}>{p.quantidade}</strong>
                  <br />
                  <small>Mínimo: {estoqueMinimo}</small>
                </div>

                {/* Botões de Gestão (✏️ e 🗑) */}
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                  <button className="btn-edit" onClick={() => editarProduto(p)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                    ✏️ Editar
                  </button>
                  <button className="btn-delete" onClick={() => excluirProduto(p.id)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                    🗑 Excluir
                  </button>
                </div>
              </div>
            </div>

            {/* Botões de Movimentação (➕ e ➖) */}
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <button className="btn-add" onClick={() => movimentar(p.id, 'entrada')} style={{ flex: 1 }}>
                ➕ Entrada
              </button>
              <button className="btn-remove" onClick={() => movimentar(p.id, 'saida')} style={{ flex: 1 }}>
                ➖ Saída
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default Estoque;