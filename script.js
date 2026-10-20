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

    // Corrigidas as referências para os bonecos no chão
    alexSpriteChao: document.getElementById('alex-imagem'),
    bossImg: document.getElementById('boss-imagem'),

    musica: document.getElementById('musica-fundo'),
    sfxJanken: document.getElementById('sfx-janken'),
    sfxDerrotaBoss: document.getElementById('sfx-derrota-boss'),
    sfxDerrotaPlayer: document.getElementById('sfx-derrota-player'),
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

const morteImagens = {
    alex: 'imgs/Gooseka/lost_animation.gif',
    boss: 'imgs/Gooseka/lost_animation.gif'
};

const opcoes = ['pedra', 'papel', 'tesoura'];
let vitorias = 0;
let derrotas = 0;
let primeiraInteracao = false;


el.btnOpcoes.forEach(botao => {
    botao.addEventListener('click', (e) => {
        // Pausa a música de fundo imediatamente quando o jogador clica em alguma opção
        el.musica.pause();
        primeiraInteracao = true;

        const escolhaAlex = botao.id || botao.parentElement.id;
        iniciarAnimacaoRodada(escolhaAlex);
    });
});

function iniciarAnimacaoRodada(escolhaAlex) {
    el.botoes.style.display = 'none';
    el.arena.style.display = 'flex';
    el.mensagem.innerText = "JAN... KEN...";

    // Toca o som do janken
    el.sfxJanken.currentTime = 0;
    el.sfxJanken.play();

    let contador = 0;
    const tempoTroca = 100;

    const animacao = setInterval(() => {
        mostrarEscolha(el.imagemAlex, acoesImagens.alex, opcoes[contador % 3]);
        mostrarEscolha(el.imagemBoss, acoesImagens.boss, opcoes[(contador + 1) % 3]);
        contador++;
    }, tempoTroca);

    // Quando o áudio do Janken chegar ao fim, ele aciona mostra a jogada
    el.sfxJanken.onended = () => {
        clearInterval(animacao);
        finalizarRodada(escolhaAlex);
    };
}

function finalizarRodada(escolhaAlex) {
    const escolhaBoss = opcoes[Math.floor(Math.random() * 3)];

    mostrarEscolha(el.imagemAlex, acoesImagens.alex, escolhaAlex);
    mostrarEscolha(el.imagemBoss, acoesImagens.boss, escolhaBoss);
    el.mensagem.innerText = "PON!";

    // Mostra as animações de ataque no 
    el.alexSpriteChao.src = alexAtaqueImagens[escolhaAlex];
    el.bossImg.src = 'imgs/Gooseka/gooseka_atacando.png';
    el.bossMao.src = bossAtaqueImagens[escolhaBoss] || 'imgs/Gooseka/gooseka_mao.png';
    el.bossMao.style.display = 'block';

    setTimeout(() => {
        verificarVencedor(escolhaAlex, escolhaBoss);
    }, 1000);
}

function mostrarEscolha(elemento, imagensPersonagem, escolha) {
    elemento.src = imagensPersonagem[escolha];
    elemento.alt = `Escolha: ${escolha}`;
}

function verificarVencedor(alex, boss) {
    if (alex === boss) {
        el.mensagem.innerText = "EMPATE!";
    } else if (
        (alex === 'pedra' && boss === 'tesoura') ||
        (alex === 'papel' && boss === 'pedra') ||
        (alex === 'tesoura' && boss === 'papel')
    ) {
        el.mensagem.innerText = "GANHOU!";
        vitorias++;
        el.marcadores.innerHTML += " O ";

        tocarSom(el.sfxDerrotaBoss);
    } else {
        el.mensagem.innerText = "VOCE PERDEU!";
        derrotas++;
        el.marcadores.innerHTML += " X ";

        tocarSom(el.sfxDerrotaPlayer);
    }

    setTimeout(() => {
        if (vitorias === 2) {
            acionarMorteEFinalizar('boss');
        } else if (derrotas === 2) {
            acionarMorteEFinalizar('alex');
        } else {
            prepararProximaRodada();
        }
    }, 2000);
}

function acionarMorteEFinalizar(perdedor) {
    el.arena.style.display = 'none';

    if (perdedor === 'boss') {
        el.bossImg.src = morteImagens.boss;
        el.bossMao.style.display = 'none';

    } else if (perdedor === 'alex') {
        el.alexSpriteChao.src = morteImagens.alex;
    }

    setTimeout(() => {
        if (perdedor === 'boss') {
            alert("VOCÊ VENCEU!");
        } else {
            alert("GAME OVER!");
        }
        resetarBoss();
    }, 3000);
}

function tocarSom(audio) {
    audio.currentTime = 0;
    audio.play();
}

function prepararProximaRodada() {
    // Repõe os bonecos parados no chão corretamente
    el.alexSpriteChao.src = 'imgs/alex%20kid/AlexKidd_ataque.gif'; // Se tiver um alex_idle.gif, use-o aqui
    el.bossImg.src = 'imgs/Gooseka/gooseka_idle.gif';
    el.bossMao.style.display = 'none';

    el.botoes.style.display = 'flex';
    el.arena.style.display = 'none';

    // A música volta a tocar  quando os botões reaparecem
    if (primeiraInteracao) {
        el.musica.volume = 0.2;
        el.musica.play();
    }
}

function resetarBoss() {
    vitorias = 0;
    derrotas = 0;
    el.marcadores.innerHTML = "";
    prepararProximaRodada();
}