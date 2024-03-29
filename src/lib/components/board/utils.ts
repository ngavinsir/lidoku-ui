export function index2Row(index: number): number {
	return Math.floor(index / 9);
}

export function index2Col(index: number): number {
	return index % 9;
}

export function index2Square(index: number): number {
	return Math.floor(index2Row(index) / 3) * 3 + Math.floor(index2Col(index) / 3);
}

export function rowCol2Index(row: number, col: number): number {
	return row * 9 + col;
}
