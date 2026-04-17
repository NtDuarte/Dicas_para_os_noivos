import { put } from '@vercel/blob';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ erro: 'Método não permitido.' });
    }

    try {
        const { nome, mensagem } = req.body || {};

        if (!nome || !mensagem) {
            return res.status(400).json({
                erro: 'Nome e mensagem são obrigatórios.'
            });
        }

        const nomeSeguro = String(nome)
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');

        const mensagemLimpa = String(mensagem).trim();

        const agora = new Date();
        const dataArquivo = agora.toISOString().replace(/[:.]/g, '-');

        const nomeArquivo = `Dicas_Noivos/${nomeSeguro || 'sem_nome'}_${dataArquivo}.txt`;

        const conteudo = `Nome: ${nome}
Dica: ${mensagemLimpa}
Data: ${agora.toLocaleString('pt-BR')}
`;

        await put(nomeArquivo, conteudo, {
            access: 'private',
            addRandomSuffix: false,
            contentType: 'text/plain; charset=utf-8'
        });

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Dica salva com sucesso.'
        });
    } catch (erro) {
        console.error('Erro ao salvar dica:', erro);

        return res.status(500).json({
            erro: erro.message || 'Erro interno ao salvar a dica.'
        });
    }
}
