import './style.css';
import Bento from './bento/bento';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
(CSS as any).paintWorklet.addModule(
	'https://www.unpkg.com/css-houdini-squircle/squircle.min.js'
);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="grid">
	<div class="item" data-min-width="5" data-min-height="2">Item 1</div>
	<div class="item" data-min-width="5" data-min-height="3">Item 2</div>
	<div class="item" data-min-width="6" data-min-height="3">Item 3</div>
	<div class="item" data-min-width="4" data-min-height="3">Item 4</div>
	
	<div class="item" data-min-width="5" data-min-height="5">Item 5</div>
	<div class="item" data-min-width="10" data-min-height="6">Item 6</div>
	<div class="item" data-min-width="5" data-min-height="5">Item 7</div>

	<div class="item" data-min-width="3" data-min-height="5">Item 8</div>
	<div class="item" data-min-width="2" data-min-height="2">Item 9</div>
	<div class="item" data-min-width="3" data-min-height="4">Item 13</div>
	<div class="item" data-min-width="2" data-min-height="4">Item 14</div>
	<div class="item" data-min-width="4" data-min-height="3">Item 10</div>
	<div class="item" data-min-width="3" data-min-height="3">Item 11</div>
	<div class="item" data-min-width="5" data-min-height="3">Item 12</div>


</div>
`;

const bento = new Bento({
	gridElement: document.querySelector<HTMLElement>('#grid')!,
});

window.addEventListener('resize', () => {
	bento.setLayout();
});

// <div class="item" data-min-width="2" data-min-height="4">Item 0</div>
// <div class="item" data-min-width="6" data-min-height="4">Item 1</div>
// <div class="item" data-min-width="1" data-min-height="2">Item 2</div>
// <div class="item" data-min-width="2" data-min-height="2">Item 3</div>
// <div class="item" data-min-width="1" data-min-height="4">Item 4</div>
// <div class="item" data-min-width="2" data-min-height="2">Item 5</div>
// <div class="item" data-min-width="6" data-min-height="4">Item 6</div>
// <div class="item" data-min-width="2" data-min-height="1">Item 7</div>
// <div class="item" data-min-width="3" data-min-height="1">Item 8</div>
// <div class="item" data-min-width="4" data-min-height="1">Item 9</div>
// <div class="item" data-min-width="1" data-min-height="1">Item 10</div>
// <div class="item" data-min-width="1" data-min-height="1">Item 11</div>
// <div class="item" data-min-width="1" data-min-height="1">Item 12</div>
