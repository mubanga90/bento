import { getItems, fillEmpty, setItemStyle } from './dom';
import { debugGrid, getGridSize, createGrid, populateGrid } from './grid';
import { assignItemToCells } from './item';
import type { GridItem, GridSize, BentoOptions } from './types';

export default class Bento {
	gridElement = document.querySelector<HTMLElement>('#bento-grid')!;
	preferredCellWidth = 100;
	preferredCellHeight = 100;

	items: GridItem[] = [];
	gridSize: GridSize = {
		width: 0,
		height: 0,
		columns: 0,
		rows: 0,
	};

	grid: number[][] = [];

	constructor(options: BentoOptions) {
		this.gridElement = options.gridElement;
		this.preferredCellWidth = options.preferredCellWidth ?? 100;
		this.preferredCellHeight = options.preferredCellHeight ?? 100;

		this.setLayout();
	}

	setLayout = () => {
		this.setupGrid();
		this.items = getItems(this.gridElement);
		populateGrid(this.items, this.grid, this.gridSize);
		debugGrid(this.grid);
		this.stretchToFill();
		fillEmpty(this.grid, this.gridElement, this.gridSize);
	};

	setupGrid = () => {
		this.gridSize = getGridSize(
			this.gridElement,
			this.preferredCellWidth,
			this.preferredCellHeight
		);
		this.gridElement.style.gridTemplateColumns = `repeat(${this.gridSize.columns}, 1fr)`;
		this.grid = createGrid(this.gridSize.rows, this.gridSize.columns);
	};

	stretchToFill = () => {
		let itemsToStretch = this.items;
		while (itemsToStretch.length > 0) {
			for (const item of itemsToStretch) {
				if (item.x === undefined || item.y === undefined) continue;

				item.actualWidth ??= item.minWidth;
				item.actualHeight ??= item.minHeight;
				item.emptyNeighborsRight = 0;
				item.emptyNeighborsBottom = 0;

				if (item.x + item.actualWidth < this.gridSize.columns) {
					let canStretch = true;
					for (let y = item.y; y < item.y + item.actualHeight; y++) {
						if (this.grid[y][item.x + item.actualWidth] !== -1) {
							canStretch = false;
							break;
						}
					}

					if (canStretch) {
						item.emptyNeighborsRight += item.actualHeight;
					}
				}

				if (item.y + item.actualHeight < this.gridSize.rows) {
					let canStretch = true;
					for (let x = item.x; x < item.x + item.actualWidth; x++) {
						if (this.grid[item.y + item.actualHeight][x] !== -1) {
							canStretch = false;
							break;
						}
					}

					if (canStretch) {
						item.emptyNeighborsBottom += item.actualWidth;
					}
				}
			}

			itemsToStretch = this.items
				.filter(
					(item) => item.emptyNeighborsRight! + item.emptyNeighborsBottom! > 0
				)
				.sort(
					(a, b) =>
						b.emptyNeighborsRight! +
						b.emptyNeighborsBottom! -
						(a.emptyNeighborsRight! + a.emptyNeighborsBottom!)
				);

			if (itemsToStretch.length === 0) break;

			const item = itemsToStretch[0];

			if (item) {
				console.log('Stretching item', item.index);
				if (
					item.emptyNeighborsRight! > item.emptyNeighborsBottom! ||
					(item.emptyNeighborsRight === item.emptyNeighborsBottom &&
						item.index % 2 === 0)
				) {
					item.actualWidth!++;
					console.log('Stretching right');
				} else {
					item.actualHeight!++;
					console.log('Stretching down');
				}

				assignItemToCells(this.grid, item.x!, item.y!, item);
				setItemStyle(item);

				debugGrid(this.grid);
			}
		}
	};
}
