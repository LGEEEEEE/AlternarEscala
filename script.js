// --- CONFIGURAÇÃO ---
// Adicione ou remova pessoas e tarefas aqui.
const todasAsPessoas = [
    { nome: 'Ana Clara', genero: 'F' }, { nome: 'Mariane', genero: 'F' },
    { nome: 'Andressa', genero: 'F' },  { nome: 'Anne', genero: 'F' },
    { nome: 'Fernanda', genero: 'F' },  { nome: 'Giovanna', genero: 'F' },
    { nome: 'Isabela', genero: 'F' },   { nome: 'Lisy', genero: 'F' },
    { nome: 'Rafaela', genero: 'F' },   { nome: 'Tais', genero: 'F' },
    { nome: 'Arthur', genero: 'M' },    { nome: 'Cauan', genero: 'M' },
    { nome: 'Robert', genero: 'M' },    { nome: 'Vinicius', genero: 'M' },
    { nome: 'Warley', genero: 'M' }
];

const todasAsTarefas = [
    { nome: 'Banheiro Retirada', tipo: 'Geral' },
    { nome: 'Cozinha', tipo: 'Geral' },
    { nome: 'Lixo', tipo: 'Geral' },
    { nome: 'Banheiro meninos', tipo: 'Geral' },
    { nome: 'Chão atendimento', tipo: 'Contínua' },
    { nome: 'Chão Retirada', tipo: 'Contínua' }
];

// REGRA ESPECIAL: Alternancia no Banheiro Atendimento, como na foto.
// Você pode mudar essa ordem se quiser.
const alternanciaBanheiro = ['Ana Clara', 'Anne', 'Ana Clara', 'Mariane'];

// --- LÓGICA DO SISTEMA ---

const resultadoEl = document.getElementById('escala-resultado');
const gerarBtn = document.getElementById('gerar-btn');
const imprimirBtn = document.getElementById('imprimir-btn');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function gerarEscalaMensal() {
    let htmlOutput = '';
    let dataInicio = new Date();
    
    // Listas de pessoas para cada tipo de tarefa
    let moçasDisponiveis = todasAsPessoas.filter(p => p.genero === 'F' && !alternanciaBanheiro.includes(p.nome));
    let pessoalGeralDisponivel = todasAsPessoas.filter(p => !alternanciaBanheiro.includes(p.nome) && !moçasDisponiveis.some(m => m.nome === p.nome));
    
    // Separa as tarefas por tipo
    const tarefasContinuas = todasAsTarefas.filter(t => t.tipo === 'Contínua');
    const tarefasGerais = todasAsTarefas.filter(t => t.tipo === 'Geral');

    // Embaralha as listas iniciais para a Semana 1
    shuffleArray(moçasDisponiveis);
    
    // Combina moças restantes com rapazes para tarefas gerais e embaralha
    let pessoasTarefasGerais = [
        ...moçasDisponiveis.slice(tarefasContinuas.length), 
        ...todasAsPessoas.filter(p => p.genero === 'M')
    ];
    shuffleArray(pessoasTarefasGerais);

    let moçasTarefasContinuas = moçasDisponiveis.slice(0, tarefasContinuas.length);

    for (let i = 0; i < 4; i++) {
        let escalaSemana = [];
        let pessoasNaSemana = new Set();

        // Adiciona título da semana com datas
        let dataFim = new Date(dataInicio);
        dataFim.setDate(dataInicio.getDate() + 6);
        htmlOutput += `<h3>SEMANA ${i + 1} ( ${dataInicio.toLocaleDateString('pt-BR')} a ${dataFim.toLocaleDateString('pt-BR')} )</h3>`;
        dataInicio.setDate(dataFim.getDate() + 1);

        // 1. Regra Fixa: Banheiro Atendimento
        const responsavelBanheiro = alternanciaBanheiro[i];
        escalaSemana.push(`Banheiro Atendimento: ${responsavelBanheiro}`);
        pessoasNaSemana.add(responsavelBanheiro);

        // 2. Tarefas Contínuas (rotacionando a lista de moças)
        for (let j = 0; j < tarefasContinuas.length; j++) {
            const pessoa = moçasTarefasContinuas[j];
            escalaSemana.push(`${tarefasContinuas[j].nome}: ${pessoa.nome}`);
            pessoasNaSemana.add(pessoa.nome);
        }
        // Rotaciona a lista de pessoas para a próxima semana
        moçasTarefasContinuas.push(moçasTarefasContinuas.shift());
        
        // 3. Tarefas Gerais (rotacionando a lista do pessoal geral)
        for (let j = 0; j < tarefasGerais.length; j++) {
            const pessoa = pessoasTarefasGerais[j];
            escalaSemana.push(`${tarefasGerais[j].nome}: ${pessoa.nome}`);
            pessoasNaSemana.add(pessoa.nome);
        }
        // Rotaciona a lista de pessoas para a próxima semana
        pessoasTarefasGerais.push(pessoasTarefasGerais.shift());

        // 4. Define as folgas
        const folgas = todasAsPessoas
            .filter(p => !pessoasNaSemana.has(p.nome))
            .map(p => p.nome);

        // Formata o resultado da semana
        htmlOutput += `<p>${escalaSemana.join('\n')}\nFolga: ${folgas.join(', ')}</p>`;
    }

    resultadoEl.innerHTML = htmlOutput;
}

// Adiciona os eventos aos botões
gerarBtn.addEventListener('click', gerarEscalaMensal);
imprimirBtn.addEventListener('click', () => { window.print(); });

// Gera a primeira escala ao carregar a página
window.onload = gerarEscalaMensal;

