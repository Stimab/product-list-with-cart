import { data } from "./data.js";
import {
  cart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
  getCartItemCount,
} from "./cart.js";

let productHTML = "";

data.forEach((product, index) => {
  productHTML += `<div class="mt-5">
  <div data-index="${index}" class="relative js-card">
  <div class="rounded-[0.6rem] overflow-hidden md:hidden">
    <img
      src="${product.image.mobile}"
      alt="${product.category} image"
    />
  </div>
  <div class="rounded-[0.6rem] overflow-hidden hidden md:block lg:hidden">
    <img
      src="${product.image.tablet}"
      alt="${product.category} image"
    />
  </div>
  <div class="rounded-[0.6rem] overflow-hidden hidden lg:block">
    <img
      src="${product.image.desktop}"
      alt="${product.category} image"
    />
  </div>

  <div
    data-index="${index}"
    class="flex bg-white py-[0.6rem] px-[1.6rem] md:px-[0.812rem] lg:px-[0.8rem] absolute -bottom-6 left-[24%] md:left-[19%] lg:left-[13%] xl:left-[19%] border border-rose-500 rounded-[1.4rem] w-[51%] md:w-[65%] lg:w-[75%] xl:w-[65%] items-center justify-center hover:cursor-pointer hover:border-primary-500 js-add-to-cart-button"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      fill="none"
      viewBox="0 0 21 20"
    >
      <g fill="#C73B0F" clip-path="url(#a)">
        <path
          d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"
        />
        <path
          d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M.333 0h20v20h-20z" />
        </clipPath>
      </defs>
    </svg>
    <p
      class="text-rose-900 text-[0.95rem] font-semibold pl-2 hover:text-primary-500"
    >
      Add to Cart
    </p>
  </div>

  <div
    data-index="${index}"
    class="hidden bg-primary-500 py-2 px-3 absolute -bottom-6 left-[24%] md:left-[19%] lg:left-[13%] xl:left-[19%] rounded-full w-[51%] md:w-[65%] lg:w-[75%] xl:w-[61%] items-center justify-between js-quantity-container"
  >
    <!-- Minus button -->
    <button
      type="button"
      data-index="${index}"
      class="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shrink-0 js-minus-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="2"
        fill="none"
        viewBox="0 0 10 2"
      >
        <path fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
      </svg>
    </button>

    <!-- Number -->
    <p class="text-white font-medium text-lg js-quantity-input" data-index="${index}">
      1
    </p>

    <!-- Plus button -->
    <button
      type="button"
      data-index="${index}"
      class="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shrink-0 js-plus-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="none"
        viewBox="0 0 10 10"
      >
        <path
          fill="#fff"
          d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
        />
      </svg>
    </button>
  </div>
</div>

<div class="mt-9">
  <p class="text-rose-500 text-[0.96rem]">${product.category}</p>
  <p class="text-rose-900 text-[1.1rem] font-semibold">
    ${product.name}
  </p>
  <p class="text-primary-500 font-semibold">&dollar;${product.price.toFixed(2)}</p>
</div>
</div>`;
});

document.querySelector(".js-desert-menu").innerHTML = productHTML;

// Local quantity state per product row (what the +/- buttons show),
// separate from the actual cart contents in cart.js.
const quantities = data.map(() => 1);

const addCartButtons = document.querySelectorAll(".js-add-to-cart-button");
const quantityContainers = document.querySelectorAll(".js-quantity-container");
const minusButtons = document.querySelectorAll(".js-minus-button");
const plusButtons = document.querySelectorAll(".js-plus-button");
const quantityInputs = document.querySelectorAll(".js-quantity-input");
const cardItem = document.querySelectorAll(".js-card");
const emptyCart = document.querySelector(".js-empty-cart");
const cartDisplay = document.querySelector(".js-cart-display");
const orderConfirmedDisplay = document.querySelector(".js-order-confirmed");

