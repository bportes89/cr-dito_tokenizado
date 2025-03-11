import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { getUserDashboard } from '../services/api';

const Dashboard = ({ userCpf }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await getUserDashboard(userCpf);
                setDashboardData(data);
            } catch (error) {
                alert('Erro ao carregar dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [userCpf]);

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ flexGrow: 1, mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Imóveis Tokenizados</Typography>
                        <Typography variant="h4">{dashboardData?.propertyCount || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Empréstimos Ativos</Typography>
                        <Typography variant="h4">{dashboardData?.activeLoans || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Valor Total em Tokens</Typography>
                        <Typography variant="h4">
                            R$ {dashboardData?.totalValue?.toLocaleString() || '0'}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;