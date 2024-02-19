import type Vector2 from '../types/vector2';
import GridItem from './grid-item';

class DomHandler {
	gridElement: HTMLElement | undefined = undefined;

	setGridElement = (element: HTMLElement) => {
		this.gridElement = element;
	};

	getItems = (): GridItem[] => {
		if (!this.gridElement) {
			throw new Error('Grid element not set');
		}

		return Array.from(this.gridElement.children).map(
			(element, index) => new GridItem(element as HTMLElement, index)
		);
	};

	setupGrid = (gridSize: Vector2) => {
		if (!this.gridElement) {
			throw new Error('Grid element not set');
		}

		this.gridElement.style.gridTemplateColumns = `repeat(${gridSize.x}, 1fr)`;
	};

	setItemStyles = (items: GridItem[]) => {
		for (const item of items) {
			if (item.element) {
				item.element.style.display = item.placed ? 'block' : 'none';
				item.element.style.gridColumnStart = `${item.position.x + 1}`;
				item.element.style.gridColumnEnd = `span ${item.actualSize ? item.actualSize.x : item.minSize.x}`;
				item.element.style.gridRowStart = `${item.position.y + 1}`;
				item.element.style.gridRowEnd = `span ${item.actualSize ? item.actualSize.y : item.minSize.y}`;
			}
		}
	};
}

export default DomHandler;
