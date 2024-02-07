import './style.css';
import Bento from './bento/bento';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="grid">
  <div class="item" data-min-width="1" data-min-height="1">Item 1</div>
  <div class="item" data-min-width="2" data-min-height="1">Item 2</div>
  <div class="item" data-min-width="1" data-min-height="2">Item 3</div>
  <div class="item" data-min-width="1" data-min-height="1">Item 4</div>
</div>
`;

const bento = new Bento({
	gridElement: document.querySelector<HTMLElement>('#grid')!,
});
