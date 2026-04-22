import React, { useState } from 'react';
import logoImage from '../assets/logo.png';

// Componente interno para renderizar o ícone SVG dinamicamente
const IconeOlho = ({ visivel }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: '20px', height: '20px' }}
    >
        {visivel ? (
            <g>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </g>
        ) : (
            <g>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </g>
        )}
    </svg>
);

export default function Login({ aoLogar }) {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [verSenha, setVerSenha] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (usuario === 'admin' && senha === 'teste123') {
            aoLogar();
        } else {
            alert('Usuário ou senha incorretos!');
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoWrapper}>
                        <img
                            src={logoImage}
                            alt="Urban Flora Logo"
                            style={styles.logoImg}
                        />
                    </div>
                    <p style={styles.subtitulo}>Sistema de Controle de Estoque</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Usuário</label>
                        <input
                            type="text"
                            placeholder="Digite seu usuário"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Senha</label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={verSenha ? "text" : "password"}
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                style={styles.input}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setVerSenha(!verSenha)}
                                style={styles.eyeButton}
                                title={verSenha ? "Esconder senha" : "Mostrar senha"}
                            >
                                <IconeOlho visivel={verSenha} />
                            </button>
                        </div>
                    </div>

                    <button type="submit" style={styles.botao}>
                        Acessar Sistema
                    </button>
                </form>

                <footer style={styles.footer}>
                    &copy; 2026 Urban Flora Management
                </footer>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: '#e9ecef',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', zIndex: 1000, fontFamily: 'sans-serif'
    },
    card: {
        backgroundColor: '#f4f6f8',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%',
        maxWidth: '380px', textAlign: 'center'
    },
    header: { marginBottom: '25px' },
    logoWrapper: {
        display: 'flex', justifyContent: 'center', marginBottom: '5px'
    },
    logoImg: {
        height: '120px', // Altura ajustada para não ficar gigante
        width: 'auto',
        display: 'block',
        objectFit: 'contain'
    },
    subtitulo: { margin: '5px 0 0', color: '#7f8c8d', fontSize: '14px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { textAlign: 'left' },
    label: {
        display: 'block', marginBottom: '5px', fontSize: '13px',
        fontWeight: 'bold', color: '#34495e'
    },
    passwordWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    input: {
        width: '100%', padding: '12px 15px', paddingRight: '45px',
        borderRadius: '8px', border: '1px solid #dcdde1', fontSize: '16px',
        boxSizing: 'border-box', outline: 'none'
    },
    eyeButton: {
        position: 'absolute',
        right: '8px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px',
        color: '#95a5a6'
    },
    botao: {
        width: '100%', padding: '15px', backgroundColor: '#27ae60',
        color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px',
        fontWeight: 'bold', cursor: 'pointer', marginTop: '10px'
    },
    footer: { marginTop: '25px', fontSize: '11px', color: '#bdc3c7' }
};