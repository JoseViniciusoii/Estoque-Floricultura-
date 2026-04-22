import React from 'react';

const Dashboard = ({ produtos = [] }) => {

  const listaSegura = Array.isArray(produtos) ? produtos : [];

  const totalItens = listaSegura.length;
  
  const estoqueBaixo = listaSegura.filter(p => {
    const atual = Number(p.quantidade || 0);
    const min = Number(p.quantidade_minima || p.minimo || 0);
    // Só conta se tiver estoque baixo E se a quantidade for maior que zero 
    // (opcional: remova 'atual > 0' se quiser contar itens zerados como críticos)
    return atual <= min;
  }).length;

  const riscoPerda = listaSegura.filter(p => {
    const dataStr = p.data_validade || p.validade;
    if (!dataStr) return false;

    // Normalização das datas para comparar apenas o "dia"
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataValidade = new Date(dataStr);
    // Adicionamos um ajuste manual caso a data venha como string YYYY-MM-DD
    // para evitar problemas de fuso horário que jogam a data para o dia anterior
    if (dataStr.includes('-')) {
        dataValidade.setMinutes(dataValidade.getMinutes() + dataValidade.getTimezoneOffset());
    }
    dataValidade.setHours(0, 0, 0, 0);
    
    const diffEmMs = dataValidade - hoje;
    const diffEmDias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

    // ATUALIZAÇÃO: Conta se vencer em até 3 dias OU se já estiver vencido (menor que 0)
    return diffEmDias <= 3;
  }).length;

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, borderLeft: '5px solid #2196F3' }}>
        <span style={styles.label}>Total de Itens</span>
        <strong style={styles.valor}>{totalItens}</strong>
      </div>

      <div style={{ ...styles.card, borderLeft: '5px solid #f44336' }}>
        <span style={styles.label}>Estoque Crítico</span>
        <strong style={{...styles.valor, color: '#f44336'}}>{estoqueBaixo}</strong>
      </div>

      <div style={{ ...styles.card, borderLeft: '5px solid #ff9800' }}>
        <span style={styles.label}>Risco de Perda</span>
        <strong style={{...styles.valor, color: '#ff9800'}}>{riscoPerda}</strong>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column'
  },
  label: { fontSize: '11px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' },
  valor: { fontSize: '24px', marginTop: '5px' }
};

export default Dashboard;