const slider = document.querySelector('.slider');
const img = document.querySelector('.slider_img--after');
const button = document.querySelector('.slider_toggles');

const moveButton = (e) => {
	const sliderP = slider.getBoundingClientRect();
	let xSlider = sliderP.left
	let xMouse = e.pageX;
	let x = xMouse - xSlider;

	if (xSlider >= xMouse) {
		return;
	}

	if (xMouse >= (xSlider + 258)) {
		return;
	}

	button.style.left = `${x}px`;
	img.style.width = `${258 - x}px`;
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
