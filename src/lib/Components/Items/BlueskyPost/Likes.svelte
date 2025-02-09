<script lang="ts">
	import { onMount } from 'svelte';
	import { getUserPosts, getLikes, getPost } from './utils';

	const { uri, likesData, user, url } = $props();

	let postUri = $state(uri);
	let postLikesCount = $state(likesData.length);
	let postLikesData = $state(likesData.filter((like: any) => like.actor.avatar));

	onMount(async () => {
		if (!uri && user) {
			let posts = await getUserPosts(user);

			// @ts-expect-error: weird type fuckery
			const post = posts.find((post) => post.post.embed?.external?.uri === url);

			if (post) {
				postUri = post.post.uri;
				postLikesCount = post.post.likeCount;

				postLikesData = (await getLikes(post.post.uri)).filter((like) => like.actor.avatar);
			}
		} else if (uri) {
			postLikesData = (await getLikes(uri)).filter((like) => like.actor.avatar);

			console.log(postLikesData);
			const post = await getPost(uri);

			if (post) {
				postUri = post.uri;
				postLikesCount = post.likeCount;
			}
		}
	});
</script>

{#if postUri}
	<div class="not-prose flex flex-col gap-4">
		<div class="text-base-950 dark:text-base-100 text-sm font-semibold">
			{postLikesCount} like{postLikesCount === 1 ? '' : 's'}
		</div>

		<div class="isolate flex flex-wrap -space-x-2 overflow-hidden px-4">
			{#each postLikesData as user, index}
				<a
					href={`https://bsky.app/profile/${user.actor.handle}`}
					class={[
						'ring-base-50 dark:ring-base-900 bg-base-950 relative inline-block size-12 overflow-hidden rounded-full  ring-2',
						index === 0 ? '-ml-2' : ''
					]}
					target="_blank"
				>
					<img
						title={user.actor.handle}
						loading="lazy"
						src={user.actor.avatar.replace('avatar', 'avatar_thumbnail')}
						alt={'liked by ' + user.actor.displayName}
					/>
				</a>
			{/each}

			{#if postLikesData.length < postLikesCount}
				<div
					class="text-accent-700 dark:text-accent-300 bg-accent-100 dark:bg-accent-950 ring-base-50 dark:ring-base-900 z-10 mb-4 flex size-12 items-center justify-center rounded-full text-sm font-semibold ring-2"
				>
					+{postLikesCount - postLikesData.length}
				</div>
			{/if}
		</div>
	</div>
{/if}
