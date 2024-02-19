import type Vector2 from '../types/vector2';
import type GridItem from './grid-item';

class Grid {
	private grid: number[][] = [];
	private gridSize: Vector2 = { x: 0, y: 0 };
	private items: GridItem[] = [];
	private stretchableItems: GridItem[] = [];

	getGridSize = () => this.gridSize;

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

	fillGrid = () => {
		this.stretchableItems = this.items.filter((item) => item.placed);
		let itemToStretch = this.stretchableItems[0];

		while (itemToStretch) {
			this.checkIfItemsCanStretch();
			itemToStretch = this.findFirstStretchableItem();
			if (!itemToStretch) break;

			itemToStretch.stretch();
		}
	};

	isOpenSpace = (cellPosition: Vector2): boolean => {
		if (this.isOutOfBounds(cellPosition)) return false;
		if (this.isCellFilled(cellPosition)) return false;
		return true;
	};

	assignItemToCells(item: GridItem) {
		const endRow =
			item.position.y + (item.actualSize ? item.actualSize.y : item.minSize.y);
		const endColumn =
			item.position.x + (item.actualSize ? item.actualSize.x : item.minSize.x);

		for (let row = item.position.y; row < endRow; row++) {
			for (let column = item.position.x; column < endColumn; column++) {
				this.grid[row][column] = item.index;
			}
		}
	}

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

	/** Placing **/

	private readonly insertItemIntoGrid = (gridItem: GridItem) => {
		for (let y = 0; y < this.gridSize.y; y++) {
			if (this.tryPlaceItemOnRow(gridItem, y)) {
				return true;
			}
		}

		return false;
	};

	private readonly tryPlaceItemOnRow = (gridItem: GridItem, y: number) => {
		for (let x = 0; x < this.gridSize.x; x++) {
			if (gridItem.checkPlacement({ x, y })) {
				gridItem.position = { x, y };
				this.assignItemToCells(gridItem);
				gridItem.placed = true;
				return true;
			}
		}

		return false;
	};

	/** Stretching **/

	private readonly checkIfItemsCanStretch = () => {
		for (const item of this.stretchableItems) {
			item.canStretch();
		}
	};

	private readonly findFirstStretchableItem = () => {
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

	/** Placement checks **/

	private isOutOfBounds(cellPosition: Vector2): boolean {
		return (
			cellPosition.x < 0 ||
			cellPosition.y < 0 ||
			cellPosition.y >= this.grid.length ||
			cellPosition.x >= this.grid[0].length
		);
	}

	private isCellFilled(cellPosition: Vector2): boolean {
		return this.grid[cellPosition.y][cellPosition.x] !== -1;
	}
}

export default Grid;
