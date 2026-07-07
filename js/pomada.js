document.addEventListener('DOMContentLoaded', () => {
  // Abas
  document.querySelectorAll('.produto-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.produto-tab').forEach(t => t.classList.remove('ativo'));
      document.querySelectorAll('.produto-tab-content').forEach(c => c.classList.remove('ativo'));
      tab.classList.add('ativo');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('ativo');
    });
  });

  // Estrelas interativas
  const estrelas = document.querySelectorAll('.estrela');
  let notaSelecionada = 0;
  estrelas.forEach(e => {
    e.addEventListener('mouseenter', () => {
      const v = +e.dataset.valor;
      estrelas.forEach(s => s.classList.toggle('hover', +s.dataset.valor <= v));
    });
    e.addEventListener('mouseleave', () => {
      estrelas.forEach(s => { s.classList.remove('hover'); s.classList.toggle('selecionada', +s.dataset.valor <= notaSelecionada); });
    });
    e.addEventListener('click', () => {
      notaSelecionada = +e.dataset.valor;
      document.getElementById('aval-nota').value = notaSelecionada;
      estrelas.forEach(s => s.classList.toggle('selecionada', +s.dataset.valor <= notaSelecionada));
    });
  });
});

// Envio do formulário
window.enviarAvaliacao = function(e) {
  e.preventDefault();
  const feedback = document.getElementById('aval-feedback');
  feedback.hidden = false;
  e.target.reset();
  // Reset visual das estrelas
  document.querySelectorAll('.estrela').forEach(s => s.classList.remove('selecionada', 'hover'));
  document.getElementById('aval-nota').value = 0;
};