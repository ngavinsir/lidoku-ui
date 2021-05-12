import type Two from 'two.js';
import color from '../../utils/color';

export enum CellStatus {
	WRONG,
	CORRECT,
	GENERATED
}

export enum CellSelectStatus {
	SELECTED,
	SAME_AS_SELECTED,
	NOT_SELECTED
}

export interface CellData {
	index: number;
	x: number;
	y: number;
	size: number;
	col: number;
	row: number;
	value: number | null;
	status: CellStatus;
	selectStatus: CellSelectStatus;
	notes: Set<number>;
}

export class Cell {
	data: CellData;
	two: Two;
	rect: Two.Rectangle;
	text: Two.Text;

	constructor(data: CellData, two: Two) {
		this.data = data;
		this.two = two;

		this.rect = two.makeRectangle(data.x, data.y, data.size, data.size);
		this.rect.fill = color.gray[800];
		this.rect.noStroke();

		this.text = two.makeText(data.value.toString(), data.x, data.y);
		this.text.fill = color.white;
	}

	updateSelectStatus(selectStatus: CellSelectStatus): void {
		if (this.data.selectStatus === selectStatus) {
			return;
		}
		this.data.selectStatus = selectStatus;
		switch (selectStatus) {
			case CellSelectStatus.SELECTED:
				this.rect.fill = color.gray[500];
				break;
			case CellSelectStatus.SAME_AS_SELECTED:
				this.rect.fill = color.gray[700];
				break;
			default:
				console.log(this.data.index);
				this.rect.fill = color.gray[800];
				break;
		}
	}
}
