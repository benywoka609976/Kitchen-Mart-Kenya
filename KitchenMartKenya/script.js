// script.js
// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Initialize the application
function initializeApp() {
  updateCartCount();
  updateWishlistCount();
  
  // Initialize product cards if on a product page
  if (document.querySelector('.product-grid')) {
    initializeProductCards();
  }
  
  // Initialize cart page if on cart page
  if (document.getElementById('cart-items')) {
    renderCartItems();
  }
  
  // Initialize wishlist page if on wishlist page
  if (document.getElementById('wishlist-items')) {
    renderWishlistItems();
  }
  
  // Add event listeners
  document.addEventListener('click', function(e) {
    // Like button
    if (e.target.classList.contains('like-btn') || e.target.closest('.like-btn')) {
      const button = e.target.classList.contains('like-btn') ? e.target : e.target.closest('.like-btn');
      toggleWishlist(button);
    }
    
    // Add to cart button
    if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
      const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
      addToCart(button);
    }
    
    // Remove from cart
    if (e.target.classList.contains('remove-from-cart') || e.target.closest('.remove-from-cart')) {
      const button = e.target.classList.contains('remove-from-cart') ? e.target : e.target.closest('.remove-from-cart');
      removeFromCart(button.dataset.id);
    }
    
    // Remove from wishlist
    if (e.target.classList.contains('remove-from-wishlist') || e.target.closest('.remove-from-wishlist')) {
      const button = e.target.classList.contains('remove-from-wishlist') ? e.target : e.target.closest('.remove-from-wishlist');
      removeFromWishlist(button.dataset.id);
    }
    
    // Quantity controls
    if (e.target.classList.contains('quantity-decrease') || e.target.closest('.quantity-decrease')) {
      const button = e.target.classList.contains('quantity-decrease') ? e.target : e.target.closest('.quantity-decrease');
      decreaseQuantity(button.dataset.id);
    }
    
    if (e.target.classList.contains('quantity-increase') || e.target.closest('.quantity-increase')) {
      const button = e.target.classList.contains('quantity-increase') ? e.target : e.target.closest('.quantity-increase');
      increaseQuantity(button.dataset.id);
    }
    
    // Empty cart
    if (e.target.classList.contains('empty-cart-btn') || e.target.closest('.empty-cart-btn')) {
      emptyCart();
    }
    
    // Checkout button
    if (e.target.classList.contains('checkout-btn') || e.target.closest('.checkout-btn')) {
      checkout();
    }
  });
}

// Initialize product cards
function initializeProductCards() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const productId = card.dataset.id;
    const likeBtn = card.querySelector('.like-btn');
    
    // Check if product is in wishlist
    if (wishlist.some(item => item.id === productId)) {
      likeBtn.classList.add('active');
      likeBtn.innerHTML = '❤';
    }
  });
}

// Toggle wishlist
function toggleWishlist(button) {
  const productCard = button.closest('.product-card');
  const productId = productCard.dataset.id;
  const productTitle = productCard.querySelector('.product-title').textContent;
  const productPrice = productCard.querySelector('.product-price').textContent;
  const productImage = productCard.querySelector('.product-image').src;
  
  const product = {
    id: productId,
    title: productTitle,
    price: productPrice,
    image: productImage
  };
  
  // Check if product is already in wishlist
  const existingIndex = wishlist.findIndex(item => item.id === productId);
  
  if (existingIndex !== -1) {
    // Remove from wishlist
    wishlist.splice(existingIndex, 1);
    button.classList.remove('active');
    button.innerHTML = '🤍';
    showNotification('Removed from wishlist', 'info');
  } else {
    // Add to wishlist
    wishlist.push(product);
    button.classList.add('active');
    button.innerHTML = '❤';
    showNotification('Added to wishlist', 'success');
  }
  
  // Update localStorage
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
}

// Add to cart
function addToCart(button) {
  const productCard = button.closest('.product-card');
  const productId = productCard.dataset.id;
  const productTitle = productCard.querySelector('.product-title').textContent;
  const productPrice = productCard.querySelector('.product-price').textContent;
  const productImage = productCard.querySelector('.product-image').src;
  
  const product = {
    id: productId,
    title: productTitle,
    price: productPrice,
    image: productImage,
    quantity: 1
  };
  
  // Check if product is already in cart
  const existingIndex = cart.findIndex(item => item.id === productId);
  
  if (existingIndex !== -1) {
    // Increase quantity
    cart[existingIndex].quantity += 1;
    showNotification('Quantity increased', 'info');
  } else {
    // Add to cart
    cart.push(product);
    showNotification('Added to cart', 'success');
  }
  
  // Add animation to button
  button.classList.add('added-to-cart');
  setTimeout(() => {
    button.classList.remove('added-to-cart');
  }, 500);
  
  // Update localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // If on cart page, update the cart display
  if (document.getElementById('cart-items')) {
    renderCartItems();
  }
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
  showNotification('Removed from cart', 'info');
}

