if (document.querySelector('.slider-main__body')) {
  const slider = new Swiper('.slider-main__body', {
    observer: true,
    observeParents: true,
    spaceBetween: 32,
    watchOverflow: true,
    speed: 800,
    loop: true,
    loopAdditionalSlides: 5,
    preloadImages: false,
    parallax: true,
    pagination: {
      el: '.controls-slider-main__dots',
      clickable: true,
    },
    navigation: {
      prevEl: '.slider-main .slider-arrow_prev',
      nextEl: '.slider-main .slider-arrow_next',
    },
  });

  focusContent();
  function focusContent() {
    document.querySelectorAll('.slider-main__content').forEach((el) => {
      if (!el.closest('.swiper-slide-active')) {
        el.setAttribute('tabindex', '-1');
      } else {
        el.removeAttribute('tabindex');
      }
    });
  }

  slider.on('slideChangeTransitionStart', () => {
    focusContent();
  });
}

if (document.querySelector('.slider-rooms__body')) {
  const slider = new Swiper('.slider-rooms__body', {
    observer: true,
    observeParents: true,
    spaceBetween: 24,
    watchOverflow: true,
    slidesPerView: 'auto',
    speed: 800,
    loop: true,
    loopAdditionalSlides: 5,
    preloadImages: false,
    parallax: true,
    pagination: {
      el: '.slider-rooms__dots',
      clickable: true,
    },
    navigation: {
      prevEl: '.slider-rooms .slider-arrow_prev',
      nextEl: '.slider-rooms .slider-arrow_next',
    },
  });

  focusContent();
  function focusContent() {
    document.querySelectorAll('.slider-rooms__content').forEach((el) => {
      if (!el.closest('.swiper-slide-active')) {
        el.setAttribute('tabindex', '-1');
      } else {
        el.removeAttribute('tabindex');
      }
    });
  }

  slider.on('slideChangeTransitionStart', () => {
    focusContent();
  });
}

if (document.querySelector('.slider-tips__body')) {
  const slider = new Swiper('.slider-tips__body', {
    observer: true,
    observeParents: true,
    watchOverflow: true,
    speed: 800,
    loop: true,
    preloadImages: false,
    pagination: {
      el: '.slider-tips__dots',
      clickable: true,
    },
    navigation: {
      prevEl: '.slider-tips .slider-arrow_prev',
      nextEl: '.slider-tips .slider-arrow_next',
    },

    breakpoints: {
      320: {
        slidesPerView: 1.1,
        spaceBetween: 15,
      },
      600: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });
}
