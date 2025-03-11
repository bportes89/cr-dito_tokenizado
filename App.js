import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Box, Typography } from '@mui/material';
import TokenizeForm from './components/TokenizeForm';
import LoanRequestForm from './components/LoanRequestForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PropertyList from './components/PropertyList';
import Dashboard from './components/Dashboard';
import PropertyDetails from './components/PropertyDetails';
import LoanSimulator from './components/LoanSimulator';

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [showRegister, setShowRegister] = useState(false);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    if (!user) {
        return showRegister ? (
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
            <LoginForm 
                onLogin={handleLogin} 
                onSwitchToRegister={() => setShowRegister(true)}
            />
        );
    }

    return (
        <BrowserRouter>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component={Link} to="/" sx={{ 
                            textDecoration: 'none', 
                            color: 'inherit', 
                            flexGrow: 0,
                            mr: 4
                        }}>
                            Crédito Tokenizado
                        </Typography>
                        <Button color="inherit" component={Link} to="/dashboard">
                            Dashboard
                        </Button>
                        <Button color="inherit" component={Link} to="/properties">
                            Meus Imóveis
                        </Button>
                        <Button color="inherit" component={Link} to="/tokenize">
                            Tokenizar Imóvel
                        </Button>
                        <Button color="inherit" component={Link} to="/loan">
                            Solicitar Empréstimo
                        </Button>
                        <Button color="inherit" component={Link} to="/simulator">
                            Simulador
                        </Button>
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography variant="subtitle1" sx={{ mr: 2 }}>
                            Olá, {user.name}
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Sair
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container sx={{ mt: 4 }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<Dashboard userCpf={user.cpf} />} />
                        <Route path="/properties" element={<PropertyList userCpf={user.cpf} />} />
                        <Route path="/property/:tokenId" element={<PropertyDetails />} />
                        <Route path="/tokenize" element={<TokenizeForm />} />
                        <Route path="/loan" element={<LoanRequestForm />} />
                        <Route path="/simulator" element={<LoanSimulator />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </Container>
            </Box>
        </BrowserRouter>
    );
}

export default App;