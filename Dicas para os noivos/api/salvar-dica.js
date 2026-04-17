const { put } = require('@vercel/blob');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ erro: 'Método não permitido' });
    }

    try {
        const { nome, mensagem } = req.body || {};

        if (!nome || !mensagem) {
            return res.status(400).json({ erro: 'Nome e mensagem são obrigatórios.' });
        }

        const nomeSeguro = nome
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]/g, '_');

        const data = new Date();
        const dataArquivo = data.toISOString().replace(/[:.]/g, '-');

        const nomeArquivo = `Dicas_Noivos/${nomeSeguro}_${dataArquivo}.txt`;

        const conteudo = `Nome: ${nome}
Dica: ${mensagem}
Data: ${data.toLocaleString('pt-BR')}
`;

        const blob = await put(nomeArquivo, conteudo, {
            access: 'public',
            addRandomSuffix: false,
            contentType: 'text/plain; charset=utf-8'
        });

        return res.status(200).json({
            mensagem: 'Dica salva com sucesso!',
            arquivo: blob.url
        });
    } catch (erro) {
        console.error('Erro ao salvar dica:', erro);
        return res.status(500).json({ erro: 'Erro interno ao salvar a dica.' });
    }
};