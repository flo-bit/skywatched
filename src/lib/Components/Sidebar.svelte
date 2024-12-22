<script lang="ts">
	import { page } from '$app/stores';
	import { BASE_PATH } from '$lib';
	import { cn } from '$lib/utils';
	import User from '$lib/Components/User.svelte';
	import { rateMovieModal, showSidebar } from '$lib/state.svelte';
	import { fade } from 'svelte/transition';
	import { onNavigate } from '$app/navigation';

	const menu = [
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>`,
			label: 'Home',
			href: '/'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
</svg>`,
			label: 'Feed',
			href: '/feed'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>`,
			label: 'Search',
			href: '/search'
		}
	];

	const userMenu = [
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>`,
			label: 'New review',
			href: '/review/new',
			onclick: () => {
				showSidebar.value = false;
				rateMovieModal.showEmpty();
			}
		}
	];

	let { user } = $props();

	onNavigate(() => {
		showSidebar.value = false;
	});
</script>

{#key $page.url.pathname}
	<div
		class={cn(
			'sidebar fixed bottom-2 left-0 top-2 z-50 w-[4.5rem] py-2 transition-transform duration-300',
			showSidebar.value ? 'translate-x-0' : '-translate-x-64 md:translate-x-0'
		)}
	>
		<ul
			role="list"
			class="flex h-full flex-col items-center justify-end space-y-1 pb-2 md:justify-between"
		>
			<div class="flex flex-col items-center space-y-2">
				{#each menu as item}
					<li class="group relative size-12">
						<a
							href={item.href}
							class={cn(
								'group flex items-center  gap-x-3 rounded-md p-3 text-sm/6 font-semibold',
								$page.url.pathname === item.href
									? 'bg-accent-950/10 text-accent-400'
									: 'text-base-200 transition-colors duration-100 hover:bg-accent-950/20 hover:text-accent-400'
							)}
						>
							{@html item.icon}
							<span
								class="absolute left-14 rounded-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 md:bg-accent-950/20 md:px-3 md:py-2 md:opacity-0"
								>{item.label}</span
							>
						</a>
					</li>
				{/each}
			</div>
			<div class="flex flex-col items-center space-y-2">
				{#if user}
					{#each userMenu as item}
						<li class="group relative size-12">
							<a
								href={item.href}
								class={'group flex items-center gap-x-3 rounded-md p-3 text-sm/6 font-semibold text-base-200 transition-colors duration-100 hover:bg-accent-950/20 hover:text-accent-400'}
								onclick={(event) => {
									event.preventDefault();
									item.onclick();
								}}
							>
								{@html item.icon}
								<span
									class="absolute left-14 w-[6.5rem] rounded-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 md:bg-accent-950/20 md:px-3 md:py-2 md:opacity-0"
									>{item.label}</span
								>
							</a>
						</li>
					{/each}
				{/if}

				<User {user} />
			</div>
		</ul>
	</div>
{/key}

{#if showSidebar.value}
	<button
		transition:fade
		class="fixed inset-0 z-40 bg-base-950/90 backdrop-blur-sm md:hidden"
		onclick={() => showSidebar.toggle()}
	>
		<span class="sr-only">Close Menu</span>
	</button>

	<button
		transition:fade
		onclick={() => showSidebar.toggle()}
		class="fixed bottom-6 right-4 z-50 md:hidden"
	>
		<span class="sr-only">close Menu</span>

		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-6"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
		</svg>
	</button>
{:else}
	<button
		class="fixed bottom-2 left-2 z-50 rounded-lg border border-base-800 bg-base-900/75 p-2 backdrop-blur-sm md:hidden"
		onclick={() => showSidebar.toggle()}
	>
		<span class="sr-only">Open Menu</span>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
			<path
				fill-rule="evenodd"
				d="M3 9a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9Zm0 6.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>
{/if}

<style>
	.sidebar {
		view-transition-name: sidebar;
	}
</style>
