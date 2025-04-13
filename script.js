// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function () {
    // Todo o código de inicialização aqui

    // Inicializar carrossel
    initCarousel();

    // Inicializar player
    initMusicPlayer();

    // Outras funções...
});

function initCarousel() {
    // Configuração do carrossel
    const carousel = document.querySelector('.carousel');
    const items = carousel.querySelectorAll('.carousel-item');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    let currentIndex = 0;
    let interval;

    // Função para mostrar um slide específico
    function showSlide(index) {
        // Remover classe active de todos os slides e indicadores
        items.forEach(item => {
            item.classList.remove('active');
        });

        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        // Adicionar classe active ao slide atual e seu indicador
        items[index].classList.add('active');
        indicators[index].classList.add('active');
        currentIndex = index;
    }

    // Função para avançar para o próximo slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        showSlide(currentIndex);
    }

    // Função para voltar ao slide anterior
    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showSlide(currentIndex);
    }

    // Adicionar eventos aos botões
    nextBtn.addEventListener('click', function () {
        nextSlide();
        restartInterval();
    });

    prevBtn.addEventListener('click', function () {
        prevSlide();
        restartInterval();
    });

    // Adicionar eventos aos indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function () {
            showSlide(index);
            restartInterval();
        });
    });

    // Iniciar alternância automática dos slides
    function startInterval() {
        interval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
    }

    // Reiniciar o intervalo quando houver interação manual
    function restartInterval() {
        clearInterval(interval);
        startInterval();
    }

    // Lidar com imagens carregadas para melhor performance
    window.addEventListener('load', function () {
        document.querySelectorAll('.banner-image').forEach(img => {
            img.classList.add('loaded');
        });
    });

    // Iniciar o carrossel
    startInterval();
}

function initMusicPlayer() {
    // Player de Música Personalizado
    const audio = document.getElementById('background-music');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const muteBtn = document.getElementById('mute-btn');
    const progressBar = document.querySelector('.progress');
    const progressContainer = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const volumeBar = document.querySelector('.volume-bar');
    const volumeSlider = document.querySelector('.volume-slider');
    const playlistItems = document.querySelectorAll('.playlist-item');

    // Lista de músicas (adicione todas as suas músicas aqui)
    const songs = [
        {
            title: 'Nada Pode Calar o Adorador',
            artist: 'Jaddyell Sousa',
            src: '/musicas/jadielnadapodecalaroadorador.mp3',
            cover: '/img/jaddyell-sousa.png',
            duration: '3:45'
        },
        // Adicione outras músicas aqui seguindo o mesmo formato
    ];

    let currentSong = 0;
    let isPlaying = false;

    // Carregar música
    function loadSong(index) {
        const song = songs[index];
        audio.src = song.src;
        document.querySelector('.song-title').textContent = song.title;
        document.querySelector('.artist-name').textContent = song.artist;
        document.querySelector('.album-cover').src = song.cover;

        // Atualizar item ativo na playlist
        playlistItems.forEach(item => item.classList.remove('active'));
        if (playlistItems[index]) {
            playlistItems[index].classList.add('active');
        }

        // Resetar progresso
        progressBar.style.width = '0%';
        currentTimeEl.textContent = '0:00';

        // Pré-carregar o áudio
        audio.load();
    }

    // Função para formatar o tempo em minutos:segundos
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Funções de controle de reprodução
    function playAudio() {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audio.play().catch(error => {
            console.error("Erro ao reproduzir áudio:", error);
            alert("Não foi possível reproduzir o áudio. Verifique se o arquivo existe.");
        });
        isPlaying = true;
    }

    function pauseAudio() {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        audio.pause();
        isPlaying = false;
    }

    // Atualizar a barra de progresso
    function updateProgress() {
        const { duration, currentTime } = audio;
        if (isNaN(duration)) return;

        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;

        currentTimeEl.textContent = formatTime(currentTime);
    }

    // Definir o progresso ao clicar na barra
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // Próxima música
    function nextSong() {
        currentSong = (currentSong + 1) % songs.length;
        loadSong(currentSong);
        if (isPlaying) {
            playAudio();
        }
    }

    // Música anterior
    function prevSong() {
        currentSong = (currentSong - 1 + songs.length) % songs.length;
        loadSong(currentSong);
        if (isPlaying) {
            playAudio();
        }
    }

    // Alternar mudo
    function toggleMute() {
        if (audio.volume > 0) {
            audio.dataset.volume = audio.volume;
            audio.volume = 0;
            volumeBar.style.width = '0%';
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            audio.volume = audio.dataset.volume || 1;
            volumeBar.style.width = `${audio.volume * 100}%`;
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    // Atualizar volume
    function updateVolume(e) {
        const width = volumeSlider.clientWidth;
        const clickX = e.offsetX;
        const volume = clickX / width;

        audio.volume = volume;
        volumeBar.style.width = `${volume * 100}%`;

        // Atualizar ícone de volume
        if (volume === 0) {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.5) {
            muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    // Event Listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseAudio() : playAudio();
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);

    // Inicialização
    loadSong(0);

    // Adicione isso para debug
    audio.addEventListener('error', function (e) {
        console.error('Erro ao carregar áudio:', e);
        alert('Erro ao carregar o arquivo de áudio! Verifique se o arquivo existe em: ' + audio.src);
    });

    progressContainer.addEventListener('click', setProgress);

    volumeSlider.addEventListener('click', updateVolume);
    muteBtn.addEventListener('click', toggleMute);

    // Iniciar reprodução ao clicar em itens da playlist
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentSong = index;
            loadSong(currentSong);
            playAudio();
        });
    });

    // Carregar a primeira música
    loadSong(0);

    // Verificar erro no carregamento do áudio
    audio.addEventListener('error', function () {
        console.error('Erro ao carregar o arquivo de áudio. Verifique o caminho:', audio.src);
        alert('Não foi possível carregar o arquivo de áudio. Verifique se o arquivo existe no caminho especificado.');
    });
}

