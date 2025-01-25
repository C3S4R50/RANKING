// script.js

let jogadoresAvaliados = []; // Lista para armazenar as avaliações feitas

// Função para carregar as imagens da pasta "images" e exibi-las como cartas
function carregarImagens() {
    const imageSelectionDiv = document.getElementById('image-selection');

    // Gerar os nomes das imagens automaticamente, de PLAYER (1) até PLAYER (18)
    const imagens = [];
    for (let i = 1; i <= 21; i++) {
        imagens.push(`PLAYER (${i}).png`);
    }

    // Limpar qualquer conteúdo anterior da div 'image-selection'
    imageSelectionDiv.innerHTML = '';

    imagens.forEach(imagem => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        const imgElement = document.createElement('img');
        imgElement.src = `images/${imagem}`; // Caminho para as imagens na pasta 'images'
        imgElement.alt = imagem;

        // Quando o usuário clica na carta, preenche o formulário com a imagem selecionada
        cardDiv.onclick = function() {
            clickSound.play();

            // Preenche o campo de imagem selecionada
            document.getElementById('imagemSelecionada').value = imagem;
            document.getElementById('avaliarForm').style.display = 'block'; // Exibe o formulário de avaliação
        };

        cardDiv.appendChild(imgElement);
        imageSelectionDiv.appendChild(cardDiv);
    });
}

// Função para calcular as 3 habilidades mais altas
function calcularTop3Habilidades(habilidades) {
    const habilidadesOrdenadas = Object.entries(habilidades).sort((a, b) => b[1] - a[1]);
    return habilidadesOrdenadas.slice(0, 3).map(habilidade => habilidade[0]);
}

// Função para salvar a avaliação do jogador
function salvarJogador() {
    const imagem = document.getElementById('imagemSelecionada').value;

    // Obter as habilidades, limitando os valores para no máximo 5
    const chu = Math.min(5, parseInt(document.getElementById('chu').value));
    const pas = Math.min(5, parseInt(document.getElementById('pas').value));
    const forca = Math.min(5, parseInt(document.getElementById('for').value));
    const def = Math.min(5, parseInt(document.getElementById('def').value));
    const vel = Math.min(5, parseInt(document.getElementById('vel').value));
    const dri = Math.min(5, parseInt(document.getElementById('dri').value));

    // Calcular a pontuação total
    const totalPontos = chu + pas + forca + def + vel + dri;

    const habilidades = { CHU: chu, PAS: pas, FOR: forca, DEF: def, VEL: vel, DRI: dri };

    // Calcular as 3 habilidades mais altas
    const top3Habilidades = calcularTop3Habilidades(habilidades);

    // Salvar os dados no histórico
    const jogador = {
        imagem,
        habilidades,
        top3Habilidades,
        totalPontos,
    };

    jogadoresAvaliados.push(jogador);

    // Atualizar a lista de jogadores avaliados
    exibirJogadoresAvaliados();

    // Sincronizar com as páginas Classe A, B e C
    sincronizarClasses(jogador);

    // Limpar o formulário AQUI OH, ACHOU!!!!!!!!!!!
    document.getElementById('chu').value = '';
    document.getElementById('pas').value = '';
    document.getElementById('for').value = '';
    document.getElementById('def').value = '';
    document.getElementById('vel').value = '';
    document.getElementById('dri').value = '';
    
    document.getElementById('avaliarForm').style.display = 'none'; // Ocultar o formulário
}

// Função para sincronizar os jogadores com as classes
function sincronizarClasses(jogador) {
    const classes = {
        A: [],
        B: [],
        C: []
    };

    // Carregar dados existentes do localStorage
    const dadosExistentes = JSON.parse(localStorage.getItem('classes')) || classes;

    // Determinar a classe com base na pontuação total
    if (jogador.totalPontos >= 20) {
        dadosExistentes.A.push(jogador);
    } else if (jogador.totalPontos >= 10) {
        dadosExistentes.B.push(jogador);
    } else {
        dadosExistentes.C.push(jogador);
    }

    // Salvar os dados atualizados no localStorage
    localStorage.setItem('classes', JSON.stringify(dadosExistentes));
}

// Função para exibir as cartas avaliadas
function exibirJogadoresAvaliados() {
    const avaliadosDiv = document.getElementById('avaliados');
    avaliadosDiv.innerHTML = ''; // Limpar conteúdo anterior

    jogadoresAvaliados.forEach(jogador => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        const imgElement = document.createElement('img');
        imgElement.src = `images/${jogador.imagem}`;
        imgElement.alt = jogador.imagem;

        const detalhesDiv = document.createElement('div');
        detalhesDiv.classList.add('card-details');
        detalhesDiv.innerHTML = `
            <p><strong>Top 3 Habilidades:</strong></p>
            <ul>
                ${jogador.top3Habilidades.map(habilidade => `<li>${habilidade}</li>`).join('')}
            </ul>
            <p><strong>Pontuação Total:</strong> ${jogador.totalPontos}</p>
        `;

        const color = getColorByPoints(jogador.totalPontos);
        cardDiv.style.background = color;

        cardDiv.appendChild(imgElement);
        cardDiv.appendChild(detalhesDiv);
        avaliadosDiv.appendChild(cardDiv);
    });
}

// Função para obter a cor com base na pontuação
function getColorByPoints(points) {
    if (points >= 20) {
        return 'linear-gradient(to right,rgb(71, 67, 42),rgba(231, 180, 37, 0.95))';
    } else if (points >= 10) {
        return 'linear-gradient(to right,rgb(73, 72, 71),rgb(153, 152, 148))';
    } else {
        return 'linear-gradient(to right,rgb(83, 67, 49),rgb(189, 134, 51))';
    }
}

// Carregar o som de confirmação
const confirmSound = new Audio('sounds/feito.mp3');

// Carregar o som de clique
const clickSound = new Audio('sounds/click-sound.mp3');

// Carregar as imagens ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarImagens);
