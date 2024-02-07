import './style.css';
import Bento from './bento/bento';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="grid">
  <div class="item" data-min-width="2" data-min-height="4">Item 0</div>
  <div class="item" data-min-width="6" data-min-height="4">Item 1</div>
  <div class="item" data-min-width="1" data-min-height="1">Item 2</div>
  <div class="item" data-min-width="1" data-min-height="2">Item 3</div>
  <div class="item" data-min-width="1" data-min-height="4">Item 4</div>
  <div class="item" data-min-width="1" data-min-height="4">Item 5</div>
  <div class="item" data-min-width="6" data-min-height="4">Item 6</div>
  <div class="item" data-min-width="1" data-min-height="1">Item 7</div>
  <div class="item" data-min-width="1" data-min-height="1">Item 8</div>
</div>
`;

const bento = new Bento({
	gridElement: document.querySelector<HTMLElement>('#grid')!,
});

window.addEventListener('resize', () => {
	bento.setLayout();
});
