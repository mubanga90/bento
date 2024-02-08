import type { GridItem, GridSize, BentoOptions } from './types';
import { getItems, getGridSize } from './utils';

class Bento {
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
		this.items = getItems(this.gridElement);
		this.gridSize = getGridSize(
			this.gridElement,
			this.preferredCellWidth,
			this.preferredCellHeight
		);

		this.gridElement.style.gridTemplateColumns = `repeat(${this.gridSize.columns}, 1fr)`;

		this.grid = Array.from<number[]>({ length: this.gridSize.rows }).map(() =>
			Array.from<number>({ length: this.gridSize.columns }).fill(-1)
		);

		itemLoop: for (const item of this.items) {
			let placed = false;
			for (let y = 0; y < this.gridSize.rows; y++) {
				for (let x = 0; x < this.gridSize.columns; x++) {
					if (this.checkPlacement(x, y, item)) {
						this.placeItem(x, y, item);
						item.x = x;
						item.y = y;
						this.setItemStyle(item);
						placed = true;
						continue itemLoop;
					}
				}
			}

			if (!placed) {
				console.error('Could not place item', item.index);
				item.element.style.display = 'none';
			}
		}

		this.debugGrid();
		this.stretchToFill();

		// This.fillEmpty();
	};

	checkPlacement = (
		x: number,
		y: number,
		item: GridItem,
		debug = false
	): boolean => {
		// Check if x or y is out of bounds
		if (x < 0 || y < 0 || y >= this.grid.length || x >= this.grid[0].length) {
			if (debug) console.log('Out of bounds');
			return false;
		}

		// Check if the cell at grid[x][y] is true
		if (this.grid[y][x] !== -1) {
			if (debug) console.log('Is filled');
			return false;
		}

		// Check the cells the item is trying to occupy
		for (let row = y; row < y + item.minHeight; row++) {
			for (let column = x; column < x + item.minWidth; column++) {
				// Check if the cell is out of bounds
				if (column >= this.grid[0].length || row >= this.grid.length) {
					if (debug) console.log('Cell is out of bounds', column, row);
					return false;
				}

				// Check if the cell is true
				if (this.grid[row][column] !== -1) {
					if (debug) console.log('Cell is filled', column, row);
					return false;
				}
			}
		}

		// If none of the cells are true or out of bounds, return true
		return true;
	};

	placeItem = (x: number, y: number, item: GridItem) => {
		for (let row = y; row < y + (item.actualHeight ?? item.minHeight); row++) {
			for (
				let column = x;
				column < x + (item.actualWidth ?? item.minWidth);
				column++
			) {
				this.grid[row][column] = item.index;
			}
		}
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

			console.log('--------------------');
			for (const item of itemsToStretch) {
				console.log(
					'Stretch item:',
					item.index,
					'to',
					item.actualWidth,
					item.actualHeight,
					'neighbors right:',
					item.emptyNeighborsRight,
					'neighbors bottom:',
					item.emptyNeighborsBottom,
					'neighbors total:',
					item.emptyNeighborsRight! + item.emptyNeighborsBottom!
				);
			}

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

				this.placeItem(item.x!, item.y!, item);
				this.setItemStyle(item);

				this.debugGrid();
			}
		}
	};

	debugGrid = () => {
		console.log(
			this.grid
				.map((row) =>
					row
						.map((cell) => (cell === -1 ? '.  ' : String(cell).padEnd(3, ' ')))
						.join(' ')
				)
				.join('\n')
		);
	};

	fillEmpty = () => {
		for (let y = 0; y < this.gridSize.rows; y++) {
			for (let x = 0; x < this.gridSize.columns; x++) {
				if (this.grid[y][x] === -1) {
					const filler = document.createElement('div');
					filler.classList.add('filler');
					filler.style.gridColumnStart = `${x + 1}`;
					filler.style.gridColumnEnd = `${x + 2}`;
					filler.style.gridRowStart = `${y + 1}`;
					filler.style.gridRowEnd = `${y + 2}`;
					this.gridElement.append(filler);
				}
			}
		}
	};

	setItemStyle = (item: GridItem) => {
		item.element.style.removeProperty('display');
		item.element.style.gridColumnStart = `${item.x! + 1}`;
		item.element.style.gridColumnEnd = `${item.x! + (item.actualWidth ?? item.minWidth) + 1}`;
		item.element.style.gridRowStart = `${item.y! + 1}`;
		item.element.style.gridRowEnd = `${item.y! + (item.actualHeight ?? item.minHeight) + 1}`;
	};
}

export default Bento;
