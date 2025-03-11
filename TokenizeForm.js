import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { tokenizeProperty } from '../services/api';

const TokenizeForm = () => {
    const [formData, setFormData] = useState({
        registryNumber: '',
        value: '',
        address: '',
        ownerCpf: JSON.parse(localStorage.getItem('user')).cpf
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await tokenizeProperty(formData);
            alert(`Imóvel tokenizado com sucesso! Token ID: ${response.tokenId}`);
        } catch (error) {
            alert('Erro ao tokenizar imóvel: ' + error.message);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                Tokenizar Imóvel
            </Typography>
            <TextField
                fullWidth
                label="Número da Matrícula"
                margin="normal"
                value={formData.registryNumber}
                onChange={(e) => setFormData({...formData, registryNumber: e.target.value})}
            />
            <TextField
                fullWidth
                label="Valor do Imóvel"
                type="number"
                margin="normal"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
            />
            <TextField
                fullWidth
                label="Endereço"
                margin="normal"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
            >
                Tokenizar
            </Button>
        </Box>
    );
};

export default TokenizeForm;