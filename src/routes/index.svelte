<script>
	import Board from '$lib/components/board/Board.svelte';
	import WindowSize from '$lib/components/utils/WindowSize.svelte';
	import { screenWidth } from '$lib/stores/window';
</script>

<WindowSize bind:width={$screenWidth} />

<main class="px-1 sm:px-4 py-4 mx-auto w-full max-w-md">
	<Board />
</main>
