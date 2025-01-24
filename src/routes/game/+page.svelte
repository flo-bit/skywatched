<script lang="ts">
	import { type PageData } from './$types';
	import { cn, nameToId } from '$lib/utils';
	import { rateMovieModal, videoPlayer, watchedItems } from '$lib/state.svelte';

	import Container from '$lib/Components/Container.svelte';
	import ItemsList from '$lib/Components/ItemsList.svelte';
	import ReviewList from '$lib/Components/ReviewList.svelte';
	import Avatar from '$lib/Components/Avatar.svelte';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.result.title ?? data.result.name ?? ''} | skywatched</title>

	<meta
		name="description"
		content={`Rate and review "${data.result.title ?? data.result.name ?? ''}" on skywatched`}
	/>

	<meta property="og:url" content={$page.url.href} />
	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content="{data.result.title ?? data.result.name ?? ''} | skywatched.app"
	/>
	<meta
		property="og:description"
		content={`Rate and review "${data.result.title ?? data.result.name ?? ''}" on skywatched`}
	/>
	<meta property="og:image" content="{$page.url.href}/og.png" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="skywatched.app" />
	<meta property="twitter:url" content={$page.url.href} />
	<meta
		name="twitter:title"
		content="{data.result.title ?? data.result.name ?? ''} | skywatched.app"
	/>
	<meta
		name="twitter:description"
		content={`Rate and review "${data.result.title ?? data.result.name ?? ''}" on skywatched`}
	/>
	<meta name="twitter:image" content="{$page.url.href}/og.png" />
</svelte:head>

{#snippet buttons()}
	{#if data.user && !watchedItems.hasRated(data.result)}
		<button
			class={cn(
				'inline-flex items-center gap-2 rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-75 hover:bg-white/20 ',
				watchedItems.hasRated(data.result)
					? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
					: ''
			)}
			onclick={() => {
				rateMovieModal.show({
					movieId: data.result.movieId,
					showId: data.result.showId,
					kind: data.result.movieId ? 'movie' : 'tv',
					name: data.result.original_title ?? data.result.original_name,
					posterPath: data.result.poster_path,
					currentRating: watchedItems.getRating(data.result)?.rating ?? 0,
					currentReview: watchedItems.getRating(data.result)?.ratingText ?? ''
				});
			}}
		>
			rate {data.kind === 'movie' ? 'movie' : 'show'}
		</button>
	{/if}
	{#if data.trailer}
		<button
			onclick={() => videoPlayer.show(data.trailer ?? '')}
			type="button"
			class="inline-flex w-fit items-center gap-x-1.5 rounded-md border border-accent-500/30 bg-accent-700/20 px-3 py-2 text-sm font-semibold text-accent-400 shadow-sm transition-all duration-100 hover:bg-accent-700/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="-ml-0.5 size-5"
			>
				<path
					d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z"
				/>
			</svg>

			Trailer
		</button>
	{/if}
{/snippet}

<img
	src="https://image.tmdb.org/t/p/w780{data.result.backdrop_path}"
	alt=""
	class="fixed h-full w-full object-cover object-center opacity-20"
/>
<div class="fixed inset-0 h-full w-full bg-black/50"></div>

<Container class="relative z-10 pb-8 pt-4">
	<div class="flex gap-4 px-4 pt-8">
		<img
			src="https://image.tmdb.org/t/p/w500{data.result.poster_path}"
			alt=""
			class="poster h-36 w-24 shrink-0 rounded-lg border border-white/10 sm:h-64 sm:w-44"
			style:--name={`poster-${data.result.id}`}
		/>
		<img
			src="https://image.tmdb.org/t/p/w500{data.result.poster_path}"
			alt=""
			class="poster h-36 w-24 shrink-0 rounded-lg border border-white/10 sm:h-64 sm:w-44"
			style:--name={`poster-${data.result.id}`}
		/>
		<div class="flex flex-col gap-4">
			<div
				class="title max-w-xl text-3xl font-semibold text-white sm:text-4xl"
				style:--name={`title-${data.result.id}`}
			>
				{data.result.title ?? data.result.name}
			</div>

			{#if data.settings?.streaming_region?.code && data.watchProviders[data.settings.streaming_region.code]?.flatrate}
				<div class="mt-2 text-sm text-white sm:mt-4">
					<div class="mb-2 flex flex-wrap gap-4 text-xs font-medium">
						stream on
						<span class="flex items-center gap-2 text-base-400"
							>from <a
								href="https://www.justwatch.com"
								target="_blank"
								class="text-base-300 hover:text-accent-300"
							>
								<img src="/justwatch_logo.svg" alt="justwatch" class="h-3" />
							</a></span
						>
					</div>
					<a
						href={data.watchProviders[data.settings.streaming_region.code].link}
						target="_blank"
						class="flex flex-wrap gap-2"
					>
						{#each data.watchProviders[data.settings.streaming_region.code].flatrate as provider}
							<img
								src="https://image.tmdb.org/t/p/w500{provider.logo_path}"
								alt={provider.provider_name}
								class="size-8 rounded-md border border-base-800 md:size-12"
							/>
						{/each}
					</a>
				</div>
			{/if}
			<div class="hidden gap-2 sm:flex">
				{@render buttons()}
			</div>
		</div>
	</div>

	<div class="px-4 pt-4 text-sm text-white">
		<div class="mb-4 flex gap-2 sm:hidden">
			{@render buttons()}
		</div>
		<div class="mb-4 max-w-2xl text-sm text-white">
			<div class="mb-2 text-lg font-semibold">overview</div>
			{data.result.overview}
		</div>
	</div>

	{#if data.ratings.length > 0}
		<div class="mt-8 px-4 text-lg font-semibold">reviews</div>

		<ReviewList reviews={data.ratings} showMovieDetails={false} class="" />
	{/if}

	{#if data.recommendations.length > 0}
		<div class="px-4 pt-4 text-sm text-white">
			<div class="mb-2 text-lg font-semibold">recommendations</div>

			<ItemsList items={data.recommendations} showMark={!!data.user} />
		</div>
	{/if}

	{#if data.cast.length > 0}
		<div class="flex px-4 pb-8 pt-4 text-sm text-white">
			<div class="mb-2 text-lg font-semibold">cast</div>

			<div class={'flex gap-x-6 overflow-x-auto'}>
				{#each data.cast as castMember}
					<a
						href={`/cast/${castMember.id}-${nameToId(castMember.name)}`}
						class="flex flex-col items-center gap-1"
					>
						<Avatar
							src={castMember.profile_path
								? 'https://image.tmdb.org/t/p/w500' + castMember.profile_path
								: undefined}
							size="size-32"
						/>
						<div class="text-center text-xs font-medium">{castMember.name}</div>
						<div class="text-center text-xs text-base-400">{castMember.character}</div>
					</a>
				{/each}
			</div>
			<div class={'flex gap-x-6 overflow-x-auto'}>
				{#each data.cast as castMember}
					<a
						href={`/cast/${castMember.id}-${nameToId(castMember.name)}`}
						class="flex flex-col items-center gap-1"
					>
						<Avatar
							src={castMember.profile_path
								? 'https://image.tmdb.org/t/p/w500' + castMember.profile_path
								: undefined}
							size="size-32"
						/>
						<div class="text-center text-xs font-medium">{castMember.name}</div>
						<div class="text-center text-xs text-base-400">{castMember.character}</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}
</Container>
