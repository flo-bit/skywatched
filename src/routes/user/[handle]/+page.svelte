<script lang="ts">
	import { getFollows } from '$lib/bluesky.js';
	import Avatar from '$lib/Components/User/Avatar.svelte';
	import BaseHeadTags from '$lib/Components/Layout/BaseHeadTags.svelte';
	import Container from '$lib/Components/Layout/Container.svelte';
	import Profile from '$lib/Components/User/Profile.svelte';
	import ReviewList from '$lib/Components/Items/ReviewList.svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.profile.displayName || data.profile.handle}'s reviews</title>
</svelte:head>

<BaseHeadTags />

<Container class="max-w-full lg:max-w-full">
	<div class={'group flex-row'}>
		<Profile profile={data.profile} />
	</div>
	{#if data.isUser}
		<div class="text-center">
			<a
				href={'/logout/'}
				class="button position-relative align-items-center w-full flex-row-reverse justify-center rounded-xl bg-accent-500 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-sm hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
				>logout</a
			>
		</div>
	{:else if data.isfollowed}
		<div class="text-center">
			<a
				href={'/logout/'}
				class="button w-full flex-row-reverse justify-end rounded-xl bg-accent-500 px-3 py-1.5 text-center text-sm/6 font-semibold text-white shadow-sm hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
				>logout</a
			>
		</div>
	{:else}
		<div class="text-center">
			<button
				class="danger lg justify-center rounded-xl bg-accent-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
				onclick={async () => {
					if (data.isfollowed) return;

					data.isfollowed = true;

					try {
						const response = await fetch('/api/follow', {
							method: 'POST',
							body: JSON.stringify({ did: data.did })
						});
						if (response.ok) {
							toast.success('Liked');
						} else {
							toast.error('must be logged in to like');
							data.isfollowed = false;
						}
					} catch (e) {
						console.error(e);
						toast.error('must be logged in to like');
						data.isfollowed = false;
					}
				}}
			>
				Follow
			</button>
		</div>
	{/if}
	{#if data.items.length > 0}
		<p
			class="max-w-full truncate text-center text-lg font-bold text-base-900 dark:text-base-100 sm:text-xl"
		>
			Follows
		</p>
		<div class={'mx-auto mt-8 flex max-w-2xl gap-x-6 overflow-x-auto'}>
			{#each data.follows.follows as castMember}
				{#if castMember.did}
					<a href={`/user/` + castMember.handle} class="flex flex-col items-center gap-1">
						<Avatar src={castMember.avatar ? castMember.avatar : undefined} size="size-16" />
						<div class="text-center text-xs font-medium">{castMember.displayName}</div>
						<div class="text-center text-xs text-base-400">{castMember.handle}</div>
					</a>
				{/if}
			{/each}
		</div>
		<p
			class="max-w-full truncate text-center text-lg font-bold text-base-900 dark:text-base-100 sm:text-xl"
		>
			Reviews
		</p>
		<div><ReviewList reviews={data.items} class="mx-auto mt-8 max-w-2xl" /></div>
	{:else}
		<p class="py-8 text-center text-base-500">No movies or tv shows rated yet.</p>
	{/if}
</Container>
