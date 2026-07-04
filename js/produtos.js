const cartCount = document.getElementById('cart-count');
const cartButtons = document.querySelectorAll('.btn-add-cart');
const favoriteButtons = document.querySelectorAll('.btn-favorite');
const cartButton = document.querySelector('.cart-button');
const cartPanel = document.getElementById('cart-panel');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalValue = document.getElementById('cart-total');
const cartClose = document.getElementById('cart-close');
const checkoutButton = document.getElementById('checkout-button');

let cartTotal = 0;
let cartItems = [];
let checkoutComplete = false;

function updateCheckoutVisibility() {
  if (checkoutComplete || cartItems.length === 0) {
    checkoutButton.style.display = 'none';
  } else {
    checkoutButton.style.display = 'block';
  }
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (checkoutComplete) {
    cartItemsContainer.innerHTML = '<p class="checkout-message visible">Obrigado pela confiança</p>';
  } else if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Carrinho vazio. Adicione algum produto.</p>';
  } else {
    cartItems.forEach(item => {
      total += item.price * item.quantity;
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span>${item.quantity}x</span>
        </div>
        <span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
      `;
      cartItemsContainer.appendChild(itemElement);
    });
  }

  cartTotalValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  updateCheckoutVisibility();
}

function openCartPanel() {
  cartPanel.classList.add('open');
  renderCart();
}

function closeCartPanel() {
  cartPanel.classList.remove('open');
}

function resetCart() {
  cartItems = [];
  cartTotal = 0;
  cartCount.textContent = cartTotal;
  renderCart();
}

cartButtons.forEach(button => {
  button.addEventListener('click', () => {
    checkoutComplete = false;
    const card = button.closest('.product-card');
    const productId = card.dataset.productId;
    const name = card.querySelector('h3').textContent.trim();
    const priceText = card.querySelector('.product-price').textContent.replace('R$ ', '').replace('.', '').replace(',', '.');
    const price = parseFloat(priceText);

    const existingItem = cartItems.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ id: productId, name, price, quantity: 1 });
    }

    cartTotal += 1;
    cartCount.textContent = cartTotal;
    button.textContent = 'Adicionado';
    button.classList.add('added');
  });
});

favoriteButtons.forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
    button.setAttribute('aria-pressed', button.classList.contains('active'));
  });
});

cartButton.addEventListener('click', openCartPanel);
cartClose.addEventListener('click', closeCartPanel);
cartPanel.addEventListener('click', (event) => {
  if (event.target === cartPanel) {
    closeCartPanel();
  }
});

checkoutButton.addEventListener('click', () => {
  checkoutComplete = true;
  cartItems = [];
  cartTotal = 0;
  cartCount.textContent = cartTotal;
  renderCart();
  setTimeout(() => {
    closeCartPanel();
    checkoutComplete = false;
    renderCart();
  }, 3000);
});

renderCart();
