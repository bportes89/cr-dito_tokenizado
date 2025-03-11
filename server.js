const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para validar tokenId
const validateTokenId = (req, res, next) => {
    const tokenId = req.params.tokenId;
    console.log('Validando tokenId:', tokenId);
    if (!tokenId || tokenId === 'undefined' || tokenId.includes('undefined')) {
        console.log('TokenId inválido ou indefinido');
        return res.status(400).json({ 
            error: "TokenId inválido",
            detalhes: "O ID do imóvel não foi fornecido corretamente"
        });
    }
    next();
};

// Middleware para validar CPF
const validateCPF = (req, res, next) => {
    const cpf = req.params.cpf;
    console.log('Validando CPF:', cpf);
    if (!cpf || cpf === 'undefined') {
        console.log('CPF inválido');
        return res.status(400).json({ error: "CPF inválido ou não fornecido" });
    }
    next();
};

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro na aplicação:', err);
    res.status(500).json({ 
        error: "Erro ao processar a requisição",
        detalhes: err.message 
    });
});

// Configuração do CORS
app.use(cors({
    origin: true, // Permite todas as origens em desenvolvimento
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Adicione este middleware logo após a configuração do CORS
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});

app.use(express.json());

const PORT = 3000;

// Dados iniciais para teste
const users = [
    {
        name: "Usuário Teste",
        cpf: "12345678900",
        email: "teste@exemplo.com",
        password: "123456"
    }
];

const properties = [
    {
        tokenId: "123456789",
        registryNumber: "RG123456",
        value: 500000,
        address: "Rua Teste, 123",
        ownerCpf: "12345678900",
        tokenizationDate: new Date().toISOString(),
        status: 'ACTIVE',
        documents: [
            {
                type: "Escritura",
                documentUrl: "http://exemplo.com/escritura.pdf",
                uploadDate: new Date().toISOString()
            }
        ]
    }
];

const loans = [
    {
        loanId: "987654321",
        tokenId: "123456789",
        amount: 300000,
        term: 24,
        borrowerCpf: "12345678900",
        requestDate: new Date().toISOString(),
        status: 'ACTIVE',
        lastUpdate: new Date().toISOString()
    }
];

// Rota para registro de usuário
app.post('/register', async (req, res) => {
    try {
        console.log('Dados de registro recebidos:', req.body);
        const { name, cpf, email, password } = req.body;
        
        if (!name || !cpf || !email || !password) {
            console.log('Campos faltando:', { name, cpf, email, password });
            return res.status(400).json({ 
                error: "Dados incompletos",
                detalhes: "Todos os campos (nome, CPF, email e senha) são obrigatórios"
            });
        }
        
        if (users.find(user => user.cpf === cpf)) {
            console.log('CPF já cadastrado:', cpf);
            return res.status(400).json({ error: "CPF já cadastrado" });
        }

        const newUser = { name, cpf, email, password };
        users.push(newUser);
        console.log('Usuário registrado com sucesso:', { name, cpf, email });
        
        res.json({ 
            message: "Usuário cadastrado com sucesso",
            user: { name, cpf, email }
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para login
app.post('/login', async (req, res) => {
    try {
        console.log('Tentativa de login:', req.body);
        const { cpf, password } = req.body;
        
        if (!cpf || !password) {
            return res.status(400).json({ 
                error: "Dados incompletos",
                detalhes: "CPF e senha são obrigatórios"
            });
        }

        const user = users.find(u => u.cpf === cpf && u.password === password);
        
        if (!user) {
            console.log('Login falhou para CPF:', cpf);
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        console.log('Login bem-sucedido para:', user.name);
        res.json({ 
            message: "Login realizado com sucesso", 
            user: { 
                name: user.name, 
                cpf: user.cpf, 
                email: user.email 
            } 
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para tokenização de imóvel
app.post('/tokenize-property', async (req, res) => {
    try {
        console.log('Tentativa de tokenização:', req.body);
        const { registryNumber, value, address, ownerCpf } = req.body;
        
        if (!registryNumber || !value || !address || !ownerCpf) {
            console.log('Campos faltando na tokenização');
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        if (properties.find(p => p.registryNumber === registryNumber)) {
            console.log('Imóvel já tokenizado:', registryNumber);
            return res.status(400).json({ error: "Imóvel já tokenizado" });
        }

        const tokenId = Date.now().toString();
        const newProperty = {
            tokenId,
            registryNumber,
            value: parseFloat(value),
            address,
            ownerCpf,
            tokenizationDate: new Date().toISOString(),
            status: 'ACTIVE',
            documents: []
        };

        properties.push(newProperty);
        console.log('Imóvel tokenizado:', tokenId);

        res.json({ 
            message: "Imóvel tokenizado com sucesso",
            property: newProperty
        });
    } catch (error) {
        console.error('Erro na tokenização:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para dashboard
app.get('/dashboard/:cpf', validateCPF, async (req, res) => {
    try {
        console.log('Acessando dashboard para CPF:', req.params.cpf);
        const cpf = req.params.cpf;
        
        // Verifica se o usuário existe
        const user = users.find(u => u.cpf === cpf);
        if (!user) {
            console.log('Usuário não encontrado:', cpf);
            return res.status(404).json({ 
                error: "Usuário não encontrado",
                detalhes: "CPF não cadastrado no sistema"
            });
        }

        const userProperties = properties.filter(p => p.ownerCpf === cpf);
        const userLoans = loans.filter(l => l.borrowerCpf === cpf);
        
        const totalPropertyValue = userProperties.reduce((sum, prop) => sum + parseFloat(prop.value), 0);
        const activeLoans = userLoans.filter(loan => loan.status === 'PENDING' || loan.status === 'ACTIVE');
        
        console.log('Dados do dashboard encontrados:', {
            propriedades: userProperties.length,
            emprestimos: activeLoans.length
        });

        res.json({
            propertyCount: userProperties.length,
            activeLoans: activeLoans.length,
            totalValue: totalPropertyValue,
            recentProperties: userProperties.slice(-5),
            recentLoans: userLoans.slice(-5),
            userName: user.name
        });
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        res.status(500).json({ 
            error: "Erro ao carregar dados do dashboard",
            detalhes: error.message 
        });
    }
});

// Rota para consulta de imóveis
app.get('/properties/:cpf', validateCPF, async (req, res) => {
    try {
        console.log('Consultando imóveis para CPF:', req.params.cpf);
        const userProperties = properties.filter(p => p.ownerCpf === req.params.cpf);
        console.log('Imóveis encontrados:', userProperties.length);
        res.json(userProperties);
    } catch (error) {
        console.error('Erro na consulta de imóveis:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para detalhes do imóvel
app.get('/property/:tokenId', validateTokenId, async (req, res) => {
    try {
        console.log('Buscando detalhes do imóvel:', req.params.tokenId);
        if (req.params.tokenId.includes('Please')) {
            return res.status(400).json({ 
                error: "URL inválida",
                detalhes: "URL mal formatada para busca de documentos"
            });
        }
        const property = properties.find(p => p.tokenId === req.params.tokenId);
        if (!property) {
            console.log('Imóvel não encontrado:', req.params.tokenId);
            return res.status(404).json({ error: "Imóvel não encontrado" });
        }
        console.log('Imóvel encontrado:', property);
        res.json(property);
    } catch (error) {
        console.error('Erro ao buscar detalhes do imóvel:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para avaliação do imóvel
app.get('/property/:tokenId/valuation', validateTokenId, async (req, res) => {
    try {
        console.log('Calculando avaliação para imóvel:', req.params.tokenId);
        const property = properties.find(p => p.tokenId === req.params.tokenId);
        if (!property) {
            console.log('Imóvel não encontrado para avaliação:', req.params.tokenId);
            return res.status(404).json({ error: "Imóvel não encontrado" });
        }

        const valorAtual = parseFloat(property.value);
        const dataTokenizacao = new Date(property.tokenizationDate);
        const hoje = new Date();
        const anosDecorridos = (hoje - dataTokenizacao) / (1000 * 60 * 60 * 24 * 365);
        const valorizacao = 5; // 5% ao ano
        const valorEstimado = valorAtual * Math.pow(1 + (valorizacao/100), anosDecorridos);

        const resultado = {
            valorOriginal: valorAtual,
            valorEstimado: parseFloat(valorEstimado.toFixed(2)),
            valorizacao: parseFloat((((valorEstimado/valorAtual) - 1) * 100).toFixed(2)),
            dataUltimaAtualizacao: new Date().toISOString()
        };

        console.log('Avaliação calculada:', resultado);
        res.json(resultado);
    } catch (error) {
        console.error('Erro na avaliação do imóvel:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para documentos do imóvel
app.get('/property/:tokenId/documents', validateTokenId, async (req, res) => {
    try {
        console.log('Buscando documentos do imóvel:', req.params.tokenId);
        const property = properties.find(p => p.tokenId === req.params.tokenId);
        if (!property) {
            console.log('Imóvel não encontrado para documentos:', req.params.tokenId);
            return res.status(404).json({ error: "Imóvel não encontrado" });
        }
        console.log('Documentos encontrados:', property.documents?.length || 0);
        res.json(property.documents || []);
    } catch (error) {
        console.error('Erro ao buscar documentos:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para adicionar documento
app.post('/property/:tokenId/documents', validateTokenId, async (req, res) => {
    try {
        console.log('Adicionando documento ao imóvel:', req.params.tokenId);
        const { type, documentUrl } = req.body;
        if (!type || !documentUrl) {
            console.log('Campos faltando no documento');
            return res.status(400).json({ error: "Tipo e URL do documento são obrigatórios" });
        }

        const property = properties.find(p => p.tokenId === req.params.tokenId);
        if (!property) {
            console.log('Imóvel não encontrado para adicionar documento:', req.params.tokenId);
            return res.status(404).json({ error: "Imóvel não encontrado" });
        }

        if (!property.documents) {
            property.documents = [];
        }

        const newDocument = {
            type,
            documentUrl,
            uploadDate: new Date().toISOString()
        };

        property.documents.push(newDocument);
        console.log('Documento adicionado:', newDocument);

        res.json({ 
            message: "Documento adicionado com sucesso",
            documents: property.documents
        });
    } catch (error) {
        console.error('Erro ao adicionar documento:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para solicitação de empréstimo
app.post('/request-loan', async (req, res) => {
    try {
        console.log('Dados do empréstimo recebidos:', req.body);
        const tokenId = req.body.tokenId;
        const amount = req.body.loanAmount; // Corrigido para usar loanAmount
        const term = req.body.term;
        const borrowerCpf = req.body.borrowerCpf;
        
        if (!tokenId || !amount || !term || !borrowerCpf) {
            console.log('Campos faltando:', { tokenId, amount, term, borrowerCpf });
            return res.status(400).json({ 
                error: "Dados incompletos",
                detalhes: "Todos os campos são obrigatórios: ID do imóvel (tokenId), valor do empréstimo (loanAmount), prazo (term) e CPF do solicitante (borrowerCpf)"
            });
        }

        const property = properties.find(p => p.tokenId === tokenId);
        if (!property) {
            console.log('Imóvel não encontrado para empréstimo:', tokenId);
            return res.status(404).json({ error: "Imóvel não encontrado" });
        }

        if (amount > property.value * 0.7) {
            console.log('Valor do empréstimo excede limite:', amount);
            return res.status(400).json({ error: "Valor do empréstimo excede o limite permitido (70% do valor do imóvel)" });
        }

        const loanId = Date.now().toString();
        const newLoan = {
            loanId,
            tokenId,
            amount: parseFloat(amount),
            term: parseInt(term),
            borrowerCpf,
            requestDate: new Date().toISOString(),
            status: 'PENDING',
            lastUpdate: new Date().toISOString()
        };

        loans.push(newLoan);
        console.log('Empréstimo registrado:', loanId);

        res.json({
            message: "Solicitação de empréstimo registrada com sucesso",
            loan: newLoan
        });
    } catch (error) {
        console.error('Erro na solicitação de empréstimo:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para consulta de empréstimos
app.get('/loans/:cpf', validateCPF, async (req, res) => {
    try {
        console.log('Consultando empréstimos para CPF:', req.params.cpf);
        const userLoans = loans.filter(l => l.borrowerCpf === req.params.cpf);
        console.log('Empréstimos encontrados:', userLoans.length);
        res.json(userLoans);
    } catch (error) {
        console.error('Erro na consulta de empréstimos:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para simulação de empréstimo
app.post('/loan/simulate', async (req, res) => {
    try {
        console.log('Nova simulação de empréstimo:', req.body);
        const { amount, term } = req.body;
        
        if (!amount || !term) {
            console.log('Campos faltando na simulação');
            return res.status(400).json({ error: "Valor e prazo são obrigatórios" });
        }

        const interestRate = 1.5; // 1.5% ao mês
        const monthlyPayment = (amount * (interestRate/100) * Math.pow(1 + interestRate/100, term)) / 
                             (Math.pow(1 + interestRate/100, term) - 1);
        const totalAmount = monthlyPayment * term;

        const resultado = {
            monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
            interestRate: interestRate,
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            term: parseInt(term)
        };

        console.log('Simulação calculada:', resultado);
        res.json(resultado);
    } catch (error) {
        console.error('Erro na simulação:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para atualização de status do empréstimo
app.put('/loan/:loanId/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: "Status é obrigatório" });
        }

        const loan = loans.find(l => l.loanId === req.params.loanId);
        if (!loan) {
            return res.status(404).json({ error: "Empréstimo não encontrado" });
        }

        if (!['PENDING', 'ACTIVE', 'REJECTED', 'COMPLETED'].includes(status)) {
            return res.status(400).json({ error: "Status inválido" });
        }

        loan.status = status;
        loan.lastUpdate = new Date().toISOString();

        res.json({ 
            message: "Status atualizado com sucesso",
            loan
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Dados de teste carregados: ${users.length} usuários, ${properties.length} imóveis, ${loans.length} empréstimos`);
});