// Remove from wishlist
function removeFromWishlist(productId) {
  wishlist = wishlist.filter(item => item.id !== productId);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
  
  // If on wishlist page, update the display
  if (document.getElementById('wishlist-items')) {
    renderWishlistItems();
  }
  
  // Also update the like buttons on product pages
  const likeBtn = document.querySelector(`.product-card[data-id="${productId}"] .like-btn`);
  if (likeBtn) {
    likeBtn.classList.remove('active');
    likeBtn.innerHTML = '🤍';
  }
  
  showNotification('Removed from wishlist', 'info');
}

// Increase quantity
function increaseQuantity(productId) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
  }
}

// Decrease quantity
function decreaseQuantity(productId) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // Remove if quantity becomes 0
      removeFromCart(productId);
      return;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
  }
}

// Empty cart
function emptyCart() {
  if (cart.length === 0) {
    showNotification('Cart is already empty', 'info');
    return;
  }
  
  if (confirm('Are you sure you want to empty your cart?')) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    showNotification('Cart emptied', 'info');
  }
}

// Update cart count in header
function updateCartCount() {
  const cartCountElements = document.querySelectorAll('.cart-count');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
  });
}

// Update wishlist count in header
function updateWishlistCount() {
  const wishlistCountElements = document.querySelectorAll('.wishlist-count');
  
  wishlistCountElements.forEach(element => {
    element.textContent = wishlist.length;
  });
}

// Render cart items
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const cartSubtotalElement = document.getElementById('cart-subtotal');
  
  if (!cartItemsContainer) return;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
    if (cartTotalElement) cartTotalElement.textContent = 'KSh 0';
    if (cartSubtotalElement) cartSubtotalElement.textContent = 'KSh 0';
    return;
  }
  
  let cartHTML = '';
  let subtotal = 0;
  
  cart.forEach(item => {
    const price = parseFloat(item.price.replace('KSh ', '').replace(',', ''));
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;
    
    cartHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.title}</h3>
          <p class="cart-item-price">${item.price}</p>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button class="quantity-btn quantity-decrease" data-id="${item.id}">-</button>
            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
            <button class="quantity-btn quantity-increase" data-id="${item.id}">+</button>
          </div>
          <button class="remove-btn remove-from-cart" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;
  });
  
  cartItemsContainer.innerHTML = cartHTML;
  
  if (cartTotalElement) cartTotalElement.textContent = `KSh ${subtotal.toLocaleString()}`;
  if (cartSubtotalElement) cartSubtotalElement.textContent = `KSh ${subtotal.toLocaleString()}`;
}

// Render wishlist items
function renderWishlistItems() {
  const wishlistItemsContainer = document.getElementById('wishlist-items');
  
  if (!wishlistItemsContainer) return;
  
  if (wishlist.length === 0) {
    wishlistItemsContainer.innerHTML = '<p class="empty-wishlist-message">Your wishlist is empty</p>';
    return;
  }
  
  let wishlistHTML = '';
  
  wishlist.forEach(item => {
    wishlistHTML += `
      <div class="wishlist-item">
        <img src="${item.image}" alt="${item.title}" class="wishlist-item-image">
        <div class="wishlist-item-details">
          <h3 class="wishlist-item-title">${item.title}</h3>
          <p class="wishlist-item-price">${item.price}</p>
        </div>
        <div class="wishlist-item-actions">
          <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
          <button class="remove-btn remove-from-wishlist" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;
  });
  
  wishlistItemsContainer.innerHTML = wishlistHTML;
}

// Checkout function - sends order to WhatsApp
function checkout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty', 'warning');
    return;
  }
  
  let message = "Hello! I would like to place an order:\n\n";
  
  cart.forEach(item => {
    message += `- ${item.title} (Qty: ${item.quantity}) - ${item.price}\n`;
  });
  
  const subtotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price.replace('KSh ', '').replace(',', ''));
    return total + (price * item.quantity);
  }, 0);
  
  message += `\nTotal: KSh ${subtotal.toLocaleString()}\n\n`;
  message += "I understand this is CASH ON DELIVERY only. Please confirm my order.";
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappURL = `https://wa.me/254714227080?text=${encodedMessage}`;
  
  // Open WhatsApp in a new tab
  window.open(whatsappURL, '_blank');
  
  // Optionally clear cart after order
  // emptyCart();
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '15px 20px';
  notification.style.borderRadius = '4px';
  notification.style.color = 'white';
  notification.style.zIndex = '10000';
  notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  notification.style.transition = 'all 0.3s ease';
  
  // Set background color based on type
  if (type === 'success') {
    notification.style.backgroundColor = 'var(--success)';
  } else if (type === 'warning') {
    notification.style.backgroundColor = 'var(--warning)';
    notification.style.color = 'var(--dark)';
  } else if (type === 'info') {
    notification.style.backgroundColor = 'var(--secondary)';
  } else {
    notification.style.backgroundColor = 'var(--dark)';
  }
  
  // Add to body
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}