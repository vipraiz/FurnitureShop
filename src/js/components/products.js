const productsToShow = 4;
const shownProductsIds = [];

getProducts();
function getProducts(btn = null) {
  if (btn) {
    if (btn.disabled) {
      return;
    } else {
      btn.setAttribute('disabled', 'disabled');
    }
  }

  fetch('data/products.json', {
    method: 'GET',
  }).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        if (btn) {
          btn.removeAttribute('disabled');
        }
        if (shownProductsIds.length + productsToShow >= data.products.length) {
          loadProducts(data, data.products.length - shownProductsIds.length);
          document.querySelector('.products__footer').remove();
        } else {
          loadProducts(data, productsToShow);
        }
      });
    } else {
      alert(`products can't be loaded :(`);
    }
  });
}

function loadProducts(data, quantity) {
  const productsItems = document.querySelector('.products__items');
  const imagesLocation = data.settings.imagesLocation;

  data.products.every((item) => {
    if (shownProductsIds.indexOf(item.id) !== -1) {
      return true;
    } else {
      shownProductsIds.push(item.id);
    }

    let labels = '';
    if (item.labels) {
      labels += `<div class="item-product__labels">`;
      item.labels.forEach((label) => {
        labels += `
                  <div class="item-product__label item-product__label_${label.type}">
                    ${label.value}
                  </div>
        `;
      });
      labels += '</div>';
    }

    let priceOld = '';
    if (item.priceOld) {
      priceOld = `
                <div class="item-product__price item-product__price_old">
                  ${item.currency} <span>${item.priceOld}</span>
                </div>
      `;
    }

    productsItems.insertAdjacentHTML(
      `beforeend`,
      `
        <article data-pid="${item.id}" class="products__item item-product">
          ${labels}
          <a tabindex="-1" href="${item.url}" class="item-product__image _ibg">
            <img src="${imagesLocation + item.image}" 
            alt="${item.title}" />
          </a>
          <div class="item-product__body">
            <div class="item-product__content">
              <a href="${item.url}" class="item-product__title">
              ${item.title}</a>
              <div class="item-product__text">${item.text}</div>
            </div>
            <div class="item-product__prices">
              <div class="item-product__price">${item.currency} 
              <span>${item.price}</span></div>
              ${priceOld}
            </div>
            <div class="item-product__actions actions-product">
              <div class="actions-product__body">
                <button
                  class="btn-reset actions-product__btn btn btn_white"
                >
                  Add to cart
                </button>
                <a
                  href="${item.shareUrl}"
                  class="
                    actions-product__link actions-product__link_share
                  "
                >
                  <svg aria-hidden="true">
                    <use href="img/sprite.svg#share"></use>
                  </svg>
                  Share
                </a>
                <a
                  href="${item.likeUrl}"
                  class="actions-product__link actions-product__link_like"
                >
                  <svg aria-hidden="true">
                    <use href="img/sprite.svg#favorite"></use>
                  </svg>
                  Like
                </a>
              </div>
            </div>
          </div>
        </article>
    `
    );

    const actionsProductBody = productsItems.querySelector(
      `[data-pid="${item.id}"] .actions-product__body`
    );

    Array.from(actionsProductBody.children).forEach((el) => {
      el.addEventListener(
        'focus',
        () => {
          el.closest('.item-product__actions').classList.add(
            'item-product__actions_active'
          );
        },
        true
      );
      el.addEventListener(
        'blur',
        () => {
          el.closest('.item-product__actions').classList.remove(
            'item-product__actions_active'
          );
        },
        true
      );
    });

    quantity--;
    return quantity > 0;
  });
}
