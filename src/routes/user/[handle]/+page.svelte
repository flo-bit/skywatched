<script lang="ts">
	import Avatar from '$lib/Components/User/Avatar.svelte';
	import BaseHeadTags from '$lib/Components/Layout/BaseHeadTags.svelte';
	import Container from '$lib/Components/Layout/Container.svelte';
	import Profile from '$lib/Components/User/Profile.svelte';
	import ReviewList from '$lib/Components/Items/ReviewList.svelte';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils.js';

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
		<div class="mx-auto mt-2 flex max-w-2xl px-4 sm:-mt-24 sm:justify-end sm:px-0">
			<form class="space-y-6" action="/?/logout" method="POST">
				<button
					type="submit"
					class={cn(
						'inline-flex justify-center rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-base-50 shadow-sm ring-1 ring-inset ring-base-300/20 hover:bg-base-50/20',
						data.profile.banner ? 'mt-6' : 'mt-3'
					)}
				>
					<span>Logout</span>
				</button>
			</form>
		</div>
	{:else if data.user}
		<div class="mx-auto mt-2 flex max-w-2xl px-4 sm:-mt-24 sm:justify-end sm:px-0">
			<button
				type="button"
				onclick={async () => {
					if (data.following) return;

					data.following = true;

					try {
						const response = await fetch('/api/follow', {
							method: 'POST',
							body: JSON.stringify({ did: data.did })
						});
						if (response.ok) {
							toast.success('Followed');
						} else {
							toast.error('You must be logged in to follow');
							data.following = false;
						}
					} catch (e) {
						console.error(e);
						toast.error('Must be logged in to follow');

						data.following = false;
					}
				}}
				class={cn(
					'inline-flex justify-center rounded-xl bg-accent-500/10 px-3 py-2 text-sm font-semibold text-accent-400 shadow-sm ring-1 ring-inset ring-accent-300/20 hover:bg-accent-400/20',
					data.profile.banner ? 'mt-6' : 'mt-3',
					data.following ? 'bg-accent-500/10' : ''
				)}
			>
				<span>{data.following ? 'Following' : 'Follow'}</span>
			</button>
		</div>
	{/if}

	{#if data.isUser && data.follows}
		<p
			class="mx-auto mt-16 max-w-2xl truncate px-4 text-lg font-bold text-base-900 dark:text-base-100 sm:text-xl"
		>
			People you follow
		</p>
		<div class="mx-auto mt-4 flex max-w-2xl gap-x-6 overflow-x-auto px-4">
			{#each data.follows as profile}
				{#if profile.did}
					<a href={`/user/` + profile.handle} class="flex flex-col items-center gap-1">
						<Avatar src={profile.avatar ? profile.avatar : undefined} size="size-16" />
						<div class="text-center text-xs font-medium">{profile.displayName}</div>
						<div class="text-center text-xs text-base-400">{profile.handle}</div>
					</a>
				{/if}
			{/each}
		</div>
	{/if}
	{#if data.items.length > 0}
		<p
			class="mx-auto mt-16 max-w-2xl truncate px-4 text-lg font-bold text-base-900 dark:text-base-100 sm:text-xl"
		>
			Reviews
		</p>
		<div><ReviewList reviews={data.items} class="mx-auto mt-2 max-w-2xl" /></div>
	{:else}
		<p class="py-8 text-center text-base-500">No movies or tv shows rated yet.</p>
	{/if}
</Container>
