import Bento from './bento.js';

const bentoOptions = {
    preferredCellSize: { x: 47, y: 33 },
};

const gridElement = document.querySelector('#grid');
const containerElement = gridElement.parentElement;
const _bentoInstance = new Bento(gridElement, bentoOptions);

containerElement.addEventListener("mousemove", () => {
    if ((containerElement.w && containerElement.w !== containerElement.offsetWidth) || (gridElement.h && gridElement.h !== gridElement.offsetHeight)) {
        _bentoInstance.setLayout();
    }
    containerElement.w = containerElement.offsetWidth;
    containerElement.h = containerElement.offsetHeight;
});