document.addEventListener('DOMContentLoaded', () => {
  const reviewChoiceForm = document.getElementById('review-choice-form');

  if (reviewChoiceForm) {
    const requiredInputs = Array.from(reviewChoiceForm.querySelectorAll('[required]'));
    const reviewRadios = Array.from(reviewChoiceForm.querySelectorAll('[name="reviewTarget"]'));
    const continueButton = reviewChoiceForm.querySelector('.btn-continue');

    const updateButtonState = () => {
      const filled = requiredInputs.every((input) => input.value.trim() !== '');
      const selected = reviewRadios.some((radio) => radio.checked);
      if (continueButton) {
        continueButton.disabled = !(filled && selected);
      }
    };

    requiredInputs.forEach((input) => input.addEventListener('input', updateButtonState));
    reviewRadios.forEach((radio) => radio.addEventListener('change', updateButtonState));

    reviewChoiceForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const selected = reviewRadios.find((radio) => radio.checked)?.value;
      if (selected === 'barbearia') {
        window.location.href = 'aval-barbearia.html';
      } else if (selected === 'lounge') {
        window.location.href = 'aval-lounge.html';
      }
    });
  }

  const reviewForms = document.querySelectorAll('.review-form.review-grid-right');
  reviewForms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const pageTitle = document.querySelector('.page-title h1')?.textContent?.trim() || 'Avaliação';
      if (pageTitle.toLowerCase().includes('barbearia')) {
        const selected = document.querySelector('.staff-choices .card.selected');
        if (!selected) {
          alert('Por favor, selecione o barbeiro que você deseja avaliar.');
          return;
        }
        const staffName = selected.getAttribute('data-staff') || 'Equipe';
        alert(`${pageTitle} de ${staffName} enviada com sucesso! Obrigado pela sua opinião.`);
      } else {
        alert(`${pageTitle} enviada com sucesso! Obrigado pela sua opinião.`);
      }
      form.reset();
    });
  });

  const staffChoices = document.querySelectorAll('.staff-choices .card');
  if (staffChoices.length) {
    staffChoices.forEach((card) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        staffChoices.forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });
  }
});
