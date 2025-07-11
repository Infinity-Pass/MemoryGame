document.addEventListener('DOMContentLoaded', () => {

    criarCoracoesDeFundo(50); // Ajuste a quantidade de corações flutuantes
    criarCoracoesDeFundoEstaticos(100); // Ajuste a quantidade de corações estáticos
    
    // Elementos da Tela Inicial
    const containerInicial = document.querySelector('.container-inicial');
    const botaoComecar = document.getElementById('botaoComecar');
    const caixaPresente = document.getElementById('easterEggPresente');

    // Elementos do Jogo
    const containerJogo = document.querySelector('.container-jogo');
    const tabuleiroJogo = document.querySelector('.tabuleiro-jogo');
    const mensagemJogo = document.getElementById('mensagemJogo');

    // Elementos da Tela Final
    const containerFinal = document.querySelector('.container-final');
    // const fotoFinal = document.getElementById('fotoFinal'); // Já definida no HTML - não precisamos pegar aqui de novo
    const botaoReiniciar = document.getElementById('botaoReiniciar');
    

    // Configurações do Jogo
    // MODIFICADO: Adicionar as novas imagens aqui
    const imagensBase = [
        { nome: 'Sorrindo', src: 'foto_sorrindo.jpg' }, // Imagem existente 1
        { nome: 'Jaleco', src: 'foto_jaleco.jpg' },     // Imagem existente 2
        { nome: 'Careta', src: 'foto_careta.jpg' },     // Imagem existente 3
        { nome: 'Nova1', src: 'foto_nova_1.jpg' },    // Nova imagem 1 (substitua pelo nome real)
        { nome: 'Nova2', src: 'foto_nova_2.jpg' },    // Nova imagem 2 (substitua pelo nome real)
        { nome: 'Nova3', src: 'foto_nova_3.jpg' }     // Nova imagem 3 (substitua pelo nome real)
    ]; // Agora temos 6 imagens base, que resultarão em 12 cartas (6 pares)


    let cartasArray = [];
    let cartasViradas = [];
    let idsCartasViradas = [];
    let paresEncontrados = 0;

    // Função para embaralhar as cartas
    function embaralhar(array) {
        array.sort(() => 0.5 - Math.random());
    }

    // Função para criar o tabuleiro
    function criarTabuleiro() {
        paresEncontrados = 0;
        mensagemJogo.textContent = 'Clique em duas cartas!';
        tabuleiroJogo.innerHTML = ''; 
        cartasArray = []; 

        const imagensJogo = [...imagensBase, ...imagensBase];
        embaralhar(imagensJogo);

        imagensJogo.forEach((item, index) => {
            const carta = document.createElement('div');
            carta.classList.add('carta');
            carta.dataset.id = index; 
            carta.dataset.nome = item.nome; 

            const conteudoCarta = document.createElement('div');
            conteudoCarta.classList.add('conteudo-carta');

            const frenteCarta = document.createElement('div');
            frenteCarta.classList.add('frente-carta');
            frenteCarta.textContent = '❤️'; 

            const versoCarta = document.createElement('div');
            versoCarta.classList.add('verso-carta');
            const img = document.createElement('img');
            img.setAttribute('src', item.src);
            img.setAttribute('alt', item.nome);
            versoCarta.appendChild(img);

            conteudoCarta.appendChild(frenteCarta);
            conteudoCarta.appendChild(versoCarta);
            carta.appendChild(conteudoCarta);

            carta.addEventListener('click', virarCarta);
            tabuleiroJogo.appendChild(carta);
            cartasArray.push(carta);
        });
    }

    // Função para virar a carta
    function virarCarta() {
        if (this.classList.contains('par-encontrado')) return; // Impede clicar em cartas já encontradas
        if (cartasViradas.length === 2) return; 
        if (this.classList.contains('virada') && idsCartasViradas.includes(this.dataset.id)) return; // Impede clicar na mesma carta já virada no par atual

        const idClicado = this.dataset.id;
        const nomeClicado = this.dataset.nome;

        this.classList.add('virada');
        
        // Evitar adicionar a mesma carta duas vezes se clicada muito rápido
        if (!idsCartasViradas.includes(idClicado)) {
            cartasViradas.push(nomeClicado);
            idsCartasViradas.push(idClicado);
        } else if (cartasViradas.length === 1 && idsCartasViradas[0] === idClicado) {
            // Se a primeira carta virada for clicada novamente, não fazer nada
            return;
        }


        if (cartasViradas.length === 2) {
            setTimeout(checarPar, 700); 
        }
    }

    // Função para checar se formou um par
    function checarPar() {
        const [idPrimeira, idSegunda] = idsCartasViradas;
        const [nomePrimeira, nomeSegunda] = cartasViradas;
        
        // Encontra os elementos DOM das cartas viradas usando os IDs armazenados
        const cartaUmDOM = cartasArray.find(carta => carta.dataset.id === idPrimeira);
        const cartaDoisDOM = cartasArray.find(carta => carta.dataset.id === idSegunda);


        if (nomePrimeira === nomeSegunda && idPrimeira !== idSegunda) {
            mensagemJogo.textContent = 'Você achou um par! 🎉';
            // cartaUmDOM.removeEventListener('click', virarCarta); // Já removido na classe 'par-encontrado' indiretamente
            // cartaDoisDOM.removeEventListener('click', virarCarta);
            cartaUmDOM.classList.add('par-encontrado');
            cartaDoisDOM.classList.add('par-encontrado');
            paresEncontrados++;
        } else {
            mensagemJogo.textContent = 'Ops, tente de novo!';
            if(cartaUmDOM) cartaUmDOM.classList.remove('virada');
            if(cartaDoisDOM) cartaDoisDOM.classList.remove('virada');
        }

        cartasViradas = [];
        idsCartasViradas = [];

        if (paresEncontrados === imagensBase.length) {
            mensagemJogo.textContent = 'Parabéns! Você encontrou todos!';
            setTimeout(mostrarTelaFinal, 1500); 
        } else if (paresEncontrados < imagensBase.length ) {
           setTimeout(() => {
            if (mensagemJogo.textContent === 'Ops, tente de novo!' || mensagemJogo.textContent === 'Você achou um par! 🎉') {
                 mensagemJogo.textContent = 'Clique em duas cartas!';
            }
           }, 1500);
        }
    }

    function iniciarJogo() {
        containerInicial.style.display = 'none';
        containerFinal.style.display = 'none';
        containerJogo.style.display = 'block';
        criarTabuleiro();
    }

    function mostrarTelaFinal() {
        containerJogo.style.display = 'none';
        containerFinal.style.display = 'block';
    }

    botaoComecar.addEventListener('click', iniciarJogo);
    botaoReiniciar.addEventListener('click', iniciarJogo);
    if(caixaPresente) caixaPresente.addEventListener('click', soltarCoracoes);


    function soltarCoracoes(event) {
        const numeroDeCoracoes = 30; // Aumentei um pouco
        const areaClique = event.target.getBoundingClientRect(); 

        for (let i = 0; i < numeroDeCoracoes; i++) {
            const coracao = document.createElement('div');
            coracao.classList.add('coracao-flutuante');
            coracao.innerHTML = ['💖', '❤️', '💕', '💓', '💜', '🤍'][Math.floor(Math.random() * 6)]; // Variedade

            const offsetX = (Math.random() - 0.5) * 100; 
            const offsetY = (Math.random() - 0.5) * 50; 

            coracao.style.left = (areaClique.left + areaClique.width / 2 + offsetX) + 'px';
            coracao.style.top = (areaClique.top + areaClique.height / 2 + offsetY) + 'px';

            coracao.style.fontSize = (Math.random() * 20 + 10) + 'px'; 
            coracao.style.animationDelay = (Math.random() * 0.7) + 's'; 
            coracao.style.opacity = Math.random() * 0.5 + 0.5; // Opacidade variada

            document.body.appendChild(coracao);

            coracao.addEventListener('animationend', () => {
                coracao.remove();
            });
        }
    }

    function criarCoracoesDeFundo(quantidade) {
        const containerAnimacao = document.body; 
        const emojisCoracao = ['💖', '❤️', '💕', '💓', '💜', '🤍', '💗', '💝'];

        for (let i = 0; i < quantidade; i++) {
            const coracao = document.createElement('div');
            coracao.classList.add('coracao-fundo-animado');
            coracao.innerHTML = emojisCoracao[Math.floor(Math.random() * emojisCoracao.length)];

            coracao.style.left = Math.random() * 100 + 'vw';
            coracao.style.fontSize = Math.random() * 15 + 8 + 'px'; 
            coracao.style.animationDuration = (Math.random() * 10 + 10) + 's'; 
            coracao.style.animationDelay = Math.random() * 20 + 's'; // Aumentei o delay para mais variedade
            coracao.style.opacity = Math.random() * 0.3 + 0.1; // Para começar mais sutil
            containerAnimacao.appendChild(coracao);

             // Remove os corações depois de um tempo para não sobrecarregar
            setTimeout(() => {
                if (coracao.parentNode) {
                    // coracao.remove(); // Removido pois a animação CSS já os torna invisíveis e move para fora da tela
                }
            }, parseFloat(coracao.style.animationDuration.replace('s','')) * 1000 + parseFloat(coracao.style.animationDelay.replace('s','')) * 1000 + 1000);
        }
    }

    function criarCoracoesDeFundoEstaticos(quantidade) {
        const containerAnimacao = document.body;
        const emojisCoracao = ['💖', '❤️', '💕', '💓', '💜', '🤍', '💗', '💝']; 

        for (let i = 0; i < quantidade; i++) {
            const coracao = document.createElement('div');
            coracao.classList.add('coracao-fundo-estatico');
            coracao.innerHTML = emojisCoracao[Math.floor(Math.random() * emojisCoracao.length)];

            coracao.style.top = Math.random() * 100 + 'vh';
            coracao.style.left = Math.random() * 100 + 'vw';
            coracao.style.fontSize = Math.random() * 15 + 10 + 'px'; 
            coracao.style.opacity = '0'; 

            setTimeout(() => {
                // Aumenta a opacidade gradualmente com a animação CSS de pulsar
                coracao.style.animationDelay = Math.random() * 5 + 's'; // Delay para o início do pulsar
                coracao.style.opacity = '1'; // Deixa o CSS controlar a opacidade da animação
            }, Math.random() * 2000 + 500); 

            containerAnimacao.appendChild(coracao);
        }
    }
});