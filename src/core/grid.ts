import type Vector2 from '../types/vector2';
import type GridItem from './grid-item';

class Grid {
	grid: number[][] = [];
	gridSize: Vector2 = { x: 0, y: 0 };
	items: GridItem[] = [];
	stretchableItems: GridItem[] = [];

	createGrid = (gridSize: Vector2) => {
		this.gridSize = gridSize;
		this.grid = Array.from<number[]>({ length: this.gridSize.y }).map(() =>
			Array.from<number>({ length: this.gridSize.x }).fill(-1)
		);
	};

	populateGrid = (gridItems: GridItem[]) => {
		this.items = gridItems;
		for (const gridItem of gridItems) {
			gridItem.setGrid(this);
			const placed = this.insertItemIntoGrid(gridItem);

			if (!placed) {
				console.warn('Could not place item', gridItem.index);
			}
		}
	};

	insertItemIntoGrid = (gridItem: GridItem) => {
		for (let y = 0; y < this.gridSize.y; y++) {
			for (let x = 0; x < this.gridSize.x; x++) {
				if (gridItem.checkPlacement({ x, y })) {
					gridItem.position = { x, y };
					this.assignItemToCells(gridItem);
					gridItem.placed = true;
					return true;
				}
			}
		}

		return false;
	};

	// Move to item?
	// Split into smaller methods
	assignItemToCells(item: GridItem) {
		for (
			let row = item.position.y;
			row <
			item.position.y + (item.actualSize ? item.actualSize.y : item.minSize.y);
			row++
		) {
			for (
				let column = item.position.x;
				column <
				item.position.x +
					(item.actualSize ? item.actualSize.x : item.minSize.x);
				column++
			) {
				this.grid[row][column] = item.index;
			}
		}

		this.debugGrid();
	}

	isOpenSpace = (cellPosition: Vector2): boolean => {
		if (this.isOutOfBounds(cellPosition)) return false;
		if (this.isCellFilled(cellPosition)) return false;
		return true;
	};

	isOutOfBounds(cellPosition: Vector2): boolean {
		return (
			cellPosition.x < 0 ||
			cellPosition.y < 0 ||
			cellPosition.y >= this.grid.length ||
			cellPosition.x >= this.grid[0].length
		);
	}

	isCellFilled(cellPosition: Vector2): boolean {
		return this.grid[cellPosition.y][cellPosition.x] !== -1;
	}

	fillGrid = () => {
		this.stretchableItems = this.items.filter((item) => item.placed);
		let itemToStretch = this.stretchableItems[0];

		while (itemToStretch) {
			this.checkIfItemsCanStretch();
			itemToStretch = this.findFirstStretchableItem();
			if (!itemToStretch) break;

			itemToStretch.stretch();
		}

		this.debugGrid();
	};

	checkIfItemsCanStretch = () => {
		for (const item of this.stretchableItems) {
			item.canStretch();
		}
	};

	findFirstStretchableItem = () => {
		this.stretchableItems = this.stretchableItems
			.filter((item) => {
				return item.emptyNeighborsRight + item.emptyNeighborsBottom > 0;
			})
			.sort(
				(a, b) =>
					b.emptyNeighborsRight +
					b.emptyNeighborsBottom -
					(a.emptyNeighborsRight + a.emptyNeighborsBottom)
			);

		return this.stretchableItems[0] || null;
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
}

export default Grid;
