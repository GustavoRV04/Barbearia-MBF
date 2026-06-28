document.addEventListener("DOMContentLoaded", function() {
    
    // 1. CARREGAR TEMA SALVO IMEDIATAMENTE (Para evitar flashes brancos)
    // O seu CSS usa a classe 'light' e a chave 'site-theme' no localStorage
    if (localStorage.getItem('site-theme') === 'light') {
        document.body.classList.add('light'); 
    }

    // 2. INJETAR A SIDEBAR
    fetch('../html/sidebar.html')
        .then(response => {
            if (!response.ok) throw new Error("Erro ao carregar a sidebar");
            return response.text();
        })
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;

            // Marcar o link atual como ativo
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const navLinks = document.querySelectorAll('.sidebar nav a'); // Ajustado para pegar o nav correto
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.parentElement.classList.add('active'); // O CSS aplica o active no <li>, não no <a>
                }
            });

            // 3. INICIAR FUNÇÕES DA SIDEBAR E TEMA
            // Importante chamar o tema AQUI TAMBÉM para garantir que o logo da sidebar injetada seja atualizado
            configurarInteracoesSidebar();
            configurarTema();
        })
        .catch(error => console.error(error));
});

// Função para Abrir/Fechar Sidebar
function configurarInteracoesSidebar() {
    // Procura o botão pela classe correta definida no index.html
    const btnToggleSidebar = document.querySelector('.sidebar-toggle'); 

    if (btnToggleSidebar) {
        btnToggleSidebar.addEventListener('click', () => {
            // O seu style.css usa a classe 'sidebar-collapsed' aplicada no body
            document.body.classList.toggle('sidebar-collapsed'); 
        });
    }
}

// Função para Alternar o Tema
function configurarTema() {
    const btnToggleTema = document.querySelector('.theme-toggle');
    const brandLogo = document.querySelector('.brand img');
    // Seleciona o elemento de imagem dentro do botão de tema
    const imgToggleTema = btnToggleTema ? btnToggleTema.querySelector('img') : null;

    const updateThemeUI = () => {
        if (document.body.classList.contains('light')) {
            if (imgToggleTema) imgToggleTema.src = '../favicon/dark.png'; // Mostra a lua no tema claro
            if (btnToggleTema) btnToggleTema.title = 'Alternar para tema escuro';
            if (brandLogo) brandLogo.src = '../imagens/logo (2).png';
        } else {
            if (imgToggleTema) imgToggleTema.src = '../favicon/sunny.png'; // Mostra o sol no tema escuro
            if (btnToggleTema) btnToggleTema.title = 'Alternar para tema claro';
            if (brandLogo) brandLogo.src = '../imagens/logo_branco.png';
        }
    };

    // Garante que a UI esteja correta ao carregar a página
    updateThemeUI(); 

    if (btnToggleTema) {
        btnToggleTema.addEventListener('click', () => {
            // Alterna a classe 'light' no body (como o seu CSS espera)
            document.body.classList.toggle('light');
            
            // Guarda a preferência no navegador
            const isLight = document.body.classList.contains('light');
            localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
            
            // Atualiza os botões visuais
            updateThemeUI();
        });
    }
}

// ==========================================
// LÓGICA DO CARROSSEL DE IMAGENS
// ==========================================
let slideIndex = 0;
let carrosselTimer;

// Função chamada para iniciar a troca automática
function iniciarCarrossel() {
    const slides = document.querySelectorAll('.carrossel-slide');
    if (slides.length === 0) return; // Se não houver carrossel na página, ignora
    
    // Configura a troca a cada 5000 milissegundos (5 segundos)
    carrosselTimer = setInterval(avancarSlide, 5000);
}

function avancarSlide() {
    const slides = document.querySelectorAll('.carrossel-slide');
    let nextIndex = slideIndex + 1;
    
    // Se chegar à última imagem, volta para a primeira
    if (nextIndex >= slides.length) {
        nextIndex = 0;
    }
    mudarSlide(nextIndex);
}

// Função acionada ao clicar nos botões do HUD (rato)
window.mudarSlide = function(index) {
    const slides = document.querySelectorAll('.carrossel-slide');
    const dots = document.querySelectorAll('.hud-dot');
    
    if (slides.length === 0) return;

    // Remove as classes ativas das imagens e dos pontos atuais
    slides[slideIndex].classList.remove('active');
    dots[slideIndex].classList.remove('active');
    
    // Atualiza o índice para o escolhido
    slideIndex = index;
    
    // Adiciona as classes ativas à nova imagem e ponto selecionado
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
    
    // Reinicia o tempo automático para não trocar imediatamente após o clique manual
    clearInterval(carrosselTimer);
    carrosselTimer = setInterval(avancarSlide, 5000);
}

// Para garantir que o carrossel inicia quando a página carregar, 
// certifique-se de adicionar a chamada da função no seu DOMContentLoaded existente, assim:
document.addEventListener("DOMContentLoaded", function() {
    // ... os seus códigos existentes da sidebar e tema ...
    
    iniciarCarrossel(); // Chama a inicialização do carrossel
});