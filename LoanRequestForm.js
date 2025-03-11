import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { requestLoan } from '../services/api';

const LoanRequestForm = () => {
    const [formData, setFormData] = useState({
        tokenId: '',
        loanAmount: '',
        term: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await requestLoan(formData);
            alert(response.message);
        } catch (error) {
            alert('Erro ao solicitar empréstimo');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Solicitar Empréstimo
            </Typography>
            <TextField
                fullWidth
                label="ID do Token"
                margin="normal"
                value={formData.tokenId}
                onChange={(e) => setFormData({...formData, tokenId: e.target.value})}
            />
            <TextField
                fullWidth
                label="Valor do Empréstimo"
                margin="normal"
                type="number"
                value={formData.loanAmount}
                onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
            />
            <TextField
                fullWidth
                label="Prazo (meses)"
                margin="normal"
                type="number"
                value={formData.term}
                onChange={(e) => setFormData({...formData, term: e.target.value})}
            />
            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
            >
                Solicitar
            </Button>
        </Box>
    );
};

export default LoanRequestForm;