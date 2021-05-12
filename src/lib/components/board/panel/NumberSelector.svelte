<script>
	import clsx from 'clsx';
	import { screenWidth } from '$lib/stores/window';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<div class="flex mx-auto" style="width: fit-content">
	{#each [...Array(9)] as _, num}
		<div
			class={clsx(
				'text-xl cursor-pointer flex justify-center items-center',
				'can-hover:hover:bg-gray-700 select-none',
				{
					'w-12 h-12': $screenWidth >= 450,
					'w-10 h-10 text-lg': $screenWidth < 450 && $screenWidth >= 375,
					'w-8 h-8 text-base': $screenWidth < 375
					// invisible: !$board.takingNotes && $board.numberCountMap.get(num + 1) === 9
				}
			)}
			on:click={() => {
				// if (!$board.takingNotes && $board.numberCountMap.get(num + 1) === 9) return;
				dispatch('select-number', num + 1);
			}}
		>
			{num + 1}
		</div>
	{/each}
</div>
