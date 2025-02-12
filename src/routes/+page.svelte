<script>
	import BaseHeadTags from '$lib/Components/Layout/BaseHeadTags.svelte';
	import Container from '$lib/Components/Layout/Container.svelte';
	import ReviewList from '$lib/Components/Items/ReviewList.svelte';
	import { rateMovieModal, showLoginModal } from '$lib/state/modals.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>skywatched</title>
</svelte:head>

<BaseHeadTags />

<Container class="relative z-10 w-full">
	<div class="max-w-8xl mx-auto flex w-full flex-col md:flex-col">
		<div class="mx-auto flex w-full max-w-2xl grow flex-col gap-4 py-8">
			<h1 class="px-4 pb-4 text-2xl font-bold">Recent reviews</h1>

			{#if data.feed.length > 0}
				<ReviewList reviews={data.feed} />
			{/if}
		</div>

		<div
			class="md:max-w-84 order-first flex h-96 flex-col items-center justify-center px-8 text-base-100"
		>
			<h1
				class="text-balance text-3xl font-semibold tracking-tight sm:text-5xl flex items-start gap-3"
			>
				skywatched

				<span
					class="inline-flex w-fit items-center tracking-normal rounded-xl border border-accent-500/20 bg-accent-700/10 px-2 py-1 text-xs font-normal text-accent-400 shadow-sm transition-all duration-100"
				>
					public alpha
				</span>
			</h1>
			<p class="text-md mt-8 max-w-xs text-pretty text-center font-medium text-base-300 sm:text-lg">
				review movies and shows with your friends from bluesky.
			</p>
			{#if !data.user}
				<button
					onclick={() => {
						showLoginModal.toggle();
					}}
					type="button"
					class="mt-8 inline-flex w-fit items-center gap-x-1.5 rounded-xl border border-accent-500/30 bg-accent-700/20 px-3 py-2 text-sm font-semibold text-accent-400 shadow-sm transition-all duration-100 hover:bg-accent-700/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
				>
					Sign in with Bluesky
				</button>
			{:else}
				<button
					onclick={() => {
						rateMovieModal.showEmpty();
					}}
					type="button"
					class="mt-8 inline-flex w-fit items-center gap-x-1.5 rounded-xl border border-accent-500/30 bg-accent-700/20 px-3 py-2 text-sm font-semibold text-accent-400 shadow-sm transition-all duration-100 hover:bg-accent-700/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
				>
					New review
				</button>
			{/if}
		</div>
	</div>
</Container>
