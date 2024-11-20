<script lang="ts">
	import Container from '$lib/Components/Container.svelte';
	import MovieList from '$lib/Components/MovieList.svelte';

	let { data } = $props();
	console.log(data);
</script>

<Container>
	<h1 class="my-8 text-4xl font-bold tracking-tight text-base-50">{data.username}'s page</h1>

	{#if data.isUser}
		<a
			class="text-md rounded-md bg-white/10 px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-white/20"
			href="/search"
		>
			add movie
		</a>
	{/if}

	<MovieList
		class="mt-8"
		movies={data.movies.map((movie) => ({
			poster_path: movie.posterPath ?? '',
			original_title: movie.originalTitle,
			id: movie.id
		}))}
	/>
</Container>
