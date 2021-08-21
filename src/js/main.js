/**
 * название функции
 *
 * @param {number} first - первое число
 * @returns {number}
 */

const observer = lozad('.lozad', {
  rootMargin: '50% 0px',
});
observer.observe();

document.querySelector('.burger').addEventListener('click', (e) => {
  e.currentTarget.classList.toggle('burger_active');
  document.body.classList.toggle('_lock');

  const nav = document.querySelector('.nav');
  if (nav) {
    nav.classList.toggle('_active');
  }
});
