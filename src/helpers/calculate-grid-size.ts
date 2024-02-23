import type Vector2 from '../types/vector2';

function calculateGridSize(gridElement: HTMLElement, size: Vector2): Vector2 {
	const rect = gridElement.getBoundingClientRect();
	console.warn(rect);
	const columns = Math.floor(rect.width / size.x);
	const rows = Math.floor(rect.height / size.y);

	return {
		x: columns,
		y: rows,
	};
}

export { calculateGridSize };
