import { requestLoan, login, tokenizeProperty } from '../services/api';

// Teste de login
const testarLogin = async () => {
    try {
        const credenciais = {
            cpf: "12345678900",
            password: "123456"
        };
        const resposta = await login(credenciais);
        console.log('Login bem sucedido:', resposta);
    } catch (erro) {
        console.error('Erro no login:', erro.response?.data || erro);
    }
};

// Teste de tokenização de imóvel
const testarTokenizacao = async () => {
    try {
        const dadosImovel = {
            registryNumber: "RG123456",
            value: "500000",
            address: "Rua Teste, 123",
            ownerCpf: "12345678900"
        };
        const resposta = await tokenizeProperty(dadosImovel);
        console.log('Imóvel tokenizado:', resposta);
        return resposta.property.tokenId; // Retorna o tokenId para usar no teste de empréstimo
    } catch (erro) {
        console.error('Erro na tokenização:', erro.response?.data || erro);
    }
};

// Teste de solicitação de empréstimo
const testarEmprestimo = async (tokenId) => {
    try {
        const dadosEmprestimo = {
            tokenId: tokenId,
            loanAmount: "300000",
            term: "24",
            borrowerCpf: "12345678900"
        };
        const resposta = await requestLoan(dadosEmprestimo);
        console.log('Empréstimo solicitado:', resposta);
    } catch (erro) {
        console.error('Erro no empréstimo:', erro.response?.data || erro);
    }
};

// Executar os testes em sequência
const executarTestes = async () => {
    console.log('Iniciando testes...');
    await testarLogin();
    const tokenId = await testarTokenizacao();
    if (tokenId) {
        await testarEmprestimo(tokenId);
    }
    console.log('Testes concluídos');
};

executarTestes();