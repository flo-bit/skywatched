<script lang="ts">
	import { type PageData } from './$types';
	import { cn, nameToId } from '$lib/utils';

	import Container from '$lib/Components/Layout/Container.svelte';
	import Avatar from '$lib/Components/User/Avatar.svelte';
	import { page } from '$app/stores';
	import { watchedItems } from '$lib/state/user.svelte';
	import { rateMovieModal } from '$lib/state/modals.svelte';

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
{/snippet}

<div class="fixed inset-0 h-full w-full bg-black/50"></div>

<Container class="relative z-10 pb-8 pt-4">
	<div class="flex justify-center gap-4 px-4 pt-8">
		<div class="flex-column">
			{#if data.kind === 'cast'}
				<div class="text-center text-sm font-medium">Cast1</div>
				<Avatar
					src={data.personDetails.profile_path
						? 'https://image.tmdb.org/t/p/w500' + data.personDetails.profile_path
						: undefined}
					size="size-44"
				/>
			{:else}
				<div class="text-center text-sm font-medium">Movie1</div>
				<img
					src="https://image.tmdb.org/t/p/w500{data.result.poster_path}"
					alt=""
					class="poster h-36 w-24 shrink-0 rounded-lg border border-white/10 sm:h-64 sm:w-44"
					style:--name={`poster-${data.result.id}`}
				/>
			{/if}
		</div>
		<div class="flex-column">
			{#if data.kind2 === 'cast'}
				<div class="text-center text-sm font-medium">Cast2</div>
				<Avatar
					src={data.person2Details.profile_path
						? 'https://image.tmdb.org/t/p/w500' + data.person2Details.profile_path
						: undefined}
					size="size-44"
				/>
			{:else}
				<div class="text-center text-sm font-medium">Movie2</div>
				<img
					src="https://image.tmdb.org/t/p/w500{data.result2.poster_path}"
					alt=""
					class="poster h-36 w-24 shrink-0 rounded-lg border border-white/10 sm:h-64 sm:w-44"
					style:--name={`poster-${data.result2.id}`}
				/>
			{/if}
		</div>
	</div>

	<div class="px-4 pt-4 text-sm text-white">
		<div class="mb-4 flex gap-2 sm:hidden">
			{@render buttons()}
		</div>
	</div>

	{#if data.cast.length > 0}
		<div class="flex flex-col gap-x-6 px-4 pb-8 pt-4 text-sm text-white">
			{#if data.kind === 'cast'}
				<div class="text-center text-sm font-medium">Movies of {data.personDetails.name}</div>
				<div class={cn('flex justify-start gap-x-6 overflow-x-auto')}>
					{#each data.combinedCredits as castMember}
						<a
							href={`/game/movie/${castMember.id}-${castMember.title ?? castMember.name}/${data.kind2}/${data.ids2}-/${parseInt(data.couter) + 1}`}
							class="flex flex-col items-center gap-1"
						>
							<img
								src="https://image.tmdb.org/t/p/w342{castMember.poster_path}"
								alt="movie poster for {castMember.title ?? castMember.name}"
								class="poster size-32 w-32 object-cover object-center lg:size-full"
							/>
							<div class="size-32 text-center text-sm font-medium">
								{castMember.title ?? castMember.name}
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="text-center text-sm font-medium">cast of {data.result.title}</div>
				<div class={'justify-left flex gap-x-6 overflow-x-auto'}>
					{#each data.cast as castMember}
						<a
							href={`/game/cast/${castMember.id}-${nameToId(castMember.name)}/${data.kind2}/${data.ids2}-/${parseInt(data.couter) + 1}`}
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
			{/if}
			{#if data.kind2 === 'cast'}
				<div class="text-center text-sm font-medium">Movies of {data.person2Details.name}</div>
				<div class={cn('flex gap-x-6 overflow-x-auto')}>
					{#each data.combinedCredits2 as castMember}
						<a
							href={`/game/${data.kind}/${data.ids}-/movie/${castMember.id}-${castMember.title ?? castMember.name}/${parseInt(data.couter) + 1}`}
							class="flex flex-col items-center gap-1"
						>
							<img
								src="https://image.tmdb.org/t/p/w342{castMember.poster_path}"
								alt="movie poster for {castMember.title ?? castMember.name}"
								class="poster w-500 object-cover object-center lg:size-full"
							/>
							<div class="size-32 text-center text-sm font-medium">
								{castMember.title ?? castMember.name}
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="text-center text-sm font-medium">Cast of {data.result2.title}</div>
				<div class={'justify-right flex gap-x-6 overflow-x-auto'}>
					{#each data.cast2 as castMember}
						<a
							href={`/game/${data.kind}/${data.ids}-/cast/${castMember.id}-${castMember.title ?? castMember.name}/${parseInt(data.couter) + 1}`}
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
			{/if}
		</div>
	{/if}
</Container>
