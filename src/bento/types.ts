export type GridItem = {
	index: number;
	element: HTMLElement;
	minWidth: number;
	minHeight: number;
	x?: number;
	y?: number;
	actualWidth?: number;
	actualHeight?: number;
	emptyNeighborsRight?: number;
	emptyNeighborsBottom?: number;
};

export type GridSize = {
	width: number;
	height: number;
	columns: number;
	rows: number;
};

export type BentoOptions = {
	gridElement: HTMLElement;
	preferredCellWidth?: number;
	preferredCellHeight?: number;
};

// - Add them to a container and add apropriate grid-row/column-ends
// - "Predict" where they will be placed

// - Find empty spots
// - Fill where possible by sizing
// - Add filler items where not
