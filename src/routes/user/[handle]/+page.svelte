<script lang="ts">
	import BaseHeadTags from '$lib/Components/Layout/BaseHeadTags.svelte';
	import Container from '$lib/Components/Layout/Container.svelte';
	import Profile from '$lib/Components/User/Profile.svelte';
	import ReviewList from '$lib/Components/Items/ReviewList.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.profile.displayName || data.profile.handle}'s reviews</title>
</svelte:head>

<BaseHeadTags />

<Container class="max-w-full lg:max-w-full">
	<Profile profile={data.profile} />

	{#if data.items.length > 0}
		<ReviewList reviews={data.items} class="mx-auto mt-8 max-w-2xl" />
	{:else}
		<p class="py-8 text-center text-base-500">No movies or tv shows rated yet.</p>
	{/if}
</Container>
