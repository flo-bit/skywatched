<script lang="ts">
	import ReviewCard from '$lib/Components/ReviewCard.svelte';
	import Container from '$lib/Components/Container.svelte';
	import { page } from '$app/stores';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.record.author.displayName || data.record.author.handle}'s review | skywatched</title>

	<meta
		name="description"
		content="{data.record.author.displayName || data.record.author.handle} reviewed {data.record
			.record.metadata?.title ?? ''} on skywatched"
	/>

	<meta property="og:url" content={$page.url.href} />
	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content="{data.record.author.displayName || data.record.author.handle}'s review | skywatched"
	/>
	<meta
		property="og:description"
		content="{data.record.author.displayName || data.record.author.handle} reviewed {data.record
			.record.metadata?.title ?? ''} on skywatched"
	/>
	<meta property="og:image" content="{$page.url.href}/og.png" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="skywatched.app" />
	<meta property="twitter:url" content={$page.url.href} />
	<meta
		name="twitter:title"
		content="{data.record.author.displayName || data.record.author.handle}'s review | skywatched"
	/>
	<meta
		name="twitter:description"
		content="{data.record.author.displayName || data.record.author.handle} reviewed {data.record
			.record.metadata?.title ?? ''} on skywatched"
	/>
	<meta name="twitter:image" content="{$page.url.href}/og.png" />
</svelte:head>

{#if data.record.record.metadata?.backdrop_path}
	<img
		src="https://image.tmdb.org/t/p/w780{data.record.record.metadata.backdrop_path}"
		alt=""
		class="fixed h-full w-full object-cover object-center opacity-20"
	/>
{/if}

<div class="fixed inset-0 h-full w-full bg-black/50"></div>

<Container class="z-10 flex h-screen flex-col items-center justify-center">
	<ReviewCard data={data.record} />

	<div class="flex flex-wrap items-center justify-center gap-4">
		<div
			class="z-10 rounded-lg border border-base-700 bg-base-50/5 px-3 py-2 text-xs font-medium text-base-200 transition-all duration-100 hover:bg-base-50/10"
		>
			<a
				href={`/${data.record.record.item.ref === 'tmdb:m' ? 'movie' : 'tv'}/${data.record.record.item.value}`}
			>
				see {data.record.record.item.ref === 'tmdb:m' ? 'movie' : 'show'} details
			</a>
		</div>
		<div
			class="z-10 rounded-lg border border-base-700 bg-base-50/5 px-3 py-2 text-xs font-medium text-base-200 transition-all duration-100 hover:bg-base-50/10"
		>
			<a href={`/user/${data.record.author.handle}`}>
				all reviews by {data.record.author.displayName || data.record.author.handle}
			</a>
		</div>
	</div>
</Container>
