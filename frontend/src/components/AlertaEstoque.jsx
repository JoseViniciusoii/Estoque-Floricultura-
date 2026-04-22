function AlertaEstoque({ produto }) {
  if (produto.quantidade <= produto.quantidade_minima) {
    return (
      <p style={{ 
        color: 'white',
        backgroundColor: 'red',
        padding: '5px',
        borderRadius: '5px',
        display: 'inline-block',
        marginTop: '5px'
      }}>
        ⚠ Estoque baixo!
      </p>
    );
  }

  return (
    <p style={{ 
      color: 'white',
      backgroundColor: 'green',
      padding: '5px',
      borderRadius: '5px',
      display: 'inline-block',
      marginTop: '5px'
    }}>
      ✔ Estoque OK
    </p>
  );
}

export default AlertaEstoque;