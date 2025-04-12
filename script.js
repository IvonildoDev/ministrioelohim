// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function () {
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
});

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