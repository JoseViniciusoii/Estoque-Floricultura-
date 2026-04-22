import { useState, useEffect } from 'react';
import './App.css';
import api from './services/api';
import ProdutoForm from './components/ProdutoForm';
import Estoque from './components/Estoque';
import AlertaEstoque from './components/AlertaEstoque';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import logoUrbanFlora from './assets/logo.png';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [usuarioLogado] = useState("Administrador");

  const [logado, setLogado] = useState(() => {
    return localStorage.getItem('urban_flora_logado') === 'true';
  });

  const carregarProdutos = async () => {
    try {
      const res = await api.get('/produtos');
      setProdutos(res.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  useEffect(() => {
    if (logado) {
      carregarProdutos();
    }
  }, [logado]);

  const fazerLogin = () => {
    setLogado(true);
    localStorage.setItem('urban_flora_logado', 'true');
  };

  const fazerLogout = () => {
    const confirmar = window.confirm("Deseja realmente sair do sistema?");
    if (confirmar) {
      setLogado(false);
      localStorage.removeItem('urban_flora_logado');
    }
  };

  // 📌 Entrega 07: Atualização automática das quantidades
  const manipularMovimentacao = async (id, tipo) => {
    try {
      // Importante: id deve ser passado na URL e tipo no corpo
      await api.patch(`/produtos/${id}/movimentar`, { tipo });
      carregarProdutos(); // Recarrega a lista para mostrar o novo valor
    } catch (error) {
      console.error("Erro detalhado:", error.response?.data || error.message);
      alert("Erro ao processar movimentação. Verifique se o Backend está rodando.");
    }
  };

  // 📌 Entrega 06: Exclusão de registros
  const manipularDelete = async (id) => {
    if (window.confirm("Excluir este produto permanentemente?")) {
      try {
        await api.delete(`/produtos/${id}`);
        carregarProdutos();
      } catch (error) {
        alert("Erro ao excluir produto.");
      }
    }
  };

  // 📌 Entrega 06: Edição de registros
  const manipularEdit = async (produto) => {
    const novoNome = prompt("Editar nome do produto:", produto.nome);
    if (novoNome && novoNome !== produto.nome) {
      try {
        await api.put(`/produtos/${produto.id}`, { ...produto, nome: novoNome });
        carregarProdutos();
      } catch (error) {
        alert("Erro ao editar produto.");
      }
    }
  };

  if (!logado) {
    return <Login aoLogar={fazerLogin} />;
  }

  return (
    <div className="container">
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img
            src={logoUrbanFlora}
            alt="Urban Flora"
            style={styles.logoImage}
          />
        </div>

        <button
          onClick={fazerLogout}
          style={styles.btnLogout}
        >
          Sair
        </button>
      </header>

      <Dashboard produtos={produtos} />

      {/* Entrega 05 e 07: Alerta e Identificação */}
      <AlertaEstoque produtos={produtos} usuarioLogado={usuarioLogado} />

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Novo Cadastro</h3>
        <ProdutoForm carregarProdutos={carregarProdutos} />
      </div>

      <div className="card">
        <Estoque
          produtos={produtos}
          carregarProdutos={carregarProdutos} // Verifique se esta prop existe aqui!
          onMovimentacao={manipularMovimentacao} // Se você usa essa função, carregarProdutos deve estar dentro dela
          onDelete={manipularDelete}
          onEdit={manipularEdit}
        />
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e1e8ed'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoImage: {
    height: '80px',
    width: 'auto'
  },
  btnLogout: {
    padding: '8px 18px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
};

export default App; 