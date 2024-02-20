import Bento from '../core/bento';
import './style.css';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
(CSS as any).paintWorklet.addModule(
	'https://www.unpkg.com/css-houdini-squircle/squircle.min.js'
);

const bentoOptions = {
	preferredCellSize: { x: 120, y: 115 },
};

// @ts-expect-error - bentoInstance is not used
const bentoInstance = new Bento(
	document.querySelector<HTMLElement>('#grid')!,
	bentoOptions
);
