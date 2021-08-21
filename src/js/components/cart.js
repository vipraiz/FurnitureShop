let totalPrice = 0;

function addToCart(productBtn, productId) {
  if (!productBtn.disabled) {
    productBtn.setAttribute('disabled', 'disabled');
    productBtn.classList.add('_fly');

    const cart = document.querySelector('.cart-header__icon');
    const product = document.querySelector(`[data-pid="${productId}"]`);
    const productImage = product.querySelector('.item-product__image');

    const productImageFly = productImage.cloneNode(true);
    productImageFly.setAttribute('class', '_flyImage _ibg');
    productImageFly.style.cssText = `
      left: ${productImage.getBoundingClientRect().left}px;
      top: ${productImage.getBoundingClientRect().top}px;
      width: ${productImage.offsetWidth}px;
      height: ${productImage.offsetHeight}px;
    `;

    document.body.append(productImageFly);

    productImageFly.style.cssText = `
      left: ${cart.getBoundingClientRect().left}px;
      top: ${cart.getBoundingClientRect().top}px;
      width: 0px;
      height: 0px;
      opacity: 0;
    `;

    productImageFly.addEventListener('transitionend', () => {
      if (productBtn.classList.contains('_fly')) {
        productImageFly.remove();
        updateCart(productBtn, productId);
        productBtn.classList.remove('_fly');
      }
    });
  }
}

function updateCart(productBtn, productId, productAdd = true) {
  const cart = document.querySelector('.cart-header');
  const cartIcon = cart.querySelector('.cart-header__icon');
  const cartQuantity = cartIcon.querySelector('span');
  const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
  const cartList = cart.querySelector('.cart-header__list');
  const cartTotalPrice = cart.querySelector('.cart-header__total-price span');

  if (productAdd) {
    if (cartQuantity) {
      cartQuantity.innerHTML = ++cartQuantity.innerHTML;
    } else {
      cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
    }

    const product = document.querySelector(`[data-pid="${productId}"]`);
    const cartProductPrice = product.querySelector('.item-product__price');
    const cartProductPriceValue = parseInt(
      cartProductPrice.querySelector('span').textContent.replace(/\./g, '')
    );

    if (!cartProduct) {
      const cartProductImage = product.querySelector(
        '.item-product__image'
      ).innerHTML;
      const productLink = product
        .querySelector('.item-product__image')
        .getAttribute('href');
      const cartProductTitle = product.querySelector(
        '.item-product__title'
      ).textContent;

      cartList.insertAdjacentHTML(
        'beforeend',
        `
        <li data-cart-pid="${productId}" class="cart-list__item">
          <a href="${productLink}" class="cart-list__image _ibg" tabindex="-1">
            ${cartProductImage}
          </a>
          <div class="cart-list__body">
            <a href="${productLink}" class="cart-list__title">${cartProductTitle}</a>
            <div class="cart-list__quantity">
              Quantity: <span>1</span>
            </div>
            <div class="cart-list__price">
              Price: <span>${cartProductPrice.textContent}</span>
            </div>
            <button class="cart-list__delete btn-reset">Delete</button>
          </div>
        </li>
        `
      );
    } else {
      const cartProductQuantity = cartProduct.querySelector(
        '.cart-list__quantity span'
      );
      cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;

      //////////////////////shit-code///////////////////////////////
      const price = cartProduct.querySelector('.cart-list__price span');
      price.innerHTML = `Rp ${(
        cartProductQuantity.innerHTML * cartProductPriceValue
      ).toLocaleString('de-DE')}`;
      //////////////////////shit-code///////////////////////////////
    }

    totalPrice += cartProductPriceValue;

    productBtn.removeAttribute('disabled');
    cartIcon.removeAttribute('disabled');
  } else {
    const cartProductQuantity = cartProduct.querySelector(
      '.cart-list__quantity span'
    );
    cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
    if (!parseInt(cartProductQuantity.innerHTML)) {
      cartProduct.remove();
    }

    const quantity = --cartQuantity.innerHTML;

    //////////////////////shit-code///////////////////////////////
    const price = cartProduct.querySelector('.cart-list__price span');
    const arr = price.innerHTML.split(' ');
    const value = parseInt(
      arr[arr.length - 1].replace(/\./g, '') /
        (parseInt(cartProductQuantity.innerHTML) + 1)
    );
    price.innerHTML = `Rp ${(
      parseInt(cartProductQuantity.innerHTML) * value
    ).toLocaleString('de-DE')}`;

    totalPrice -= value;
    //////////////////////shit-code///////////////////////////////

    if (quantity > 0) {
      cartQuantity.innerHTML = quantity;
    } else {
      cartQuantity.remove();
      cart.classList.remove('_active');
      cartIcon.setAttribute('disabled', 'disabled');
    }
  }
  cartTotalPrice.textContent = `Rp ${totalPrice.toLocaleString('de-DE')}`;
}
