<script lang="ts">
	import type { MainRecord } from '$lib/db';
	import Rating from './Rating.svelte';
	import RelativeTime from './relative-time/RelativeTime.svelte';

	let { data, showMovieDetails = true }: { data: MainRecord; showMovieDetails?: boolean } = $props();
</script>

<a
	href={data.record.item.ref === 'tmdb:m'
		? `/movie/${data.record.item.value}`
		: `/tv/${data.record.item.value}`}
	class="flex w-full max-w-2xl flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
>
	<div class="flex gap-4">
		{#if showMovieDetails}
		<div
			class="relative z-20 aspect-[2/3] h-44 w-auto shrink-0 overflow-hidden rounded-md border border-base-800 bg-base-900/50 transition-opacity duration-75 group-hover:opacity-75"
		>
			{#if data.record.metadata?.poster_path}
				<img
					src="https://image.tmdb.org/t/p/w500{data.record.metadata.poster_path}"
					alt="movie poster for {data.record.metadata.title}"
					class="size-full object-cover object-center lg:size-full"
				/>
			{/if}
			</div>
		{/if}
		<div class="flex w-full flex-col justify-center gap-4">
			<div class="flex w-full flex-row gap-4 sm:items-center">
				<div class="flex items-center gap-2">
					{#if data.author.avatar}
						<img src={data.author.avatar} alt="user avatar" class="size-5 rounded-full" />
					{/if}
					<div class="text-md font-semibold">{data.author.displayName || data.author.handle}</div>
				</div>
				<div class="text-sm text-base-500">
					<RelativeTime date={new Date(data.updatedAt)} locale="en-US" />
				</div>
			</div>

			<div class="flex w-full flex-col gap-4">
				<div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
					{#if showMovieDetails}
						<div class="text-2xl font-bold">{data.record.metadata?.title}</div>
					{/if}
					{#if data.record.rating?.value}
						<Rating rating={data.record.rating?.value / 2} size="size-6" />
					{/if}
				</div>

				{#if data.record.note?.value}
					<div class="text-sm text-base-300">
						{@html data.record.note?.value?.replace('\n', '<br /><br />')}
					</div>
				{/if}
			</div>
		</div>
	</div>
</a>
