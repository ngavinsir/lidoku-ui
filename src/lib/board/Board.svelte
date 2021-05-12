<script lang="typescript">
	import { onMount } from 'svelte';
	import Two from 'two.js';
	import { Cell, CellSelectStatus, CellStatus } from './cell';
	import { index2Col, index2Row, rowCol2Index } from './utils';
	import color from '../../utils/color';

	const boardSize = 640;
	const cells: Cell[] = [];
	let wrapper: HTMLDivElement;
	let wrapperRect: DOMRect;
	let two: Two;
	let selectedIndex: number | null = null;

	onMount(() => {
		two = new Two({ width: boardSize, height: boardSize });
		two.appendTo(wrapper);
		two.play();

		wrapperRect = wrapper.getBoundingClientRect();

		initBoard();
		initStrokes();
	});

	function handleClick(e: MouseEvent) {
		const col = Math.floor((e.clientX - wrapperRect.left) / (boardSize / 9));
		const row = Math.floor((e.clientY - wrapperRect.top) / (boardSize / 9));
		const index = rowCol2Index(row, col);

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

	function initBoard() {
		[...Array(81).keys()].forEach((i) => {
			const col = index2Col(i);
			const row = index2Row(i);
			const size = boardSize / 9;
			cells.push(
				new Cell(
					{
						col,
						index: i,
						notes: new Set(),
						row,
						selectStatus: CellSelectStatus.NOT_SELECTED,
						size,
						status: CellStatus.GENERATED,
						value: Math.floor(Math.random() * 9) + 1,
						x: size / 2 + size * col,
						y: size / 2 + size * row
					},
					two
				)
			);
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

<div bind:this={wrapper} on:click={handleClick} />
