document.addEventListener("DOMContentLoaded", function() {
    // Carrega o ficheiro sidebar.html
    fetch('../html/sidebar.html')
        .then(response => {
            if (!response.ok) throw new Error("Erro ao carregar a sidebar");
            return response.text();
        })
        .then(data => {
            // Insere o HTML da sidebar na div vazia
            document.getElementById('sidebar-container').innerHTML = data;

            // Lógica para marcar o link atual como 'active'
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const navLinks = document.querySelectorAll('.main-nav a');

            navLinks.forEach(link => {
                const linkDestino = link.getAttribute('href');
                if (linkDestino === currentPage) {
                    link.classList.add('active');
                }
            });
        })
        .catch(error => console.error(error));
});