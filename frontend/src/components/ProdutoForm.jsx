import { useState } from 'react';
import api from '../services/api';

function ProdutoForm({ carregarProdutos }) {
  
  const [form, setForm] = useState({
    nome: '',
    tipo: '',
    quantidade: '', 
    quantidade_minima: '',
    data_validade: ''
  });

  function handleChange(e) {
  
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.nome || !form.tipo) {
      alert("Por favor, preencha o nome e o tipo!");
      return;
    }

    const dadosParaEnviar = {
      ...form,
      quantidade: Number(form.quantidade) || 0,
      quantidade_minima: Number(form.quantidade_minima) || 0
    };

    api.post('/produtos', dadosParaEnviar)
      .then(() => {
        alert('Produto cadastrado com sucesso!');
        // Limpamos voltando para strings vazias
        setForm({ nome: '', tipo: '', quantidade: '', quantidade_minima: '', data_validade: '' });
        if (carregarProdutos) carregarProdutos();
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao cadastrar. Verifique o terminal do VS Code.');
      });
  }

  return (
    <form onSubmit={handleSubmit} className="cadastro-form">
      <input 
        name="nome" 
        value={form.nome} 
        placeholder="Nome do Produto" 
        onChange={handleChange} 
        required 
      />
      <input 
        name="tipo" 
        value={form.tipo} 
        placeholder="Tipo do Produto" 
        onChange={handleChange} 
        required 
      />
      <input 
        name="quantidade" 
        value={form.quantidade} 
        type="number" 
        placeholder="Quantidade" 
        onChange={handleChange} 
      />
      <input 
        name="quantidade_minima" 
        value={form.quantidade_minima} 
        type="number" 
        placeholder="Quantidade Mínima" 
        onChange={handleChange} 
      />
      <input 
        name="data_validade" 
        value={form.data_validade} 
        type="date" 
        onChange={handleChange} 
      />

      <button type="submit" className="btn-add">
        Cadastrar Produto
      </button>
    </form>
  );
}

export default ProdutoForm;