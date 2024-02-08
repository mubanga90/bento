import { insertItemIntoGrid } from './item';
import { type GridItem, type GridSize } from './types';

export function createGrid(rows: number, columns: number): number[][] {
	return Array.from<number[]>({ length: rows }).map(() =>
		Array.from<number>({ length: columns }).fill(-1)
	);
}

export function getGridSize(
	gridElement: HTMLElement,
	width: number,
	height: number
) {
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
}

export function debugGrid(grid: number[][]) {
	console.log(
		grid
			.map((row) =>
				row
					.map((cell) => (cell === -1 ? '.  ' : String(cell).padEnd(3, ' ')))
					.join(' ')
			)
			.join('\n')
	);
}

export function populateGrid(
	items: GridItem[],
	grid: number[][],
	gridSize: GridSize
) {
	for (const item of items) {
		const placed = insertItemIntoGrid(item, grid, gridSize);

		if (!placed) {
			console.warn('Could not place item', item.index);
			item.element.style.display = 'none';
		}
	}
}
