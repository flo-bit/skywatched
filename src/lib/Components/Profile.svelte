<script lang="ts">
	import type { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
	import Avatar from './Avatar.svelte';
	import { cn } from '$lib/utils';

	let { profile }: { profile: ProfileViewDetailed } = $props();
</script>

{#if profile}
	<div class="sm:py-6">
		<div>
			{#if profile.banner}
				<img
					class="aspect-[3/1] w-full border-b border-base-800 object-cover sm:rounded-xl sm:border"
					src={profile.banner}
					alt=""
				/>
			{:else}
				<div class="aspect-[8/1] w-full"></div>
			{/if}
		</div>
		<div class={cn(profile.banner ? '-mt-11' : '-mt-8', "sm:-mt-16 flex items-end space-x-5 px-4 sm:px-6 lg:px-8")}>
			<Avatar src={profile.avatar} size="size-24 sm:size-32" />
			<div
				class="flex min-w-0 flex-1 flex-row sm:flex-row sm:items-center sm:justify-end sm:space-x-6 sm:pb-1"
			>
				<div
					class={cn(profile.banner ? 'mt-4 sm:mt-0' : '-mt-[4.5rem] sm:-mt-[6.5rem]', "flex min-w-0 flex-1 flex-col items-baseline")}
				>
					<h1 class="truncate text-xl font-bold text-base-900 dark:text-base-100">
						{profile.displayName || profile.handle}
					</h1>
					<div class="text-sm truncate text-base-900 dark:text-base-400">
						@{profile.handle}
					</div>
				</div>
				<div class="mt-6 hidden flex-row justify-stretch space-x-4 space-y-0">
					<button
						type="button"
						class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-base-900 shadow-sm ring-1 ring-inset ring-base-300 hover:bg-base-50"
					>
						<span>Call</span>
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
