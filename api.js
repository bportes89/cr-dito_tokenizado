import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000'
});

// Funções de autenticação
export const register = async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
};

// Funções de gerenciamento de imóveis
export const tokenizeProperty = async (propertyData) => {
    const response = await api.post('/tokenize-property', propertyData);
    return response.data;
};

export const getProperties = async (cpf) => {
    const response = await api.get(`/properties/${cpf}`);
    return response.data;
};

export const getPropertyDetails = async (tokenId) => {
    const response = await api.get(`/property/${tokenId}`);
    return response.data;
};

export const updatePropertyStatus = async (tokenId, status) => {
    const response = await api.put(`/property/${tokenId}/status`, { status });
    return response.data;
};

// Funções de gerenciamento de empréstimos
export const requestLoan = async (loanData) => {
    const response = await api.post('/request-loan', loanData);
    return response.data;
};

export const getLoans = async (cpf) => {
    const response = await api.get(`/loans/${cpf}`);
    return response.data;
};

export const getLoanDetails = async (loanId) => {
    const response = await api.get(`/loan/${loanId}`);
    return response.data;
};

export const updateLoanStatus = async (loanId, status) => {
    const response = await api.put(`/loan/${loanId}/status`, { status });
    return response.data;
};

// Funções de análise e relatórios
export const getPropertyValuation = async (tokenId) => {
    const response = await api.get(`/property/${tokenId}/valuation`);
    return response.data;
};

export const getLoanSimulation = async (amount, term) => {
    const response = await api.post('/loan/simulate', { amount, term });
    return response.data;
};

export const getUserDashboard = async (cpf) => {
    const response = await api.get(`/dashboard/${cpf}`);
    return response.data;
};

// Funções de documentação
export const uploadDocument = async (tokenId, documentData) => {
    const formData = new FormData();
    formData.append('document', documentData.file);
    formData.append('type', documentData.type);
    
    const response = await api.post(`/property/${tokenId}/documents`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getDocuments = async (tokenId) => {
    const response = await api.get(`/property/${tokenId}/documents`);
    return response.data;
};