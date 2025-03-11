import React, { useState, useEffect } from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Button, 
    Grid, 
    Box,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import { getPropertyDetails, getPropertyValuation, getDocuments, uploadDocument } from '../services/api';

const PropertyDetails = ({ tokenId }) => {
    const [property, setProperty] = useState(null);
    const [valuation, setValuation] = useState(null);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propertyData, valuationData, documentsData] = await Promise.all([
                    getPropertyDetails(tokenId),
                    getPropertyValuation(tokenId),
                    getDocuments(tokenId)
                ]);
                
                setProperty(propertyData);
                setValuation(valuationData);
                setDocuments(documentsData);
            } catch (error) {
                alert('Erro ao carregar dados do imóvel');
            }
        };
        fetchData();
    }, [tokenId]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        try {
            await uploadDocument(tokenId, {
                file,
                type: 'property_document'
            });
            const updatedDocs = await getDocuments(tokenId);
            setDocuments(updatedDocs);
            alert('Documento enviado com sucesso!');
        } catch (error) {
            alert('Erro ao enviar documento');
        }
    };

    if (!property) return <Typography>Carregando...</Typography>;

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Detalhes do Imóvel
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Informações Básicas</Typography>
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary="Matrícula" 
                                        secondary={property.registryNumber} 
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText 
                                        primary="Endereço" 
                                        secondary={property.address} 
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText 
                                        primary="Valor" 
                                        secondary={`R$ ${property.value?.toLocaleString()}`} 
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Avaliação</Typography>
                            <Typography variant="h4" color="primary">
                                R$ {valuation?.estimatedValue?.toLocaleString() || '0'}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Última atualização: {valuation?.lastUpdate || 'N/A'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Documentos</Typography>
                            <List>
                                {documents.map((doc, index) => (
                                    <ListItem key={index}>
                                        <ListItemText 
                                            primary={doc.type} 
                                            secondary={doc.uploadDate} 
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Enviar Documento
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileUpload}
                                />
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PropertyDetails;