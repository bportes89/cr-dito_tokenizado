import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Button,
    CircularProgress,
    Alert 
} from '@mui/material';
import { getProperties } from '../services/api';

const PropertyList = ({ userCpf }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const data = await getProperties(userCpf);
                setProperties(data);
                setError(null);
            } catch (error) {
                setError('Erro ao carregar imóveis. Tente novamente mais tarde.');
                console.error('Erro ao carregar imóveis:', error);
            } finally {
                setLoading(false);
            }
        };
        
        if (userCpf) {
            fetchProperties();
        }
    }, [userCpf]);

    const handleViewDetails = (tokenId) => {
        if (tokenId) {
            navigate(`/property/${tokenId}`);
        } else {
            console.error('TokenId não encontrado para este imóvel');
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!properties.length) return <Alert severity="info">Nenhum imóvel encontrado.</Alert>;

    return (
        <Grid container spacing={3}>
            {properties.map((property) => (
                <Grid item xs={12} md={6} key={property.tokenId || 'no-id'}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {property.address || 'Endereço não informado'}
                            </Typography>
                            <Typography color="textSecondary">
                                Matrícula: {property.registryNumber || 'Não informada'}
                            </Typography>
                            <Typography variant="h5" component="div">
                                R$ {property.value?.toLocaleString() || '0'}
                            </Typography>
                            {property.tokenId && (
                                <Button 
                                    variant="contained" 
                                    sx={{ mt: 2 }}
                                    onClick={() => handleViewDetails(property.tokenId)}
                                >
                                    Ver Detalhes
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default PropertyList;