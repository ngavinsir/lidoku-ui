<script lang="typescript">
	import { onMount } from 'svelte';
	import Two from 'two.js';
	import { Cell, CellSelectStatus, CellStatus } from './cell';
	import { index2Col, index2Row, rowCol2Index } from './utils';
	import color from '$lib/utils/color';
	import Panel from './panel/Panel.svelte';
	import { screenWidth } from '$lib/stores/window';

	export let puzzle: string =
		'.9....85....2..91..2.1.8.....1...534..36.......7.1....3.......9...9.7..68.....7..';

	const cells: Cell[] = [];
	let initialized = false;
	let boardSize: number;
	let wrapper: HTMLDivElement;
	let wrapperRect: DOMRect;
	let two: Two;
	let selectedIndex: number | null = null;

	$: if ($screenWidth > 0 && initialized) {
		two.clear();
		wrapper.removeChild(wrapper.firstChild);

		init(puzzle);
	}

	onMount(() => {
		init(puzzle);

		initialized = true;
	});

	function handleClick(e: MouseEvent) {
		const col = Math.floor((e.clientX - wrapperRect.left) / (boardSize / 9));
		const row = Math.floor((e.clientY - wrapperRect.top) / (boardSize / 9));
		const index = rowCol2Index(row, col);

		setSelectedIndex(index);
	}

	function setValue(value: number) {
		if (selectedIndex === null) {
			return;
		}
		const cell = cells[selectedIndex];
		if (cell.data.status === CellStatus.GENERATED) {
			return;
		}

		if (value === cell.data.value) {
			cell.removeValue();
		} else {
			cell.updateValue(value);
		}

		const index = selectedIndex;
		selectedIndex = null;
		setSelectedIndex(index);
	}

	function setSelectedIndex(index: number) {
		selectedIndex = index === selectedIndex ? null : index;
		cells.forEach((cell) => {
			if (
				selectedIndex !== null &&
				cell.data.index !== selectedIndex &&
				cell.data.value &&
				cell.data.value === cells[selectedIndex].data.value
			) {
				cell.updateSelectStatus(CellSelectStatus.SAME_AS_SELECTED);
			} else if (cell.data.index === selectedIndex) {
				cell.updateSelectStatus(CellSelectStatus.SELECTED);
			} else {
				cell.updateSelectStatus(CellSelectStatus.NOT_SELECTED);
			}
		});
	}

	function init(puzzle: string) {
		wrapperRect = wrapper.getBoundingClientRect();
		boardSize = wrapperRect.width;

		two = new Two({ width: boardSize, height: boardSize, type: Two.Types.canvas });
		two.appendTo(wrapper);
		two.play();

		initBoardFromPuzzle(puzzle);
		initStrokes();
	}

	function initBoardFromPuzzle(puzzle: string) {
		if (puzzle.length !== 81) {
			return;
		}
		const puzzleList = puzzle.split('').map((char) => {
			if ([' ', '.', '0', '*', '_'].includes(char)) {
				return null;
			} else {
				return parseInt(char);
			}
		});
		puzzleList.forEach((value, i) => {
			const col = index2Col(i);
			const row = index2Row(i);
			const size = boardSize / 9;
			const x = size / 2 + size * col;
			const y = size / 2 + size * row;

			if (cells.length <= i) {
				cells.push(
					new Cell(
						{
							col,
							index: i,
							notes: new Set(),
							row,
							selectStatus: CellSelectStatus.NOT_SELECTED,
							size,
							status: value ? CellStatus.GENERATED : CellStatus.IDLE,
							value,
							x,
							y
						},
						two
					)
				);
			} else {
				cells[i].data = {
					...cells[i].data,
					size,
					x,
					y
				};
				cells[i].two = two;
				cells[i].paint();
			}
		});
	}

	function initStrokes() {
		[...Array(3).keys()].forEach((i) => {
			[...Array(2).keys()].forEach((j) => {
				const offset = (boardSize / 3) * i + (boardSize / 9) * (j + 1);
				const group = two.makeGroup([
					two.makeLine(0, offset, boardSize, offset),
					two.makeLine(offset, 0, offset, boardSize)
				]);
				group.stroke = color.gray[600];
				group.linewidth = 1;
			});
		});

		[...Array(2).keys()].forEach((i) => {
			const offset = (boardSize / 3) * (i + 1);
			const group = two.makeGroup([
				two.makeLine(0, offset, boardSize, offset),
				two.makeLine(offset, 0, offset, boardSize)
			]);
			group.stroke = color.gray[400];
			group.linewidth = 3;
		});

		const outer = two.makeGroup([
			two.makeLine(0, 0, boardSize, 0),
			two.makeLine(boardSize, 0, boardSize, boardSize),
			two.makeLine(0, boardSize, boardSize, boardSize),
			two.makeLine(0, 0, 0, boardSize)
		]);
		outer.stroke = color.gray[400];
		outer.linewidth = 6;
	}
</script>

<div class="w-full select-none" bind:this={wrapper} on:click={handleClick} />
<Panel class="mt-4" on:select-number={(e) => setValue(e.detail)} />
