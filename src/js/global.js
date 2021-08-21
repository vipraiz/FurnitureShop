document.documentElement.style.setProperty(
  '--vh',
  `${window.innerHeight * 0.01}px`
);

const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};

let ua = window.navigator.userAgent;
let msie = ua.indexOf('MSIE ');

function isIE() {
  ua = navigator.userAgent;
  return ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
}

if (isIE()) {
  document.querySelector('html').classList.add('ie');
}
if (isMobile.any()) {
  document.querySelector('html').classList.add('_touch');
}

function ibg() {
  if (isIE()) {
    document.querySelectorAll('._ibg').forEach((el) => {
      if (el.querySelector('img')) {
        el.style.backgroundImage =
          'url(' + el.querySelector('img').getAttribute('src') + ')';
      }
    });
  }
}
ibg();
