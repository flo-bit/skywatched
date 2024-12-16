<script lang="ts">
	import type { MainRecord } from '$lib/db';
	import Rating from './Rating.svelte';
	import RelativeTime from './relative-time/RelativeTime.svelte';

	let { data, showMovieDetails = true }: { data: MainRecord; showMovieDetails?: boolean } =
		$props();
</script>
<div class="w-full max-w-2xl p-6 backdrop-blur-sm">
	{#if showMovieDetails}
		<a
			href={data.record.item.ref === 'tmdb:m'
				? `/movie/${data.record.item.value}`
				: `/tv/${data.record.item.value}`}
			class="relative z-20 float-left mr-4 aspect-[2/3] h-44 w-auto shrink-0 overflow-hidden rounded-md border border-base-800 bg-base-900/50 transition-opacity duration-75 hover:opacity-80 group-hover:opacity-75"
		>
			{#if data.record.metadata?.poster_path}
				<img
					src="https://image.tmdb.org/t/p/w500{data.record.metadata.poster_path}"
					alt="movie poster for {data.record.metadata.title}"
					class="size-full object-cover object-center lg:size-full"
				/>
			{/if}
			<span class="sr-only">View {data.record.metadata?.title}</span>
		</a>
	{/if}

	<div class="flex flex-col gap-4">
		<a href={`/user/${data.author.handle}`} class="flex flex-row items-center gap-4 font-medium">
			<div class="flex items-center gap-2">
				{#if data.author.avatar}
					<img src={data.author.avatar} alt="user avatar" class="size-5 rounded-full" />
				{/if}
				<div class="text-md font-semibold">{data.author.displayName || data.author.handle}</div>
			</div>
			<div class="text-sm text-base-500">
				<RelativeTime date={new Date(data.updatedAt)} locale="en-US" />
			</div>
		</a>

		<div class="flex flex-col gap-4">
			<div class="flex flex-col {data.record.note?.value ? 'sm:flex-row sm:items-center' : ''} gap-4">
				{#if showMovieDetails}
					<a
						href={data.record.item.ref === 'tmdb:m'
							? `/movie/${data.record.item.value}`
							: `/tv/${data.record.item.value}`}
						class="text-2xl font-bold hover:text-accent-200"
					>
						{data.record.metadata?.title}
					</a>
				{/if}
				{#if data.record.rating?.value}
					<Rating rating={data.record.rating?.value / 2} size={data.record.note?.value ? 'size-6' : 'size-6'} />
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
