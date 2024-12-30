<script lang="ts">
	import Container from '$lib/Components/Container.svelte';
	import { onMount } from 'svelte';
	import { type PageData } from './$types';
	import ItemCardTrailer from '$lib/Components/ItemCardTrailer.svelte';
	import { videoPlayer } from '$lib/state.svelte';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		console.log(data);
	});
</script>

<Container class="relative z-10 w-full py-8 sm:py-16">
	<div class="flex flex-col gap-4 px-4">
		<h1 class="pb-8 text-2xl font-bold">Trailers</h1>

		<h1 class="text-lg font-medium">Popular Movies</h1>
		<div class="overflow-hidden rounded-xl bg-base-900/70 border border-base-800">
			<div class="overflow-x-scroll pt-6 pb-2">
				<div class="flex flex-col gap-y-4 px-6">
					<div class="flex gap-x-6">
						{#each data.trailers as trailer, i}
							{#if i % 2 === 0}
								<ItemCardTrailer
									item={trailer}
									onclick={() => {
										videoPlayer.show(trailer.trailer ?? '');
									}}
								/>
							{/if}
						{/each}
						<div class="w-20 h-10 bg-red-500"></div>
					</div>
					<div class="flex gap-x-6">
						{#each data.trailers as trailer, i}
							{#if i % 2 === 1}
								<ItemCardTrailer
									item={trailer}
									onclick={() => {
										videoPlayer.show(trailer.trailer ?? '');
									}}
								/>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</Container>
