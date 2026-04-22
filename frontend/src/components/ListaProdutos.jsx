import api from '../services/api';
import AlertaEstoque from './AlertaEstoque';

// Recebemos 'produtos' e 'carregarProdutos' via props do App.jsx
function ListaProdutos({ produtos, carregarProdutos }) {

  function movimentar(id, tipo) {
    const quantidade = prompt('Digite a quantidade:');

    if (!quantidade || isNaN(quantidade)) {
      alert('Valor inválido');
      return;
    }

    api.post('/movimentacao', {
      produto_id: id,
      tipo,
      quantidade: Number(quantidade)
    }).then(() => carregarProdutos()); // Atualiza o estado global no App.jsx
  }

  function excluirProduto(id) {
    const confirmar = confirm('Tem certeza que deseja excluir?');
    if (!confirmar) return;

    api.delete(`/produtos/${id}`)
      .then(() => carregarProdutos())
      .catch(() => alert('Erro ao excluir'));
  }

  function editarProduto(produto) {
    const nome = prompt('Novo nome:', produto.nome);
    const tipo = prompt('Novo tipo:', produto.tipo);
    const quantidade = prompt('Nova quantidade:', produto.quantidade);
    const minimo = prompt('Quantidade mínima:', produto.quantidade_minima);
    const validade = prompt('Data de validade:', produto.data_validade);

    if (!nome || !tipo || isNaN(quantidade) || isNaN(minimo)) {
      alert('Dados inválidos');
      return;
    }

    api.put(`/produtos/${produto.id}`, {
      nome,
      tipo,
      quantidade: Number(quantidade),
      quantidade_minima: Number(minimo),
      data_validade: validade
    }).then(() => carregarProdutos())
      .catch(() => alert('Erro ao editar'));
  }

  return (
    <div>
      <h2>Estoque</h2>
      <br />

      {produtos.map(p => (
        <div key={p.id} className="card">

          <div className="produto-header">
            <span className="produto-nome">
              {p.nome} ({p.tipo})
            </span>

            <div style={{ textAlign: 'right' }}>
              <div>
                Quantidade: <strong>{p.quantidade}</strong>
                <br />
                Validade: <strong>{p.data_validade || '—'}</strong>
              </div>
              <br />

              <button
                className="btn-delete"
                onClick={() => excluirProduto(p.id)}
              >
                🗑 Excluir
              </button>
              <br />
              
              <button
                className="btn-edit"
                onClick={() => editarProduto(p)}
                style={{ marginTop: '5px' }}
              >
                ✏️ Editar
              </button>
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <button
              className="btn-add"
              onClick={() => movimentar(p.id, 'entrada')}
            >
              ➕ Entrada
            </button>

            <button
              className="btn-remove"
              onClick={() => movimentar(p.id, 'saida')}
              style={{ marginLeft: '5px' }}
            >
              ➖ Saída
            </button>
          </div>

          <AlertaEstoque produto={p} />
        </div>
      ))}
    </div>
  );
}

export default ListaProdutos;