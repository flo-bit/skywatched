<script lang="ts">
	import { onMount } from 'svelte';
	import ReviewCard from '$lib/Components/ReviewCard.svelte';
	import Container from '$lib/Components/Container.svelte';

	let { data } = $props();
</script>

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

	<div
		class="z-10 rounded-lg border border-base-700 bg-base-50/5 px-3 py-2 text-xs font-medium text-base-200 transition-all duration-100 hover:bg-base-50/10"
	>
		<a href={`/user/${data.record.author.handle}`}>
			all reviews by {data.record.author.displayName || data.record.author.handle}
		</a>
	</div>
</Container>
