<script lang="ts">
	import Container from '$lib/Components/Container.svelte';
	import ItemsGrid from '$lib/Components/ItemsGrid.svelte';

	let { data } = $props();
</script>

<Container>
	<h1 class="my-8 text-4xl font-bold tracking-tight text-base-50">{data.username}'s page</h1>

	{#if data.isUser}
		<a
			class="text-md rounded-md bg-white/10 px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-white/20"
			href="/search"
		>
			add movie or show
		</a>
	{/if}

	<ItemsGrid
		class="mt-8"
		items={data.items.map((movie) => ({
			poster_path: movie.posterPath ?? '',
			original_title: movie.originalTitle,
			movieId: movie.movieId ?? undefined,
			showId: movie.showId ?? undefined,
			rating: movie.rating ?? undefined,
			ratingText: movie.ratingText ?? undefined
		}))}
	/>
</Container>
