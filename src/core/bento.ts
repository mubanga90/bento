import { calculateGridSize } from '../helpers/calculate-grid-size';
import type BentoOptions from '../types/bento-options';
import type GridItem from './grid-item';
import Grid from './grid';
import DomHandler from './dom';

class Bento {
	grid: Grid = new Grid();
	dom: DomHandler = new DomHandler();

	gridElement?: HTMLElement | undefined;
	preferredCellWidth: number;
	preferredCellHeight: number;

	constructor(gridElement: HTMLElement, options: BentoOptions = {}) {
		this.gridElement = gridElement;
		this.dom.setGridElement(gridElement);
		this.preferredCellWidth = options.preferredCellWidth ?? 120;
		this.preferredCellHeight = options.preferredCellHeight ?? 115;
		this.setLayout();
		window.addEventListener('resize', this.setLayout);
	}

	setLayout = () => {
		const items: GridItem[] = this.dom.getItems();
		const gridSize = calculateGridSize(
			this.gridElement!,
			this.preferredCellWidth,
			this.preferredCellHeight
		);
		this.dom.setupGrid(gridSize);
		this.grid.createGrid(gridSize);
		this.grid.populateGrid(items);
		this.grid.fillGrid();
		this.dom.setItemStyles(items);
	};
}

export default Bento;
