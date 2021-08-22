/*
Родителю спойрелов добавляем атрибут data-spoilers
Для заголовков спойлеров добавляем атрибут data-spoiler

data-spoilers:
data-spoilers - спойлеры будут работать всегда
data-spoilers="768,min" - спойлеры будут работать только на экранах 768px и выше
data-spoilers="992,max" - спойлеры будут работать только на экранах 992px и ниже

Чтобы открывался только один спойлер, добавляем атрибут data-one-spoiler
*/

///////////////////////////////////////////////////////////////////

const spoilersArray = document.querySelectorAll('[data-spoilers]');

if (spoilersArray.length > 0) {
  const spoilersRegular = Array.from(spoilersArray).filter((item) => {
    return !item.dataset.spoilers.split(',')[0];
  });

  if (spoilersRegular.length > 0) {
    initSpoilers(spoilersRegular);
  }

  const spoilersMedia = Array.from(spoilersArray).filter((item) => {
    return item.dataset.spoilers.split(',')[0];
  });

  if (spoilersMedia.length > 0) {
    const breakpointsArray = [];
    spoilersMedia.forEach((item) => {
      const params = item.dataset.spoilers;
      const breakpoint = {};
      const paramsArray = params.split(',');
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });

    let mediaQueries = breakpointsArray.map((item) => {
      return (
        '(' +
        item.type +
        '-width: ' +
        item.value +
        'px),' +
        item.value +
        ',' +
        item.type
      );
    });
    mediaQueries = mediaQueries.filter((item, index, self) => {
      return self.indexOf(item) === index;
    });

    mediaQueries.forEach((breakpoint) => {
      const paramsArray = breakpoint.split(',');
      const mediaBreakpoint = paramsArray[1];
      const mediaType = paramsArray[2];
      const matchMedia = window.matchMedia(paramsArray[0]);

      const spoilersArray = breakpointsArray.filter((item) => {
        return item.value === mediaBreakpoint && item.type === mediaType;
      });

      matchMedia.addEventListener('change', () => {
        initSpoilers(spoilersArray, matchMedia);
      });
      initSpoilers(spoilersArray, matchMedia);
    });
  }

  function initSpoilers(spoilersArray, matchMedia = false) {
    spoilersArray.forEach((el) => {
      el = matchMedia ? el.item : el;
      if (matchMedia.matches || !matchMedia) {
        el.classList.add('_init');
        initSpoilerBody(el);
        el.addEventListener('click', setSpoilerAction);
      } else {
        el.classList.remove('_init');
        initSpoilerBody(el, false);
        el.removeEventListener('click', setSpoilerAction);
      }
    });
  }

  function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
    const spoilerTitles = spoilersBlock.querySelectorAll('[data-spoiler]');
    if (spoilerTitles.length > 0) {
      spoilerTitles.forEach((spoilerTitle) => {
        if (hideSpoilerBody) {
          spoilerTitle.removeAttribute('tabindex');
          if (!spoilerTitle.classList.contains('_active')) {
            // spoilerTitle.setAttribute('aria-expanded', false);
            // spoilerTitle.nextElementSibling.setAttribute('aria-hidden', true);
            spoilerTitle.nextElementSibling.hidden = true;
          }
        } else {
          if (!spoilerTitle.hasAttribute('data-tab-spoiler'))
            spoilerTitle.setAttribute('tabindex', '-1');
          // spoilerTitle.setAttribute('aria-expanded', true);
          // spoilerTitle.nextElementSibling.setAttribute('aria-hidden', false);
          spoilerTitle.nextElementSibling.hidden = false;
        }
      });
    }
  }

  function setSpoilerAction(e) {
    const el = e.target;
    if (el.hasAttribute('data-spoiler') || el.closest('[data-spoiler]')) {
      const spoilerTitle = el.hasAttribute('data-spoiler')
        ? el
        : el.closest('[data-spoiler]');
      const spoilerBlock = spoilerTitle.closest('[data-spoilers]');
      const oneSpoiler = spoilerBlock.hasAttribute('data-one-spoiler');

      if (!spoilerBlock.querySelectorAll('._slide').length) {
        if (oneSpoiler && !spoilerTitle.classList.contains('_active')) {
          hideSpoilersBody(spoilerBlock);
        }
        spoilerTitle.classList.toggle('_active');
        // if (spoilerTitle.classList.contains('_active')) {
        //   spoilerTitle.setAttribute('aria-expanded', false);
        //   spoilerTitle.nextElementSibling.setAttribute('aria-hidden', true);
        //   spoilerTitle.classList.remove('_active');
        // } else {
        //   spoilerTitle.setAttribute('aria-expanded', true);
        //   spoilerTitle.nextElementSibling.setAttribute('aria-hidden', false);
        //   spoilerTitle.classList.add('_active');
        // }
        _slideToggle(spoilerTitle.nextElementSibling, 500);
      }
      e.preventDefault();
    }
  }

  function hideSpoilersBody(spoilersBlock) {
    const spoilerActiveTitle = spoilersBlock.querySelector(
      '[data-spoiler]._active'
    );
    if (spoilerActiveTitle) {
      spoilerActiveTitle.classList.remove('_active');
      _slideUp(spoilerActiveTitle.nextElementSibling, 500);
    }
  }

  const _slideUp = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
        target.hidden = true;
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target.classList.remove('_slide');
      }, duration);
    }
  };

  const _slideDown = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      if (target.hidden) {
        target.hidden = false;
      }
      const height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target.classList.remove('_slide');
      }, duration);
    }
  };

  const _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
      return _slideDown(target, duration);
    } else {
      return _slideUp(target, duration);
    }
  };
}
