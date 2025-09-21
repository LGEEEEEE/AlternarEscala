// --- CONFIGURAÇÃO ---
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

    for (let i = 0; i < 4; i++) {
        // A cada semana, começamos o processo do zero com listas novas
        let escalaSemana = [];
        let pessoasNaSemana = new Set();
        let pessoasDisponiveis = [...todasAsPessoas];
        let tarefasDisponiveis = [...todasAsTarefas];

        // Adiciona título da semana com datas
        let dataFim = new Date(dataInicio);
        dataFim.setDate(dataInicio.getDate() + 6);
        htmlOutput += `<h3>SEMANA ${i + 1} ( ${dataInicio.toLocaleDateString('pt-BR')} a ${dataFim.toLocaleDateString('pt-BR')} )</h3>`;
        dataInicio.setDate(dataFim.getDate() + 1);

        // 1. REGRA FIXA: Banheiro Atendimento
        const responsavelBanheiro = alternanciaBanheiro[i];
        escalaSemana.push(`Banheiro Atendimento: ${responsavelBanheiro}`);
        pessoasNaSemana.add(responsavelBanheiro);
        // Remove a pessoa da lista de disponíveis para esta semana
        pessoasDisponiveis = pessoasDisponiveis.filter(p => p.nome !== responsavelBanheiro);

        // 2. REGRA 2: Tarefas "Contínuas" apenas para moças
        const tarefasContinuas = tarefasDisponiveis.filter(t => t.tipo === 'Contínua');
        let moçasDisponiveis = pessoasDisponiveis.filter(p => p.genero === 'F');
        shuffleArray(moçasDisponiveis);

        tarefasContinuas.forEach(tarefa => {
            if (moçasDisponiveis.length > 0) {
                const pessoa = moçasDisponiveis.pop();
                escalaSemana.push(`${tarefa.nome}: ${pessoa.nome}`);
                pessoasNaSemana.add(pessoa.nome);
                // Remove a pessoa da lista geral e a tarefa da lista de tarefas
                pessoasDisponiveis = pessoasDisponiveis.filter(p => p.nome !== pessoa.nome);
                tarefasDisponiveis = tarefasDisponiveis.filter(t => t.nome !== tarefa.nome);
            }
        });

        // 3. Tarefas Gerais para as pessoas restantes
        let tarefasGerais = tarefasDisponiveis.filter(t => t.tipo === 'Geral');
        shuffleArray(pessoasDisponiveis); // Embaralha todos que sobraram

        tarefasGerais.forEach(tarefa => {
            if (pessoasDisponiveis.length > 0) {
                const pessoa = pessoasDisponiveis.pop();
                escalaSemana.push(`${tarefa.nome}: ${pessoa.nome}`);
                pessoasNaSemana.add(pessoa.nome);
            }
        });

        // 4. Quem sobrou fica de FOLGA
        const folgas = todasAsPessoas
            .filter(p => !pessoasNaSemana.has(p.nome))
            .map(p => p.nome);

        // Formata o resultado da semana
        escalaSemana.sort(); // Opcional: ordena as tarefas alfabeticamente para consistência visual
        htmlOutput += `<p>${escalaSemana.join('\n')}\nFolga: ${folgas.join(', ')}</p>`;
    }

    resultadoEl.innerHTML = htmlOutput;
}

// Adiciona os eventos aos botões
gerarBtn.addEventListener('click', gerarEscalaMensal);
imprimirBtn.addEventListener('click', () => { window.print(); });

// Gera a primeira escala ao carregar a página
window.onload = gerarEscalaMensal;
