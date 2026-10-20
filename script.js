const el = {
    botoes: document.getElementById('botoes-escolha'),
    arena: document.getElementById('arena-batalha'),
    balaoAlex: document.getElementById('balao-alex'),
    balaoBoss: document.getElementById('balao-boss'),
    imagemAlex: document.getElementById('imagem-alex'),
    imagemBoss: document.getElementById('imagem-boss'),
    bossMao: document.getElementById('boss-mao'),
    mensagem: document.getElementById('mensagem'),
    marcadores: document.getElementById('marcadores'),
    bossImg: document.getElementById('boss-imagem'),
    musica: document.getElementById('musica-fundo'),
    sfxJanken: document.getElementById('sfx-janken'),
    sfxVitoria: document.getElementById('sfx-vitoria'),
    sfxDerrota: document.getElementById('sfx-derrota'),
    btnOpcoes: document.querySelectorAll('.botao-imagem')
};

// Configurações do Jogo
const acoesImagens = {
    alex: {
        pedra: 'imgs/alex%20kid/acao_pedra.png',
        papel: 'imgs/alex%20kid/acao_papel.png',
        tesoura: 'imgs/alex%20kid/acao_tesoura.png'
    },
    boss: {
        pedra: 'imgs/alex%20kid/acao_pedra.png',
        papel: 'imgs/alex%20kid/acao_papel.png',
        tesoura: 'imgs/alex%20kid/acao_tesoura.png'
    }
};
// Imagens de Ataque para cada personagem
const alexAtaqueImagens = {
    pedra: 'imgs/alex%20kid/AlexKidd_pedra.png',
    papel: 'imgs/alex%20kid/AlexKidd_papel.png',
    tesoura: 'imgs/alex%20kid/AlexKidd_tesoura.png'
};

const bossAtaqueImagens = {
    pedra: 'imgs/Gooseka/gooseka_pedra.png',
    papel: 'imgs/Gooseka/gooseka_papel.png',
    tesoura: 'imgs/Gooseka/gooseka_tesoura.png'
};

const opcoes = ['pedra', 'papel', 'tesoura'];
let vitorias = 0;
let derrotas = 0;
let musicaTocando = false;

// Evento de clique em cada balão de escolha
el.btnOpcoes.forEach(botao => {
    botao.addEventListener('click', (e) => {
        if (!musicaTocando) {
            el.musica.play();
            musicaTocando = true;
        }

        //pega o id do botão clicado (pedra, papel ou tesoura) e inicia a animação da rodada
        const escolhaAlex = botao.id || botao.parentElement.id;
        iniciarAnimacaoRodada(e.currentTarget.id);
    });
});

function iniciarAnimacaoRodada(escolhaAlex) {
    //  Esconde os  botões e mostra texto
    el.botoes.style.display = 'none';
    el.arena.style.display = 'flex';
    el.mensagem.innerText = "JAN... KEN...";

    //toca o som do janken
    el.sfxJanken.currentTime = 0;
    el.sfxJanken.play();

    // Inicia o efeito das açoes girando
    let contador = 0;
    const tempoTroca = 100; // Troca a cada 0.1 segundo

    const animacao = setInterval(() => {
        // Mostra opções aleatórias piscando
        mostrarEscolha(el.imagemAlex, imagens.alex, opcoes[contador % 3]);
        mostrarEscolha(el.imagemBoss, imagens.boss, opcoes[(contador + 1) % 3]);
        contador++;
    }, tempoTroca);

    // 3. Após 2 segundos, para a animação e mostra o resultado!
    setTimeout(() => {
        clearInterval(animacao);
        finalizarRodada(escolhaAlex);
    }, 2000);
}

function finalizarRodada(escolhaAlex) {
    // Computador escolhe
    const escolhaBoss = opcoes[Math.floor(Math.random() * 3)];

    // Mostra as escolhas finais na tela
    mostrarEscolha(el.imagemAlex, imagens.alex, escolhaAlex);
    mostrarEscolha(el.imagemBoss, imagens.boss, escolhaBoss);
    el.mensagem.innerText = "PON!";

    //muda o spirte do alex para a jogada final
    el.imagemAlex.src = alexAtaqueImagens[escolhaAlex];
    el.imagemAlex.alt = `Escolha: ${escolhaAlex}`;

    //muda o sprite do boss para a jogada final
    el.bossSprite.src = 'imgs/Gooseka/gooseka_atacando.png';
    el.bossMao.src = bossMaoImagens[escolhaBoss] || 'imgs/Gooseka/gooseka_mao.png';
    el.bossMao.style.display = 'block';

    // Verifica quem ganhou
    setTimeout(() => {
        verificarVencedor(escolhaAlex, escolhaBoss);
    }, 1000); // Espera 1 segundinho pra pessoa processar o resultado
}

function mostrarEscolha(elemento, imagensPersonagem, escolha) {
    elemento.src = imagensPersonagem[escolha];
    elemento.alt = `Escolha: ${escolha}`;
}

function verificarVencedor(alex, boss) {
    if (alex === boss) {
        el.mensagem.innerText = "EMPATE! DE NOVO!";
    } else if (
        (alex === 'pedra' && boss === 'tesoura') ||
        (alex === 'papel' && boss === 'pedra') ||
        (alex === 'tesoura' && boss === 'papel')
    ) {
        el.mensagem.innerText = "GANHOU!";
        vitorias++;
        el.marcadores.innerHTML += " O "; // Adiciona o 'O' de vitória[cite: 2]
    } else {
        el.mensagem.innerText = "PERDEU!";
        derrotas++;
        el.marcadores.innerHTML += " X "; // Adiciona o 'X'
    }

    // Verifica o "Melhor de 3"
    setTimeout(() => {
        if (vitorias === 2) {
            alert("VOCÊ VENCEU O GOOSEKA! PRÓXIMA FASE!");
            resetarBoss();
        } else if (derrotas === 2) {
            alert("GAME OVER! VOCÊ VIROU PEDRA!");
            resetarBoss();
        } else {
            // Volta para a tela de escolher os balões para a próxima rodada
            el.botoes.style.display = 'flex';
            el.arena.style.display = 'none';
        }
    }, 2000);
}

function resetarBoss() {
    vitorias = 0;
    derrotas = 0;
    el.marcadores.innerHTML = "";
    el.botoes.style.display = 'flex';
    el.arena.style.display = 'none';
}