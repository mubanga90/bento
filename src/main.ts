import './style.css';
import Bento from './core/bento';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
(CSS as any).paintWorklet.addModule(
	'https://www.unpkg.com/css-houdini-squircle/squircle.min.js'
);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="grid">
	<div class="item" data-min-width="5" data-min-height="2">Item 0</div>
	<div class="item" data-min-width="5" data-min-height="3">Item 1</div>
	<div class="item" data-min-width="6" data-min-height="3">Item 2</div>
	<div class="item" data-min-width="4" data-min-height="3">Item 3</div>
	
	<div class="item" data-min-width="5" data-min-height="5">Item 4</div>
	<div class="item" data-min-width="10" data-min-height="6">Item 5</div>
	<div class="item" data-min-width="5" data-min-height="5">Item 6</div>

	<div class="item" data-min-width="3" data-min-height="5">Item 7</div>
	<div class="item" data-min-width="2" data-min-height="2">Item 8</div>
	<div class="item" data-min-width="3" data-min-height="4">Item 9</div>
	<div class="item" data-min-width="2" data-min-height="4">Item 10</div>
	<div class="item" data-min-width="4" data-min-height="3">Item 11</div>
	<div class="item" data-min-width="3" data-min-height="3">Item 12</div>
	<div class="item" data-min-width="5" data-min-height="3">Item 13</div>
</div>
`;

const bentoOptions = {
	preferredCellWidth: 120,
	preferredCellHeight: 115,
};

// @ts-expect-error - bento should probably be static?
const bento = new Bento(
	document.querySelector<HTMLElement>('#grid')!,
	bentoOptions
);

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
