<script lang="ts">
	import { cn } from '../utils';
	import { onMount, tick } from 'svelte';
	import Plyr from 'plyr';
	import { videoPlayer } from '$lib/state.svelte';

	const { class: className }: { class?: string } = $props();

	$effect(() => {
		const player = new Plyr('.js-player', {
			settings: ['captions', 'quality', 'loop', 'controls']
		});

		// set the video player to the id
		if (videoPlayer.id) {
			player.source = {
				type: 'video',
				sources: [
					{
						src: videoPlayer.id,
						type: 'video/youtube'
					}
				]
			};
		}

		// when loaded play the video and go fullscreen
		player.on('ready', () => {
			player.play();
			//player.fullscreen.enter();
		});

		return () => {
			player.destroy();
		};
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && videoPlayer.showing) {
			videoPlayer.hide();
		}
	}}
/>

{#key videoPlayer.id}
	{#if videoPlayer.showing && videoPlayer.id}
		<div class="fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center">
			<button
				onclick={() => videoPlayer.hide()}
				class="absolute inset-0 bg-black/70 backdrop-blur-sm"
			></button>
			<div
				class={cn(
					'aspect-video max-h-screen relative w-full overflow-hidden rounded-xl border border-black bg-white object-cover dark:border-white/10 dark:bg-white/5',
					className
				)}
			>
				<button
					onclick={() => {
						videoPlayer.hide();
					}}
					class="absolute left-2 top-2 z-20 rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-6"
					>
						<path
							fill-rule="evenodd"
							d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>

				<div
					id="player"
					class="h-full w-full overflow-hidden rounded-xl object-cover font-semibold text-black dark:text-white"
				>
					<div
						class="js-player plyr__video-embed"
						id="player"
						data-plyr-provider="youtube"
						data-plyr-embed-id={videoPlayer.id}
					></div>
				</div>
			</div>
		</div>
	{/if}
{/key}

<style>
	* {
		--plyr-color-main: #e11d48;
	}
</style>
