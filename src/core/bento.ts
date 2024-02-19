import { calculateGridSize } from '../helpers/calculate-grid-size';
import type BentoOptions from '../types/bento-options';
import type GridItem from './grid-item';
import Grid from './grid';
import DomHandler from './dom';

class Bento {
	grid: Grid = new Grid();
	dom: DomHandler = new DomHandler();

	gridElement?: HTMLElement | undefined;
	preferredCellSize = { x: 120, y: 115 };

	constructor(gridElement: HTMLElement, options: BentoOptions = {}) {
		this.gridElement = gridElement;
		this.dom.setGridElement(gridElement);
		this.preferredCellSize = options?.preferredCellSize ?? { x: 120, y: 115 };
		this.setLayout();
		window.addEventListener('resize', this.setLayout);
	}

	setLayout = () => {
		const items: GridItem[] = this.dom.getItems();
		const gridSize = calculateGridSize(
			this.gridElement!,
			this.preferredCellSize
		);
		this.dom.setupGrid(gridSize);
		this.grid.createGrid(gridSize);
		this.grid.populateGrid(items);
		this.grid.fillGrid();
		this.dom.setItemStyles(items);
	};
}

export default Bento;
