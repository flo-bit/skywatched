<script lang="ts">
	import BaseHeadTags from '$lib/Components/BaseHeadTags.svelte';
	import Container from '$lib/Components/Container.svelte';
	import Profile from '$lib/Components/Profile.svelte';
	import ReviewList from '$lib/Components/ReviewList.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.profile.displayName || data.profile.handle}'s reviews</title>
</svelte:head>

<BaseHeadTags />

<Container>
	<Profile profile={data.profile} />

	{#if data.items.length > 0}
		<ReviewList reviews={data.items} class="mx-auto mt-8 max-w-2xl" />
	{:else}
		<p class="py-8 text-center text-base-500">No movies or tv shows rated yet.</p>
	{/if}
</Container>
