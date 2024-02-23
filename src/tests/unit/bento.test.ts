import Bento from '../../core/bento';
import GridItem from '../../core/grid-item';
import Vector2 from '../../types/vector2';
import { calculateGridSize } from '../../helpers/calculate-grid-size';

describe('Bento', () => {
	let bento: Bento;
	let mockItems: GridItem[];
	let mockGridSize: Vector2;
	const staticFunctions = { calculateGridSize };

	beforeEach(() => {
		// Set up our document body
		document.body.innerHTML = `<div id="grid">
                <div class="item" data-min-width="5" data-min-height="2">Item 0</div>
                <div class="item" data-min-width="5" data-min-height="3">Item 1</div>
                <div class="item" data-min-width="6" data-min-height="3">Item 2</div>
                <div class="item" data-min-width="4" data-min-height="3">Item 3</div>
                <div class="item" data-min-width="5" data-min-height="5">Item 4</div>
                <div class="item" data-min-width="10" data-min-height="6">Item 5</div>
                <div class="item" data-min-width="5" data-min-height="5">Item 6</div>
                <div class="item" data-min-width="3" data-min-height="5">Item 7</div>
                <div class="item" data-min-width="2" data-min-height="2">Item 8</div>
                <div class="item" data-min-width="3" data-min-height="4">Item 9</div>
                <div class="item" data-min-width="2" data-min-height="4">Item 10</div>
                <div class="item" data-min-width="4" data-min-height="3">Item 11</div>
                <div class="item" data-min-width="3" data-min-height="3">Item 12</div>
                <div class="item" data-min-width="5" data-min-height="3">Item 13</div>
            </div>`;

		bento = new Bento(document.getElementById('grid')!);
		mockGridSize = { x: 10, y: 10 };

		// Mocking the methods used in setLayout
		bento.dom.getItems = jest.fn();
		bento.dom.setupGrid = jest.fn();
		bento.dom.setItemStyles = jest.fn();
		bento.grid.createGrid = jest.fn();
		bento.grid.populateGrid = jest.fn();
		bento.grid.fillGrid = jest.fn();
		jest.spyOn(staticFunctions, 'calculateGridSize');
	});

	it('should set the layout correctly', () => {
		bento.setLayout();

		expect(bento.dom.getItems).toHaveBeenCalled();
		expect(staticFunctions.calculateGridSize).toHaveBeenCalledWith(
			bento.gridElement,
			bento.preferredCellSize
		);
		expect(bento.dom.setupGrid).toHaveBeenCalledWith(mockGridSize);
		expect(bento.grid.createGrid).toHaveBeenCalledWith(mockGridSize);
		expect(bento.grid.populateGrid).toHaveBeenCalledWith(mockItems);
		expect(bento.grid.fillGrid).toHaveBeenCalled();
		expect(bento.dom.setItemStyles).toHaveBeenCalledWith(mockItems);
	});
});
