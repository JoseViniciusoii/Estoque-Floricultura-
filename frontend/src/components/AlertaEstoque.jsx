import React from 'react';

const AlertaEstoque = ({ produtos = [], usuarioLogado = "Administrador" }) => {
  // Filtramos apenas os produtos que estão com stock crítico
const produtosCriticos = produtos.filter(p => {
  const qtd = Number(p.quantidade || 0);
  // Aceita 'quantidade_minima' ou apenas 'minimo' (o que vier do banco)
  const limite = Number(p.quantidade_minima || p.minimo || 0);
  
  // Se a quantidade for menor ou igual ao limite, é crítico
  return qtd <= limite;
});

  return (
    <div style={styles.alertaContainer}>
      {/* Requisito Entrega 05: Exibição do nome do utilizador logado */}
      <div style={styles.headerAlerta}>
        <span>Sessão ativa: <strong>{usuarioLogado}</strong></span>
      </div>

      {/* Requisito Entrega 07: Alerta quando o nível estiver abaixo do mínimo */}
      {produtosCriticos.length > 0 ? (
        <div style={styles.bannerErro}>
          <strong style={{ fontSize: '16px' }}>⚠️ ATENÇÃO: Stock Crítico Detectado</strong>
          <ul style={styles.lista}>
            {produtosCriticos.map(p => (
              <li key={p.id} style={styles.item}>
                {p.nome}: Restam apenas {p.quantidade} unidades (Mínimo: {p.quantidade_minima})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div style={styles.bannerSucesso}>
          ✅ Todos os níveis de stock estão conformes.
        </div>
      )}
    </div>
  );
};

const styles = {
  alertaContainer: {
    marginBottom: '20px',
    fontFamily: 'sans-serif'
  },
  headerAlerta: {
    fontSize: '13px',
    color: '#666',
    textAlign: 'right',
    marginBottom: '10px'
  },
  bannerErro: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ef9a9a'
  },
  bannerSucesso: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #a5d6a7',
    fontSize: '14px'
  },
  lista: {
    marginTop: '10px',
    paddingLeft: '20px',
    fontSize: '14px'
  },
  item: {
    marginBottom: '5px'
  }
};

export default AlertaEstoque;