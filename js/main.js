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
    // Procura o botão pela classe correta definida no index.html
    const btnToggleTema = document.querySelector('.theme-toggle');
    const brandLogo = document.querySelector('.brand img');

    // Função interna para atualizar os ícones e imagens dependendo do tema atual
    const updateThemeUI = () => {
        if (document.body.classList.contains('light')) {
            if (btnToggleTema) {
                btnToggleTema.textContent = '🌙';
                btnToggleTema.title = 'Alternar para tema escuro';
            }
            if (brandLogo) brandLogo.src = '../imagens/logo (2).png'; // Logo escura para tema claro
        } else {
            if (btnToggleTema) {
                btnToggleTema.textContent = '☀️';
                btnToggleTema.title = 'Alternar para tema claro';
            }
            if (brandLogo) brandLogo.src = '../imagens/logo_branco.png'; // Logo branca para tema escuro
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