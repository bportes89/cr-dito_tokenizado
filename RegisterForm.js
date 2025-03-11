import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { register } from '../services/api';

const RegisterForm = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            alert('Usuário cadastrado com sucesso!');
            onSwitchToLogin();
        } catch (error) {
            alert('Erro ao cadastrar: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Cadastro de Usuário
            </Typography>
            <TextField
                fullWidth
                label="Nome Completo"
                margin="normal"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <TextField
                fullWidth
                label="CPF"
                margin="normal"
                value={formData.cpf}
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
            />
            <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <TextField
                fullWidth
                label="Senha"
                type="password"
                margin="normal"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
            >
                Cadastrar
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link
                    component="button"
                    variant="body2"
                    onClick={onSwitchToLogin}
                >
                    Já tem uma conta? Faça login
                </Link>
            </Box>
        </Box>
    );
};

export default RegisterForm;