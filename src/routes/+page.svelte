<script>
	import Container from '$lib/Components/Container.svelte';
	import ReviewList from '$lib/Components/ReviewList.svelte';
	import { rateMovieModal, showLoginModal } from '$lib/state.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>skywatched</title>
</svelte:head>

<Container class="max-w-8xl relative z-10 w-full md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
	<div class="max-w-8xl mx-auto flex w-full flex-col md:flex-row">
		<div class="flex grow flex-col gap-4 py-8 md:border-r border-base-900">
			<h1 class="text-balance px-8 text-3xl pb-6 font-semibold tracking-tight text-base-100">
				Recent reviews
			</h1>
			{#if data.feed.length > 0}
				<ReviewList reviews={data.feed}/>
			{/if}
		</div>

		<div class="order-first md:order-last px-8 text-base-100 h-96 md:h-screen flex flex-col items-center justify-center md:max-w-84">
			<h1 class="tracking-tight font-semibold text-balance text-3xl sm:text-5xl">skywatched</h1>
			<p class="text-md mt-8 text-pretty font-medium text-center text-base-300 sm:text-lg max-w-xs">
				review movies and shows with your bluesky friends.
			</p>
			{#if !data.user}
				<button
					onclick={() => {
						showLoginModal.toggle();
					}}
					type="button"
					class="mt-8 inline-flex w-fit items-center gap-x-1.5 rounded-md border border-accent-500/30 bg-accent-700/20 px-3 py-2 text-sm font-semibold text-accent-400 shadow-sm transition-all duration-100 hover:bg-accent-700/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
				>
					Sign in with Bluesky
				</button>
			{:else}
				<button
					onclick={() => {
						rateMovieModal.showEmpty();
					}}
					type="button"
					class="mt-8 inline-flex w-fit items-center gap-x-1.5 rounded-md border border-accent-500/30 bg-accent-700/20 px-3 py-2 text-sm font-semibold text-accent-400 shadow-sm transition-all duration-100 hover:bg-accent-700/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
				>
					New review
				</button>
			{/if}
		</div>
	</div>
</Container>
