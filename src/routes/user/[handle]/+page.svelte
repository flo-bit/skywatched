<script lang="ts">
	import { getFollows } from '$lib/bluesky.js';
	import Avatar from '$lib/Components/Avatar.svelte';
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

<Container class="max-w-full lg:max-w-full">
	
		<Profile profile={data.profile} />
		{#if data.isUser}
		<a href={"/logout/"} class="button flex w-full justify-center rounded-xl bg-accent-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500">logout</a>
		
		{/if}
	
	{#if data.items.length > 0}
	<div class={'flex gap-x-6 overflow-x-auto mx-auto mt-8 max-w-2xl'}>

		{#each data.follows.follows as castMember}
			{#if castMember.did}
			<a
				href={`/user/`+castMember.handle}
				class="flex flex-col items-center gap-1"
			>
				<Avatar
					src={castMember.avatar
						? castMember.avatar
						: undefined}
					size="size-32"
				/>
				<div class="text-center text-xs font-medium">{castMember.displayName}</div>
				<div class="text-center text-xs text-base-400">{castMember.handle}</div>
			</a>
			{/if}
			
		{/each}
		</div>
		<div><ReviewList reviews={data.items} class="mx-auto mt-8 max-w-2xl" /></div>
		

		
	{:else}
		<p class="py-8 text-center text-base-500">No movies or tv shows rated yet.</p>
	{/if}
</Container>


