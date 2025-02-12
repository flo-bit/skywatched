<script lang="ts">
	import { onMount } from 'svelte';
	import Hls from 'hls.js';

	const { data } = $props();

	import Plyr from 'plyr';

	onMount(() => {
		if (Hls.isSupported()) {
			var hls = new Hls();
			hls.loadSource(data.playlist);
			hls.attachMedia(element);
		}

		new Plyr(element, {
			controls: [
				'play-large',
				'play',
				'progress',
				'current-time',
				'mute',
				'volume',
				'fullscreen',
				'settings'
			],
			hideControls: true
		});
	});

	let element: HTMLMediaElement;
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
</svelte:head>

<div class="aspect-video w-full max-w-full overflow-hidden rounded-2xl border border-base-700">
	<video bind:this={element}>
		<track kind="captions" />
	</video>
</div>

<style>
	* {
		--plyr-color-main: #db2777;
	}
</style>