// Formulário de Contato com localStorage
const contactForm = document.getElementById('contact-form');
const mensagensSalvasDiv = document.getElementById('mensagens-salvas');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem').value;

    const mensagemObj = { nome, email, mensagem, data: new Date().toLocaleString() };

    // Recuperar mensagens existentes ou criar novo array
    let mensagens = JSON.parse(localStorage.getItem('mensagens')) || [];
    mensagens.push(mensagemObj);
    localStorage.setItem('mensagens', JSON.stringify(mensagens));

    // Exibir mensagem de sucesso
    alert('Mensagem enviada com sucesso!');

    // Limpar formulário
    contactForm.reset();

    // Atualizar lista de mensagens salvas
    exibirMensagens();
});

// Exibir mensagens salvas
function exibirMensagens() {
    const mensagens = JSON.parse(localStorage.getItem('mensagens')) || [];
    mensagensSalvasDiv.innerHTML = '<h3>Mensagens Enviadas</h3>';

    if (mensagens.length === 0) {
        mensagensSalvasDiv.innerHTML += '<p>Nenhuma mensagem salva.</p>';
        return;
    }

    mensagens.forEach((msg, index) => {
        mensagensSalvasDiv.innerHTML += `
            <div>
                <p><strong>Nome:</strong> ${msg.nome}</p>
                <p><strong>E-mail:</strong> ${msg.email}</p>
                <p><strong>Mensagem:</strong> ${msg.mensagem}</p>
                <p><strong>Data:</strong> ${msg.data}</p>
                <button onclick="deletarMensagem(${index})">Deletar</button>
                <hr>
            </div>
        `;
    });
}

// Deletar mensagem
function deletarMensagem(index) {
    let mensagens = JSON.parse(localStorage.getItem('mensagens')) || [];
    mensagens.splice(index, 1);
    localStorage.setItem('mensagens', JSON.stringify(mensagens));
    exibirMensagens();
}

// Carregar mensagens ao iniciar
exibirMensagens();