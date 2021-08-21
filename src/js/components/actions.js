window.onload = () => {
  document.addEventListener('click', documentActions);

  // Actions (делегирование события click)

  function documentActions(e) {
    const targetElement = e.target;

    if (window.innerWidth > 768 && isMobile.any()) {
      if (targetElement.classList.contains('nav__arrow')) {
        targetElement.closest('.nav__item').classList.toggle('_hover');
      } else if (!targetElement.closest('.nav__item')) {
        document.querySelectorAll('.nav__item._hover').forEach((el) => {
          el.classList.remove('_hover');
        });
      }
    }

    const searchForm = document.querySelector('.search-form');
    if (targetElement.classList.contains('search-form__icon')) {
      searchForm.classList.toggle('_active');
    } else if (
      !targetElement.closest('.search-form') &&
      document.querySelector('.search-form._active')
    ) {
      searchForm.classList.remove('_active');
    }

    if (targetElement.classList.contains('products__more')) {
      getProducts(targetElement);
    }

    if (targetElement.classList.contains('actions-product__btn')) {
      const productId = targetElement.closest('.item-product').dataset.pid;
      addToCart(targetElement, productId);
    }

    if (targetElement.classList.contains('cart-header__icon')) {
      if (document.querySelector('.cart-list').children.length > 0) {
        document.querySelector('.cart-header').classList.toggle('_active');
      }
    } else if (
      !targetElement.closest('.cart-header') &&
      !targetElement.classList.contains('actions-product__btn')
    ) {
      document.querySelector('.cart-header').classList.remove('_active');
    }

    if (targetElement.classList.contains('cart-list__delete')) {
      updateCart(
        targetElement,
        targetElement.closest('.cart-list__item').dataset.cartPid,
        false
      );
    }
  }

  //header

  const headerElement = document.querySelector('.header');
  const callback = (entries) => {
    if (entries[0].isIntersecting) {
      headerElement.classList.remove('_scroll');
    } else {
      headerElement.classList.add('_scroll');
    }
  };

  new IntersectionObserver(callback).observe(headerElement);

  // Gallery

  lightGallery(document.querySelector('.furniture__items'), {
    selector: 'a',
    download: false,
  });

  const furniture = document.querySelector('.furniture__body');

  if (furniture && !isMobile.any()) {
    const furnitureItems = document.querySelector('.furniture__items');
    const furnitureColumns = document.querySelectorAll('.furniture__column');
    const lgContainer = document.querySelector('.lg-container  ');

    const speed = furniture.dataset.speed / 100;

    let positionX = 0;
    let coordXprocent = 0;

    function setMouseGalleryStyle() {
      let furnitureItemsWidth = 0;
      furnitureColumns.forEach((column) => {
        furnitureItemsWidth += column.offsetWidth;
      });

      const furnitureDifference = furnitureItemsWidth - furniture.offsetWidth;
      const distX = Math.floor(coordXprocent - positionX);

      positionX = positionX + distX * speed;
      let position = (furnitureDifference / 200) * positionX;

      furnitureItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;

      if (Math.abs(distX) > 0 && !lgContainer.classList.contains('lg-show')) {
        requestAnimationFrame(setMouseGalleryStyle);
      } else {
        furniture.classList.remove('_init');
      }
    }

    furniture.addEventListener('mousemove', (e) => {
      coordXprocent =
        ((e.pageX - furniture.offsetWidth / 2) / furniture.offsetWidth) * 200;

      if (!furniture.classList.contains('_init')) {
        requestAnimationFrame(setMouseGalleryStyle);
        furniture.classList.add('_init');
      }
    });
  }
};
