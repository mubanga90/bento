import type { GridItem } from './types';

export const getItems = (gridElement: HTMLElement): GridItem[] => {
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
};

export const getGridSize = (
	gridElement: HTMLElement,
	width: number,
	height: number
) => {
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
