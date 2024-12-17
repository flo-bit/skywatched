<script lang="ts">
	import { showLoginModal } from '$lib/state.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		user?: {
			avatar?: string;
			handle?: string;
		};
	};

	const { user }: Props = $props();
</script>

{#snippet renderUser()}
	<span class="sr-only">Open user menu</span>
	<div
		class={cn(
			'size-8 overflow-hidden rounded-full border border-base-400/50 bg-base-100 transition-colors duration-100 hover:border-accent-400 hover:border-[1.5px] dark:border-base-700 dark:bg-base-800',
			false
				? 'border-accent-300/50 bg-accent-100/50 dark:border-accent-500/50 dark:bg-accent-800/50'
				: ''
		)}
	>
		{#if user?.avatar}
			<img loading="lazy" class="h-full w-full object-cover" src={user.avatar} alt="" />
		{:else}
			<svg
				class={cn(
					'size-full text-base-300 dark:text-base-600',
					user ? 'text-accent-300 dark:text-accent-500' : ''
				)}
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		{/if}
	</div>
{/snippet}

<div class="relative">
	{#if user}
		<a href="/user/{user.handle}">
			{@render renderUser()}
		</a>
	{:else}
		<button
			type="button"
			class="flex cursor-pointer items-center hover:opacity-80"
			id="user-menu-button"
			aria-expanded="false"
			aria-haspopup="true"
			onclick={() => showLoginModal.toggle()}
		>
			{@render renderUser()}
		</button>
	{/if}
</div>
