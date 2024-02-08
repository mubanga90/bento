import { setItemStyle } from './dom';
import type { GridItem, GridSize } from './types';

export function insertItemIntoGrid(
	item: GridItem,
	grid: number[][],
	gridSize: GridSize
): boolean {
	for (let y = 0; y < gridSize.rows; y++) {
		for (let x = 0; x < gridSize.columns; x++) {
			if (checkPlacement(grid, x, y, item)) {
				assignItemToCells(grid, x, y, item);
				item.x = x;
				item.y = y;
				setItemStyle(item);
				return true;
			}
		}
	}

	return false;
}

export function checkCells(
	grid: number[][],
	startX: number,
	startY: number,
	width: number,
	height: number
): boolean {
	for (let row = startY; row < startY + height; row++) {
		for (let column = startX; column < startX + width; column++) {
			if (isOutOfBounds(column, row, grid)) {
				return false;
			}

			if (isCellFilled(column, row, grid)) {
				return false;
			}
		}
	}

	return true;
}

export function assignItemToCells(
	grid: number[][],
	x: number,
	y: number,
	item: GridItem
) {
	for (let row = y; row < y + (item.actualHeight ?? item.minHeight); row++) {
		for (
			let column = x;
			column < x + (item.actualWidth ?? item.minWidth);
			column++
		) {
			grid[row][column] = item.index;
		}
	}
}

export function isOutOfBounds(x: number, y: number, grid: number[][]): boolean {
	return x < 0 || y < 0 || y >= grid.length || x >= grid[0].length;
}

export function isCellFilled(x: number, y: number, grid: number[][]): boolean {
	return grid[y][x] !== -1;
}

export function checkPlacement(
	grid: number[][],
	x: number,
	y: number,
	item: GridItem
): boolean {
	if (isOutOfBounds(x, y, grid) || isCellFilled(x, y, grid)) {
		return false;
	}

	return checkCells(grid, x, y, item.minWidth, item.minHeight);
}
