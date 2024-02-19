import type Vector2 from '../types/vector2';

function calculateGridSize(
	gridElement: HTMLElement,
	width: number,
	height: number
): Vector2 {
	const rect = gridElement.getBoundingClientRect();
	const columns = Math.floor(rect.width / width);
	const rows = Math.floor(rect.height / height);

	return {
		x: columns,
		y: rows,
	};
}

export { calculateGridSize };
