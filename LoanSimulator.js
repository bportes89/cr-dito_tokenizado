import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Box, 
    Typography, 
    Card, 
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { getLoanSimulation } from '../services/api';

const LoanSimulator = () => {
    const [formData, setFormData] = useState({
        amount: '',
        term: ''
    });
    const [simulation, setSimulation] = useState(null);

    const handleSimulate = async (e) => {
        e.preventDefault();
        try {
            const result = await getLoanSimulation(
                parseFloat(formData.amount), 
                parseInt(formData.term)
            );
            setSimulation(result);
        } catch (error) {
            alert('Erro ao simular empréstimo');
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
                Simulador de Empréstimo
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box component="form" onSubmit={handleSimulate}>
                                <TextField
                                    fullWidth
                                    label="Valor Desejado"
                                    type="number"
                                    margin="normal"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        amount: e.target.value
                                    })}
                                />
                                <TextField
                                    fullWidth
                                    label="Prazo (meses)"
                                    type="number"
                                    margin="normal"
                                    value={formData.term}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        term: e.target.value
                                    })}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 3 }}
                                >
                                    Simular
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                {simulation && (
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Resultado da Simulação</Typography>
                                <List>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Valor da Parcela" 
                                            secondary={`R$ ${simulation.monthlyPayment?.toLocaleString()}`} 
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Taxa de Juros" 
                                            secondary={`${simulation.interestRate}% ao mês`} 
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Valor Total" 
                                            secondary={`R$ ${simulation.totalAmount?.toLocaleString()}`} 
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default LoanSimulator;