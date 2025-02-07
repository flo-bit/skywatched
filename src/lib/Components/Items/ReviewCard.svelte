<script lang="ts">
	import type { MainRecord } from '$lib/db';
	import { toast } from 'svelte-sonner';

	import Rating from './Rating.svelte';
	import RelativeTime from '$lib/Components/Utils/relative-time/RelativeTime.svelte';
	import OptionButton from '$lib/Components/Modals/OptionMenu.svelte';

	import { cn, nameToId } from '$lib/utils';

	let { data, showMovieDetails = true, bigText = false }: { data: MainRecord; showMovieDetails?: boolean; bigText?: boolean } =
		$props();

	let isLiked = $state(false);
</script>

<div class="relative w-full max-w-2xl p-4 backdrop-blur-sm">
	<div class="flex max-w-full items-center gap-4 overflow-hidden">
		{#if showMovieDetails}
			<a
				href={data.record.item.ref === 'tmdb:m'
					? `/movie/${data.record.item.value}-${nameToId(data.record.metadata?.title ?? '')}`
					: `/tv/${data.record.item.value}-${nameToId(data.record.metadata?.title ?? '')}`}
				class="relative z-20 mr-4 aspect-[2/3] h-32 w-auto shrink-0 overflow-hidden rounded-md border border-base-800 bg-base-900/50 transition-opacity duration-75 hover:opacity-80 group-hover:opacity-75"
			>
				{#if data.record.metadata?.poster_path}
					<img
						src="https://image.tmdb.org/t/p/w154{data.record.metadata.poster_path}"
						alt="movie poster for {data.record.metadata.title}"
						class="poster size-full object-cover object-center lg:size-full"
						style:--name={`poster-${data.record.item.ref}-${data.record.item.value}`}
						loading="lazy"
					/>
				{/if}
				<span class="sr-only">View {data.record.metadata?.title}</span>
			</a>
		{/if}

		<div class="flex flex-col gap-3">
			<a
				href={`/user/${data.author.handle}`}
				class="z-20 flex flex-row items-center gap-4 overflow-hidden font-medium"
			>
				<div class="flex items-center gap-2">
					{#if data.author.avatar}
						<img
							src={data.author.avatar.replace('avatar', 'avatar_thumbnail')}
							alt="user avatar"
							loading="lazy"
							class="size-6 rounded-full"
						/>
					{/if}
					<div class="truncate text-sm font-medium">
						{data.author.displayName || data.author.handle}
					</div>
				</div>
				<div class="shrink-0 pr-2 text-sm text-base-400 font-normal">
					<RelativeTime date={new Date(data.updatedAt)} locale="en-US" />
				</div>
			</a>

			<div class="flex flex-col gap-3">
				{#if showMovieDetails}
					<a
						href={data.record.item.ref === 'tmdb:m'
							? `/movie/${data.record.item.value}-${nameToId(data.record.metadata?.title ?? '')}`
							: `/tv/${data.record.item.value}-${nameToId(data.record.metadata?.title ?? '')}`}
						class="title z-20 text-2xl font-bold hover:text-accent-200"
						style:--name={`title-${data.record.item.value}`}
					>
						{data.record.metadata?.title}
					</a>
				{/if}
				{#if data.record.rating?.value}
					<a href={`/review/${encodeURIComponent(data.uri)}`}>
						<Rating rating={data.record.rating?.value / 2} size={'size-6'} />
						<span class="sr-only">View review</span>
					</a>
				{/if}

				<!-- <button
					onclick={() => {
						crosspostModal.show(
							data.uri,
							data.record.note?.value ?? '',
							(data.record.rating?.value ?? 0) / 2,
							data.record.metadata?.title ?? ''
						);
					}}
				>
					crosspost
				</button> -->
			</div>
		</div>
	</div>

	{#if data.record.note?.value}
		<div class={cn("mt-4 text-sm text-base-300", bigText ? 'text-xl text-base-100' : '')}>
			{@html data.record.note?.value?.replace('\n', '<br /><br />')}
		</div>
	{/if}

	<div class="mt-6 flex justify-between gap-2 text-base-500 dark:text-base-400">
		<!-- <button class="group inline-flex items-center gap-2 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="-m-1.5 size-7 rounded-full p-1.5 transition-all duration-100 group-hover:bg-amber-500/10 group-hover:text-amber-700 dark:group-hover:text-amber-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
          {#if data.post.replyCount}
            {numberToHumanReadable(data.post.replyCount)}
          {/if}
        </button> -->

		<button
			class="group inline-flex items-center gap-2 text-sm"
			onclick={async () => {
				if (isLiked) return;

				isLiked = true;

				try {
					const response = await fetch('/api/like', {
						method: 'POST',
						body: JSON.stringify({ cid: data.cid, uri: data.uri })
					});
					if (response.ok) {
						toast.success('Liked');
					} else {
						toast.error('must be logged in to like');
						isLiked = false;
					}
				} catch (e) {
					console.error(e);
					toast.error('must be logged in to like');
					isLiked = false;
				}
			}}
		>
			{#if isLiked}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="-m-1.5 size-7 rounded-full p-1.5 transition-all duration-100 group-hover:bg-accent-500/10 group-hover:text-accent-700 dark:group-hover:text-accent-400"
				>
					<path
						d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="-m-1.5 size-7 rounded-full p-1.5 transition-all duration-100 group-hover:bg-accent-500/10 group-hover:text-accent-700 dark:group-hover:text-accent-400"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
					/>
				</svg>
			{/if}
			{(data.record.likes ?? 0) + (isLiked ? 1 : 0)}
		</button>

		<OptionButton data={data} />
	</div>

	<!-- <a href={`/review/${encodeURIComponent(data.uri)}`}>
		<span class="absolute inset-0 z-10 hover:bg-accent-500/10"></span>
	</a> -->
</div>
