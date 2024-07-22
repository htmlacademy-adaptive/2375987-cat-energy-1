const slider = document.querySelector('.slider');
const slider__input = document.querySelector('.slider__input');
document.addEventListener('input', (e) => {
  slider.style.setProperty('--position', slider__input.value + '%');
});
