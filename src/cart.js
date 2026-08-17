// cart.js
// Holds cart state and all the functions needed to manage it.

export let cart = [];

export function addToCart(product, quantity = 1) {
  const existing = cart.find((item) => item.name === product.name);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      quantity,
    });
  }

  return cart;
}

export function updateCartItemQuantity(productName, quantity) {
  const item = cart.find((item) => item.name === productName);

  if (!item) return cart;

  if (quantity <= 0) {
    return removeFromCart(productName);
  }

  item.quantity = quantity;
  return cart;
}

export function removeFromCart(productName) {
  cart = cart.filter((item) => item.name !== productName);
  return cart;
}

export function clearCart() {
  cart = [];
  return cart;
}

export function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartItemCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

export function getCartItem(productName) {
  return cart.find((item) => item.name === productName);
}