// Renders the current cart contents into the cart display container.
function renderCart() {
  if (!cartDisplay) return;

  if (cart.length === 0) {
    cartDisplay.innerHTML = "";
    emptyCart?.classList.remove("hidden");
    cartDisplay.classList.add("hidden");
    return;
  }

  emptyCart?.classList.add("hidden");
  cartDisplay.classList.remove("hidden");

  const itemsHTML = cart
    .map(
      (item) => `
    <div
      class="flex items-center justify-between pb-4.5 lg:pb-4 border-b-2 border-rose-100 mt-4.5 lg:mt-4 js-cart-item"
      data-name="${item.name}"
    >
      <div>
        <p class="text-[1rem] text-rose-900 font-semibold">
          ${item.name}
        </p>

        <span class="flex mt-1 text-[0.98rem]">
          <p class="text-[#C73B0F] font-semibold">${item.quantity}x</p>
          <p class="text-rose-400 ml-4">&commat; &dollar;${item.price.toFixed(2)}</p>
          <p class="ml-2 text-rose-400 font-semibold">&dollar;${(item.price * item.quantity).toFixed(2)}</p>
        </span>
      </div>

      <button
        type="button"
        data-name="${item.name}"
        class="flex items-center justify-center w-5 h-5 rounded-full border-2 border-rose-300 hover:border-rose-900 hover:fill-rose-900 shrink-0 hover:cursor-pointer js-remove-cart-item"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          fill="none"
          viewBox="0 0 10 10"
        >
          <path
            class="hover:fill-rose-900"
            fill="hsl(7, 20%, 60%)"
            d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
          />
        </svg>
      </button>
    </div>`,
    )
    .join("");

  cartDisplay.innerHTML = `
    <div class="text-primary-500 font-bold text-[1.65rem]">
      Your Cart (${getCartItemCount()})
    </div>

    ${itemsHTML}

    <div class="flex mt-7 lg:mt-4.5 justify-between items-center">
      <p class="text-rose-500 font-semibold">Order Total</p>
      <p class="text-rose-900 text-[1.73rem] font-bold">&dollar;${getCartTotal().toFixed(2)}</p>
    </div>

    <div
      class="mt-7 lg:mt-4.5 p-[1.15rem] bg-rose-50 rounded-[0.65rem] flex justify-center"
    >
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="20"
          fill="none"
          viewBox="0 0 21 20"
        >
          <path
            fill="#1EA575"
            d="M8 18.75H6.125V17.5H8V9.729L5.803 8.41l.644-1.072 2.196 1.318a1.256 1.256 0 0 1 .607 1.072V17.5A1.25 1.25 0 0 1 8 18.75Z"
          />
          <path
            fill="#1EA575"
            d="M14.25 18.75h-1.875a1.25 1.25 0 0 1-1.25-1.25v-6.875h3.75a2.498 2.498 0 0 0 2.488-2.747 2.594 2.594 0 0 0-2.622-2.253h-.99l-.11-.487C13.283 3.56 11.769 2.5 9.875 2.5a3.762 3.762 0 0 0-3.4 2.179l-.194.417-.54-.072A1.876 1.876 0 0 0 5.5 5a2.5 2.5 0 1 0 0 5v1.25a3.75 3.75 0 0 1 0-7.5h.05a5.019 5.019 0 0 1 4.325-2.5c2.3 0 4.182 1.236 4.845 3.125h.02a3.852 3.852 0 0 1 3.868 3.384 3.75 3.75 0 0 1-3.733 4.116h-2.5V17.5h1.875v1.25Z"
          />
        </svg>
      </span>
      <p class="text-[0.94rem] ml-[0.55rem] text-rose-900">
        This is a
        <span class="font-semibold">carbon-neutral</span>
        delivery
      </p>
    </div>

    <button
      class="bg-primary-500 text-white w-full mt-7 lg:mt-4.5 py-4 lg:py-2.5 text-[1.1rem] lg:text-[1rem] font-semibold rounded-[3rem] hover:cursor-pointer hover:bg-[#9c2c09] js-confirm-order"
    >
      Confirm Order
    </button>
  `;
}

