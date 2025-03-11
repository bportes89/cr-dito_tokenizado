import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { login } from '../services/api';

const LoginForm = ({ onLogin, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        cpf: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            localStorage.setItem('user', JSON.stringify(response.user));
            onLogin(response.user);
        } catch (error) {
            alert('Erro no login: ' + error.message);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Login
            </Typography>
            <TextField
                fullWidth
                label="CPF"
                margin="normal"
                value={formData.cpf}
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
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
                Entrar
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link
                    component="button"
                    variant="body2"
                    onClick={onSwitchToRegister}
                >
                    Não tem uma conta? Cadastre-se
                </Link>
            </Box>
        </Box>
    );
};

export default LoginForm;