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
			for (let y = 0; y < this.gridSize.rows; y++) {
				for (let x = 0; x < this.gridSize.columns; x++) {
					if (item.index === 7) {
						console.log(x, y, this.grid[y][x]);
					}

					if (this.checkPlacement(x, y, item)) {
						this.placeItem(x, y, item);
						item.x = x;
						item.y = y;
						this.setItemStyle(item);
						continue itemLoop;
					}
				}
			}
		}
	};

	checkPlacement = (x: number, y: number, item: GridItem): boolean => {
		// Check if x or y is out of bounds
		if (x < 0 || y < 0 || x >= this.grid.length || y >= this.grid[0].length) {
			return false;
		}

		// Check if the cell at grid[x][y] is true
		if (this.grid[y][x] !== -1) {
			return false;
		}

		// Check the cells the item is trying to occupy
		for (let row = y; row < y + item.minHeight; row++) {
			for (let column = x; column < x + item.minWidth; column++) {
				// Check if the cell is out of bounds
				if (column >= this.grid[0].length || row >= this.grid.length) {
					return false;
				}

				// Check if the cell is true
				if (this.grid[row][column] !== -1) {
					return false;
				}

				console.log(
					'Checking cell',
					column,
					row,
					'for item',
					item.index,
					'at',
					x,
					y,
					'with value',
					this.grid[column][row]
				);
			}
		}

		// If none of the cells are true or out of bounds, return true
		return true;
	};

	placeItem = (x: number, y: number, item: GridItem): boolean => {
		// If none of the cells are not -1 or out of bounds, set each cell in the range to index
		for (let row = y; row < y + item.minHeight; row++) {
			for (let column = x; column < x + item.minWidth; column++) {
				this.grid[row][column] = item.index;
			}
		}

		// Return true to indicate that the item was successfully placed
		return true;
	};

	setItemStyle = (item: GridItem) => {
		item.element.style.gridColumnStart = `${item.x! + 1}`;
		item.element.style.gridColumnEnd = `${item.x! + item.minWidth + 1}`;
		item.element.style.gridRowStart = `${item.y! + 1}`;
		item.element.style.gridRowEnd = `${item.y! + item.minHeight + 1}`;
	};
}

export default Bento;