// Renders the "Order Confirmed" summary from the current cart contents.
function renderOrderConfirmation() {
  if (!orderConfirmedDisplay) return;

  const itemsHTML = cart
    .map(
      (item) => `
    <div class="w-full flex py-4 border-b border-rose-100 mb-1">
      <div class="rounded-[0.43rem] overflow-hidden mr-3.5 w-14.25">
        <img src="${item.image.tablet}" alt="${item.name}" />
      </div>

      <div class="text-[0.95rem]">
        <p class="text-rose-900 font-semibold">${item.name}</p>
        <span class="flex gap-3 mt-2.5">
          <p class="text-primary-500 font-semibold">${item.quantity}x</p>
          <p class="text-rose-400">&commat; &dollar;${item.price.toFixed(2)}</p>
        </span>
      </div>

      <div class="text-rose-900 font-semibold ml-auto mt-3.5">
        &dollar;${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>`,
    )
    .join("");

  orderConfirmedDisplay.innerHTML = `
      <div
        class="absolute top-[5.8rem] md:top-[8.8rem] lg:top-1/2 bg-white w-full sm:w-[80%] md:w-[67%] lg:w-[55%] xl:w-[43%] sm:left-[4.2rem] md:left-[8.2rem] lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 sm:rounded-[0.68rem] px-[1.1rem] pt-[2.1rem] rounded-t-[0.62rem] pb-6"
      >
    <span class="">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 32.121L13.5 24.6195L15.6195 22.5L21 27.879L32.3775 16.5L34.5 18.6225L21 32.121Z"
          fill="#1EA575"
        />
        <path
          d="M24 3C19.8466 3 15.7865 4.23163 12.333 6.53914C8.8796 8.84665 6.18798 12.1264 4.59854 15.9636C3.0091 19.8009 2.59323 24.0233 3.40352 28.0969C4.21381 32.1705 6.21386 35.9123 9.15077 38.8492C12.0877 41.7861 15.8295 43.7862 19.9031 44.5965C23.9767 45.4068 28.1991 44.9909 32.0364 43.4015C35.8736 41.812 39.1534 39.1204 41.4609 35.667C43.7684 32.2135 45 28.1534 45 24C45 18.4305 42.7875 13.089 38.8493 9.15076C34.911 5.21249 29.5696 3 24 3ZM24 42C20.4399 42 16.9598 40.9443 13.9997 38.9665C11.0397 36.9886 8.73256 34.1774 7.37018 30.8883C6.0078 27.5992 5.65134 23.98 6.34587 20.4884C7.04041 16.9967 8.75474 13.7894 11.2721 11.2721C13.7894 8.75473 16.9967 7.0404 20.4884 6.34587C23.98 5.65133 27.5992 6.00779 30.8883 7.37017C34.1774 8.73255 36.9886 11.0397 38.9665 13.9997C40.9443 16.9598 42 20.4399 42 24C42 28.7739 40.1036 33.3523 36.7279 36.7279C33.3523 40.1036 28.7739 42 24 42Z"
          fill="#1EA575"
        />
      </svg>
    </span>

    <p
      class="mt-4.5 text-rose-900 text-[2.5rem] font-bold w-[75%] tracking-[-0.03rem] leading-[2.9rem]"
    >
      Order Confirmed
    </p>

    <p class="text-rose-500 text-[0.97rem] mt-2.5">
      We hope you enjoy your food!
    </p>

    <div class="bg-rose-50 mt-3 px-5.5 py-2 rounded-[0.68rem]">
      ${itemsHTML}

      <div class="flex justify-between mt-6.5 mb-5.5 items-center">
        <p class="text-rose-900 text-[0.95rem]">Order Total</p>
        <p class="text-[1.45rem] font-bold text-rose-900">&dollar;${getCartTotal().toFixed(2)}</p>
      </div>
    </div>

    <button
      class="mt-10 text-center w-full bg-primary-500 text-white py-4 rounded-[3rem] font-semibold text-[1.1rem] hover:cursor-pointer js-start-new-order"
    >
      Start New Order
    </button>
    </div> 
  `;

  orderConfirmedDisplay.classList.remove("hidden");
}

// Event delegation for the "Start New Order" button, since it only exists
// once renderOrderConfirmation() has run.
orderConfirmedDisplay?.addEventListener("click", (e) => {
  const newOrderBtn = e.target.closest(".js-start-new-order");
  if (newOrderBtn) {
    clearCart();
    location.reload();
  }
});

// Event delegation on the cart container, since its "Remove" buttons and
// the "Confirm Order" button only exist once the cart has been rendered.
cartDisplay?.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".js-remove-cart-item");
  if (removeBtn) {
    const name = removeBtn.dataset.name;
    removeFromCart(name);

    // Reset that product's row back to the "Add to Cart" state.
    const index = data.findIndex((p) => p.name === name);
    if (index !== -1) {
      quantities[index] = 1;
      quantityInputs[index].innerHTML = 1;
      quantityContainers[index].classList.replace("flex", "hidden");
      addCartButtons[index].classList.replace("hidden", "flex");
      cardItem[index].classList.remove("selected-menu");
    }

    renderCart();
    return;
  }

  const confirmBtn = e.target.closest(".js-confirm-order");
  if (confirmBtn) {
    renderOrderConfirmation();
  }
});

// Wire up each product's own set of buttons
addCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const index = button.dataset.index;
    const product = data[index];

    button.classList.replace("flex", "hidden");
    quantityContainers[index].classList.replace("hidden", "flex");
    cardItem[index].classList.add("selected-menu");

    addToCart(product, quantities[index]);
    renderCart();
  });
});

minusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const index = button.dataset.index;
    const product = data[index];

    quantities[index] = Math.max(1, quantities[index] - 1);
    quantityInputs[index].innerHTML = quantities[index];

    updateCartItemQuantity(product.name, quantities[index]);
    renderCart();
  });
});

plusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const index = button.dataset.index;
    const product = data[index];

    quantities[index] = Math.min(10, quantities[index] + 1);
    quantityInputs[index].innerHTML = quantities[index];

    updateCartItemQuantity(product.name, quantities[index]);
    renderCart();
  });
});
