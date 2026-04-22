import { useState, useEffect } from 'react';
import './App.css';
import api from './services/api';
import ProdutoForm from './components/ProdutoForm';
import ListaProdutos from './components/ListaProdutos';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import logoUrbanFlora from './assets/logo.png';

function App() {
  const [produtos, setProdutos] = useState([]);

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

  if (!logado) {
    return <Login aoLogar={fazerLogin} />;
  }

  return (
    <div className="container">
      <header style={styles.header}>

        <div style={styles.logoContainer}>
          <img
            src={logoUrbanFlora}
            alt="Urban Flora - Sistema de Controle de Estoque"
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

      <div className="card">
        <ProdutoForm carregarProdutos={carregarProdutos} />
      </div>

      <div className="card">
        <ListaProdutos produtos={produtos} carregarProdutos={carregarProdutos} />
      </div>
    </div>
  );
}

// Estilos adicionados diretamente para facilitar
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e1e8ed' // Uma linha sutil para separar
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoImage: {
    height: '100px',
    width: 'auto'
  },
  btnLogout: {
    padding: '8px 18px',
    backgroundColor: '#e74c3c', // Vermelho para destacar a ação
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }
};

export default App;