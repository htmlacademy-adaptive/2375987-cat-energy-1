const slider = document.querySelector('.slider');
const imgBefore = document.querySelector('.slider_img--before');
const imgAfter = document.querySelector('.slider_img--after');
const button = document.querySelector('.slider_toggles');
let w = 280
if (window.innerWidth > 768) {
  w = 560
}
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    w = 560
  }
});
const moveButton = (e) => {
  const sliderP = slider.getBoundingClientRect();
  let xSlider = sliderP.left
  let xMouse = e.pageX;
  let x = xMouse - xSlider;

  if (xSlider >= xMouse) {
    return;
  }

  if (xMouse >= (xSlider + w)) {
    return;
  }

  button.style.left = `${x - 20}px`;
  imgBefore.style.width = `${x}px`;
  imgAfter.style.width = `${w - x}px`;
}

const move = () => {
  document.addEventListener('mousemove', moveButton, true);
}

button.addEventListener('mousedown', move, true);

button.addEventListener('mouseup', () => {
  document.removeEventListener('mousemove', moveButton, true);
});

window.addEventListener('resize', () => {
  console.log(window.innerWidth);
});
