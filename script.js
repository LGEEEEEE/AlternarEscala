// --- CONFIGURAÇÃO ---
// Adicione ou remova pessoas e tarefas aqui.
const todasAsPessoas = [
    { nome: 'Ana Clara', genero: 'F' },
    { nome: 'Mariane', genero: 'F' },
    { nome: 'Andressa', genero: 'F' },
    { nome: 'Anne', genero: 'F' },
    { nome: 'Fernanda', genero: 'F' },
    { nome: 'Giovanna', genero: 'F' },
    { nome: 'Isabela', genero: 'F' },
    { nome: 'Lisy', genero: 'F' },
    { nome: 'Rafaela', genero: 'F' },
    { nome: 'Tais', genero: 'F' },
    { nome: 'Arthur', genero: 'M' },
    { nome: 'Cauan', genero: 'M' },
    { nome: 'Robert', genero: 'M' },
    { nome: 'Vinicius', genero: 'M' },
    { nome: 'Warley', genero: 'M' }
];

const todasAsTarefas = [
    { nome: 'Banheiro Atendimento', tipo: 'Fixo' }, // Tarefa fixa de Mariane e Ana Clara
    { nome: 'Banheiro Retirada', tipo: 'Geral' },
    { nome: 'Cozinha', tipo: 'Geral' },
    { nome: 'Lixo', tipo: 'Geral' },
    { nome: 'Banheiro meninos', tipo: 'Geral' },
    { nome: 'Chão atendimento', tipo: 'Contínua' }, // Rapazes não podem fazer
    { nome: 'Chão Retirada', tipo: 'Contínua' }   // Rapazes não podem fazer
];


// --- LÓGICA DO SISTEMA ---

// Pega os elementos da página
const resultadoEl = document.getElementById('escala-resultado');
const gerarBtn = document.getElementById('gerar-btn');
const imprimirBtn = document.getElementById('imprimir-btn');

// Função para misturar um array (algoritmo de Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Função principal que gera a escala
function gerarEscala() {
    let escalaFinal = [];
    let pessoasDisponiveis = [...todasAsPessoas];
    let tarefasDisponiveis = [...todasAsTarefas];

    // 1. REGRA FIXA: Mariane e Ana Clara no Banheiro Atendimento
    escalaFinal.push('Banheiro Atendimento: Mariane e Ana Clara');
    pessoasDisponiveis = pessoasDisponiveis.filter(p => p.nome !== 'Mariane' && p.nome !== 'Ana Clara');
    tarefasDisponiveis = tarefasDisponiveis.filter(t => t.tipo !== 'Fixo');
    
    // 2. REGRA 2: Tarefas "Contínuas" apenas para moças
    const tarefasContinuas = tarefasDisponiveis.filter(t => t.tipo === 'Contínua');
    let moçasDisponiveis = pessoasDisponiveis.filter(p => p.genero === 'F');
    shuffleArray(moçasDisponiveis);

    tarefasContinuas.forEach(tarefa => {
        if (moçasDisponiveis.length > 0) {
            const pessoa = moçasDisponiveis.pop();
            escalaFinal.push(`${tarefa.nome}: ${pessoa.nome}`);
            pessoasDisponiveis = pessoasDisponiveis.filter(p => p.nome !== pessoa.nome);
        }
    });
    
    // Remove as tarefas contínuas da lista principal de tarefas
    tarefasDisponiveis = tarefasDisponiveis.filter(t => t.tipo !== 'Contínua');
    
    // 3. Tarefas Gerais para as pessoas restantes (rapazes e moças que sobraram)
    shuffleArray(pessoasDisponiveis);
    
    tarefasDisponiveis.forEach(tarefa => {
        if (pessoasDisponiveis.length > 0) {
            const pessoa = pessoasDisponiveis.pop();
            escalaFinal.push(`${tarefa.nome}: ${pessoa.nome}`);
        }
    });

    // 4. Quem sobrou fica de FOLGA
    if (pessoasDisponiveis.length > 0) {
        const nomesFolga = pessoasDisponiveis.map(p => p.nome).join(', ');
        escalaFinal.push(`\nFOLGAS: ${nomesFolga}`);
    }

    // Exibe o resultado na tela
    const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    resultadoEl.innerText = `ESCALA GERADA EM ${dataAtual}\n---------------------------------\n\n` + escalaFinal.join('\n');
}

// Adiciona os eventos aos botões
gerarBtn.addEventListener('click', gerarEscala);
imprimirBtn.addEventListener('click', () => {
    window.print();
});

// Gera uma primeira escala assim que a página carrega
window.onload = gerarEscala;
