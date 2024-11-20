<script lang="ts">
	import { type PageData } from './$types';
	import { enhance } from '$app/forms';
	import Container from '$lib/Components/Container.svelte';
	import VideoPlayer from '$lib/Components/VideoPlayer.svelte';

	let { data }: { data: PageData } = $props();

	console.log(data);
</script>

<img
	src="https://image.tmdb.org/t/p/w1280{data.result.backdrop_path}"
	alt=""
	class="fixed -z-20 h-full w-full object-cover object-center opacity-20"
/>
<div class="fixed inset-0 -z-10 h-full w-full bg-black/70"></div>

<Container>
	<div class="flex gap-4 pt-8">
		<img
			src="https://image.tmdb.org/t/p/w500{data.result.poster_path}"
			alt=""
			class="h-auto w-24 rounded-lg border border-white/10 sm:w-44"
		/>
		<div class="flex flex-col gap-4">
			<div class="max-w-xl text-2xl font-semibold text-white sm:text-4xl">
				{data.result.original_title}
			</div>
			{#if data.user}
				<div class="flex gap-2">
					<form method="post" action="?/mark" use:enhance>
						<button
							class="rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
							>{data.watched ? 'Mark unwatched' : 'Mark watched'}</button
						>
					</form>
				</div>
			{/if}
		</div>
	</div>

	<div class="my-8 max-w-2xl text-sm text-white">
		<div class="mb-2 text-lg font-semibold">overview</div>
		{data.result.overview}
	</div>

	{#if data.trailer}
		<div class="mb-2 text-lg font-semibold">trailer</div>

		<VideoPlayer id={data.trailer} />
	{/if}
</Container>
