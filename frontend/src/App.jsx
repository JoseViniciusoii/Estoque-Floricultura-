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
  const [paginaAtiva, setPaginaAtiva] = useState('dashboard');

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
    if (logado) carregarProdutos();
  }, [logado]);

  const fazerLogin = () => {
    setLogado(true);
    localStorage.setItem('urban_flora_logado', 'true');
  };

  const fazerLogout = () => {
    if (window.confirm("Deseja realmente sair do sistema?")) {
      setLogado(false);
      localStorage.removeItem('urban_flora_logado');
    }
  };

  const manipularMovimentacao = async (id, tipo) => {
    try {
      await api.patch(`/produtos/${id}/movimentar`, { tipo });
      carregarProdutos();
    } catch (error) {
      alert("Erro ao processar movimentação.");
    }
  };

  // RENDERIZAÇÃO DE PÁGINAS 
  const renderizarConteudo = () => {
    switch (paginaAtiva) {
      case 'dashboard':
        return (
          <>
            <header style={styles.topHeader}>
              <div>
                <h1 style={styles.pageTitle}>Visão Geral</h1>
                <p style={styles.welcomeText}>Bem-vindo, {usuarioLogado}</p>
              </div>
              <img src={logoUrbanFlora} alt="Logo" style={styles.miniLogo} />

            </header>

            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Painel de Controle</h3>
              <Dashboard produtos={produtos} />
            </section>

            <AlertaEstoque produtos={produtos} usuarioLogado={usuarioLogado} />

            <div style={styles.workAreaGrid}>
              <div className="card" style={styles.cardInternal}>
                <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Novo Cadastro</h3>
                <ProdutoForm carregarProdutos={carregarProdutos} />
              </div>
              <div className="card" style={{ ...styles.cardInternal, background: '#fcf8e3', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ color: '#8a6d3b' }}>Lembrete</h4>
                <br />
                <p>Por favor, manter sempre os produtos atualizados!</p>
              </div>
            </div>
          </>
        );

      case 'inventario':
        return (
          <>
            <header style={styles.topHeader}>
            </header>
            <div className="card" style={styles.cardInternal}>
              <Estoque produtos={produtos} carregarProdutos={carregarProdutos} onMovimentacao={manipularMovimentacao} />
            </div>
          </>
        );

      case 'vencimentos':
        const produtosComData = produtos.filter(p => p.data_validade).sort((a, b) => new Date(a.data_validade) - new Date(b.data_validade));
        return (
          <>
            <header style={styles.topHeader}>
              <h1 style={styles.pageTitle}>Controle de Validade</h1>
            </header>
            <div className="card" style={styles.cardInternal}>
              <table style={styles.table}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={styles.th}>Produto</th>
                    <th style={styles.th}>Tipo</th>
                    <th style={styles.th}>Data de Vencimento</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosComData.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.td}>{p.nome}</td>
                      <td style={styles.td}>{p.tipo}</td>
                      <td style={{ ...styles.td, color: '#e74c3c', fontWeight: 'bold' }}>{p.data_validade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'configuracoes':
        return (
          <>
            <header style={styles.topHeader}><h1 style={styles.pageTitle}>Configurações</h1></header>
            <div className="card" style={styles.cardInternal}>
              <h3>Informações do Sistema</h3>
              <br /><br />
              <p><strong>Usuário:</strong> {usuarioLogado}</p>
              <br />
              <p><strong>Status do Banco:</strong> Conectado (SQLite)</p>
              <br />
              <p><strong>Versão:</strong> 2.0 - VERSÃO FINAL</p>
            </div>
          </>
        );

      default:
        return <h2>Página não encontrada</h2>;
    }
  };

  if (!logado) {
    return <Login aoLogar={fazerLogin} />;
  }

  return (
    <div style={styles.layoutWrapper}>
      {/* SIDEBAR FIXA */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <h2 style={styles.brandName}>URBAN FLORA</h2>
        </div>
        <nav style={styles.navMenu}>
          <div onClick={() => setPaginaAtiva('dashboard')} style={{ ...styles.navItem, ...(paginaAtiva === 'dashboard' ? styles.navItemActive : {}) }}>📊 Dashboard</div>
          <div onClick={() => setPaginaAtiva('inventario')} style={{ ...styles.navItem, ...(paginaAtiva === 'inventario' ? styles.navItemActive : {}) }}>📦 Inventário</div>
          <div onClick={() => setPaginaAtiva('vencimentos')} style={{ ...styles.navItem, ...(paginaAtiva === 'vencimentos' ? styles.navItemActive : {}) }}>📅 Vencimentos</div>
          <div onClick={() => setPaginaAtiva('configuracoes')} style={{ ...styles.navItem, ...(paginaAtiva === 'configuracoes' ? styles.navItemActive : {}) }}>⚙️ Configurações</div>
        </nav>
        <button onClick={fazerLogout} style={styles.sidebarLogout}>⬅ Sair do Sistema</button>
      </aside>

      {/* CONTEÚDO COM CENTRALIZAÇÃO AJUSTADA */}
      <main style={styles.mainContent}>
        <div style={styles.containerInterno}>
          {renderizarConteudo()}
        </div>
      </main>
    </div>
  );
}

const styles = {
  layoutWrapper: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' },
  sidebar: { width: '260px', backgroundColor: '#1a2a44', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 100 },
  sidebarLogo: { padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid #2c3e50' },
  miniLogo: { height: '90px', marginBottom: '10px' },
  brandName: { fontSize: '1.2rem', color: '#f1c40f', margin: 0 },
  navMenu: { padding: '20px 0', flex: 1 },
  navItem: { padding: '15px 25px', cursor: 'pointer', transition: '0.3s', color: '#bdc3c7', fontSize: '15px' },
  navItemActive: { backgroundColor: '#2c3e50', color: 'white', borderLeft: '5px solid #f1c40f' },
  sidebarLogout: { padding: '20px', backgroundColor: 'transparent', color: '#e74c3c', border: 'none', borderTop: '1px solid #2c3e50', cursor: 'pointer', fontWeight: 'bold' },

  mainContent: { marginLeft: '260px', flex: 1, padding: '40px', display: 'flex', justifyContent: 'center' },
  containerInterno: { width: '100%', maxWidth: '1100px' }, 

  topHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  pageTitle: { fontSize: '1.8rem', color: '#2c3e50', margin: 0 },
  welcomeText: { color: '#7f8c8d', fontSize: '14px' },
  btnExport: { padding: '10px 20px', backgroundColor: '#f1c40f', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  section: { marginBottom: '30px' },
  sectionTitle: { fontSize: '1.1rem', color: '#2c3e50', marginBottom: '15px' },
  workAreaGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' },
  cardInternal: { padding: '20px', borderRadius: '12px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: 'none' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', color: '#7f8c8d', fontSize: '13px', textTransform: 'uppercase' },
  td: { padding: '12px', color: '#2c3e50' }
};

export default App;