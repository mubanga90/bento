import type Vector2 from '../types/vector2';
import type Grid from './grid';

class GridItem {
	index = -1;
	element: HTMLElement | undefined;
	grid: Grid | undefined;
	minSize: Vector2 = { x: 1, y: 1 };
	position: Vector2 = { x: 0, y: 0 };
	actualSize?: Vector2;
	placed: boolean;
	emptyNeighborsRight = 0;
	emptyNeighborsBottom = 0;

	constructor(element: HTMLElement, index: number) {
		this.element = element;
		this.index = index;
		this.minSize.x = Number(element.dataset.minWidth);
		this.minSize.y = Number(element.dataset.minHeight);
		this.placed = false;
	}

	setGrid = (grid: Grid) => {
		this.grid = grid;
	};

	checkPlacement = (position: Vector2): boolean => {
		if (this.grid === undefined) {
			throw new Error('Grid not set');
		}

		for (let row = position.y; row < position.y + this.minSize.y; row++) {
			if (!this.isCellOpen({ x: position.x, y: row })) {
				return false;
			}
		}

		return true;
	};

	canStretch = () => {
		if (this.position.x === undefined || this.position.y === undefined) return;

		this.actualSize ??= this.minSize;
		this.emptyNeighborsRight = 0;
		this.emptyNeighborsBottom = 0;

		this.canStretchInDirection('x', 'Right');
		this.canStretchInDirection('y', 'Bottom');
	};

	stretch = () => {
		if (
			this.emptyNeighborsRight > this.emptyNeighborsBottom ||
			(this.emptyNeighborsRight === this.emptyNeighborsBottom &&
				this.index % 2 === 0)
		) {
			this.actualSize!.x++;
		} else {
			this.actualSize!.y++;
		}

		this.grid?.assignItemToCells(this);
	};

	private readonly isCellOpen = (position: Vector2): boolean => {
		for (
			let column = position.x;
			column < position.x + this.minSize.x;
			column++
		) {
			if (!this.grid!.isOpenSpace({ x: column, y: position.y })) {
				return false;
			}
		}

		return true;
	};

	private readonly canStretchInDirection = (
		axis: 'x' | 'y',
		direction: 'Right' | 'Bottom'
	) => {
		if (this.canStretchOnAxis(axis)) {
			this[`emptyNeighbors${direction}`] += this.actualSize![axis];
		}
	};

	private readonly canStretchOnAxis = (axis: 'x' | 'y') => {
		const end = this.position[axis] + this.actualSize![axis];
		const otherAxis = axis === 'x' ? 'y' : 'x';
		const otherEnd = this.position[otherAxis] + this.actualSize![otherAxis];

		if (end >= this.grid!.getGridSize()[axis]) return false;
		for (let i = this.position[otherAxis]; i < otherEnd; i++) {
			if (
				!this.grid!.isOpenSpace(
					axis === 'x' ? { x: end, y: i } : { x: i, y: end }
				)
			)
				return false;
		}

		return true;
	};
}

export default GridItem;
