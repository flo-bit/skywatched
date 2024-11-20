<script lang="ts">
	import { cn } from '../utils';
	import { onMount } from 'svelte';
	import Plyr from 'plyr';

	const { id, class: className }: { id: string; class?: string } = $props();

	onMount(async () => {
		const player = new Plyr('.js-player', {
			settings: ['captions', 'quality', 'loop', 'controls']
		});
	});
</script>

<div
	class={cn(
		'aspect-video relative w-full max-w-2xl overflow-hidden rounded-xl border border-black bg-white object-cover dark:border-white/10 dark:bg-white/5',
		className
	)}
>
	<div
		id="player"
		class="h-full w-full overflow-hidden rounded-xl object-cover font-semibold text-black dark:text-white"
	>
		<div
			class="js-player plyr__video-embed"
			id="player"
			data-plyr-provider="youtube"
			data-plyr-embed-id={id}
		></div>
	</div>
</div>

<style>
	* {
		--plyr-color-main: #e11d48;
	}
</style>
