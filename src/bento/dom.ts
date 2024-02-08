import type { GridItem, GridSize } from './types';

export function getItems(gridElement: HTMLElement): GridItem[] {
	const itemElements = [...gridElement.querySelectorAll('.item')];

	const gridItems: GridItem[] = itemElements
		.filter((element) => element instanceof HTMLElement)
		.map(
			(element, index): GridItem => ({
				index,
				element: element as HTMLElement,
				minWidth: Number.parseInt(
					(element as HTMLElement).dataset.minWidth ?? '1'
				),
				minHeight: Number.parseInt(
					(element as HTMLElement).dataset.minHeight ?? '1'
				),
			})
		);

	return gridItems;
}

export function setItemStyle(item: GridItem) {
	item.element.style.removeProperty('display');
	item.element.style.gridColumnStart = `${item.x! + 1}`;
	item.element.style.gridColumnEnd = `${item.x! + (item.actualWidth ?? item.minWidth) + 1}`;
	item.element.style.gridRowStart = `${item.y! + 1}`;
	item.element.style.gridRowEnd = `${item.y! + (item.actualHeight ?? item.minHeight) + 1}`;
}

export const fillEmpty = (
	grid: number[][],
	gridElement: HTMLElement,
	gridSize: GridSize
) => {
	for (let y = 0; y < gridSize.rows; y++) {
		for (let x = 0; x < gridSize.columns; x++) {
			if (grid[y][x] === -1) {
				const filler = document.createElement('div');
				filler.classList.add('filler');
				filler.style.gridColumnStart = `${x + 1}`;
				filler.style.gridColumnEnd = `${x + 2}`;
				filler.style.gridRowStart = `${y + 1}`;
				filler.style.gridRowEnd = `${y + 2}`;
				gridElement.append(filler);
			}
		}
	}
};
