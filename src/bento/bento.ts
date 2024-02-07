type GridItem = {
	element: HTMLElement;
	minWidth: number;
	minHeight: number;
};

type GridSize = {
	width: number;
	height: number;
	columns: number;
	rows: number;
};

type BentoOptions = {
	gridElement: HTMLElement;
	preferredCellWidth?: number;
	preferredCellHeight?: number;
};

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

	grid: boolean[][] = [];

	constructor(options: BentoOptions) {
		this.gridElement = options.gridElement;
		this.preferredCellWidth = options.preferredCellWidth ?? 100;
		this.preferredCellHeight = options.preferredCellHeight ?? 100;

		this.setLayout();
	}

	// - Take an array of items, each has min width and height
	getItems = (gridElement: HTMLElement): GridItem[] => {
		const itemElements = [...gridElement.querySelectorAll('.item')];

		const gridItems: GridItem[] = itemElements
			.filter((element) => element instanceof HTMLElement)
			.map(
				(element): GridItem => ({
					element: element as HTMLElement,
					minWidth: Number.parseInt(
						(element as HTMLElement).dataset.minWidth ?? '1',
						10
					),
					minHeight: Number.parseInt(
						(element as HTMLElement).dataset.minHeight ?? '1',
						10
					),
				})
			);

		return gridItems;
	};

	// - Take the screen width, get cell sizes

	getGridSize = (gridElement: HTMLElement, width: number, height: number) => {
		const rect = gridElement.getBoundingClientRect();
		const columns = Math.floor(rect.width / width);
		const rows = Math.floor(rect.height / height);

		// If (height > width) {
		// Could do something depending of landscape or portrait
		// }

		return {
			width: rect.width,
			height: rect.height,
			columns,
			rows,
		};
	};

	setLayout = () => {
		this.items = this.getItems(this.gridElement);
		this.gridSize = this.getGridSize(
			this.gridElement,
			this.preferredCellWidth,
			this.preferredCellHeight
		);

		this.grid = Array.from<boolean[]>({ length: this.gridSize.rows })
			.fill([])
			.map(() =>
				Array.from<boolean>({ length: this.gridSize.columns }).fill(true)
			);

		console.log(this.gridSize, this.items);
		for (const item of this.items) {
			// Find space
			for (let y = 0; y < this.gridSize.rows; y++) {
				for (let x = 0; x < this.gridSize.columns; x++) {
					// If (checkPlacement(x, y, item)) {
					if (x === 1 && y === 1) {
						console.log(x, y, this.checkPlacement(x, y, item));
					}
				}
			}
		}

		// Place items, keep track of placed items and
	};

	checkPlacement = (x: number, y: number, item: GridItem): boolean => {
		for (let i = y; i < this.gridSize.rows + item.minHeight - 1; y++) {
			for (let i = x; i < this.gridSize.columns + item.minWidth - 1; x++) {
				if (!this.grid[y][x]) {
					return false;
				}
			}
		}

		return true;
	};
}

// - Add them to a container and add apropriate grid-row/column-ends
// - "Predict" where they will be placed

// - Find empty spots
// - Fill where possible by sizing
// - Add filler items where not

export default Bento;
