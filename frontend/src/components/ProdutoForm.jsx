import { useState } from 'react';
import api from '../services/api';

function ProdutoForm() {
  const [form, setForm] = useState({
    nome: '',
    tipo: '',
    quantidade: 0,
    quantidade_minima: 0,
    data_validade: ''
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    api.post('/produtos', form).then(() => {
      alert('Produto cadastrado!');
      window.location.reload();
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="nome" placeholder="Nome" onChange={handleChange} />
      <input name="tipo" placeholder="Tipo" onChange={handleChange} />
      <input name="quantidade" type="number" placeholder="Quantidade" onChange={handleChange} />
      <input name="quantidade_minima" type="number" placeholder="Mínimo" onChange={handleChange} />
      <input name="data_validade" type="date" onChange={handleChange} />

      <button type="submit" className="btn-add">
        Cadastrar
      </button>
    </form>
  );
}

export default ProdutoForm;