import type Two from 'two.js';
import color from '$lib/utils/color';

export enum CellStatus {
	WRONG,
	CORRECT,
	GENERATED,
	IDLE
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

		this.paint();
	}

	paint(): void {
		this.rect = this.two.makeRectangle(this.data.x, this.data.y, this.data.size, this.data.size);
		this.rect.fill = color.gray[800];
		this.rect.noStroke();

		this._paintText();
		this._updateSelectStatus();
	}

	private _paintText() {
		if (this.data.value !== null) {
			this.text = this.two.makeText(this.data.value.toString(), this.data.x, this.data.y);
			this.text.fill = color.white;
			this.text.size = (1 / 3) * this.data.size;
		}
	}

	removeValue(): void {
		if (!this.text) {
			return;
		}
		this.text.remove();
		this.text = null;
		this.data.value = null;
	}

	updateValue(value: number): void {
		if (this.data.value === value) {
			return;
		}
		this.data.value = value;
		this._updateValue();
	}

	private _updateValue() {
		if (this.text) {
			this.text.value = this.data.value;
			return;
		}
		this._paintText();
	}

	updateSelectStatus(selectStatus: CellSelectStatus): void {
		if (this.data.selectStatus === selectStatus) {
			return;
		}
		this.data.selectStatus = selectStatus;
		this._updateSelectStatus();
	}

	private _updateSelectStatus(): void {
		switch (this.data.selectStatus) {
			case CellSelectStatus.SELECTED:
				this.rect.fill = color.gray[500];
				break;
			case CellSelectStatus.SAME_AS_SELECTED:
				this.rect.fill = color.gray[700];
				break;
			default:
				this.rect.fill = color.gray[800];
				break;
		}
	}
}
