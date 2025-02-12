<script lang="ts">
	import { rateMovieModal } from '$lib/state/modals.svelte';
	import { watchedItems } from '$lib/state/user.svelte';
	import type { Item } from '$lib/types';
	import { createCombobox, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';

	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, touchedInput },
		helpers: { isSelected }
	} = createCombobox({
		forceVisible: true
	});

	let debounceTimer: ReturnType<typeof setTimeout>;

	const debounce = (callback: () => void) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(callback, 500);
	};

	let results: Item[] = [];

	let searching = false;

	function onInput() {
		if ($inputValue.length < 2) {
			results = [];
		} else {
			searching = true;
			debounce(async () => {
				if ($inputValue.length < 2) return;

				const response = await fetch(`/api/search?q=${$inputValue}`);
				const data = await response.json();
				results = data;

				searching = false;
			});
		}
	}
</script>

<div class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<!-- <label use:melt={$label}>
		<span class="text-sm font-medium text-accent-900">Find a movie or show:</span>
	</label> -->

	<div class="relative">
		<input
			use:melt={$input}
			class="flex h-10 w-full items-center justify-between rounded-lg border-base-800 bg-black px-3 pr-12 text-base-50
			placeholder:text-base-400 focus:border-none focus:outline-none focus:ring-2 focus:ring-accent-500"
			placeholder="Find a movie or show"
			oninput={onInput}
		/>
		<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-accent-500">
			{#if $open && $inputValue.length > 1}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-4"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
			{/if}
		</div>
	</div>
</div>
{#if $open && $inputValue.length > 1}
	<ul
		class=" z-50 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div
			class="mx-2 flex max-h-full flex-col gap-0 divide-y divide-base-700/50 overflow-y-auto rounded-lg border border-base-700 bg-base-800 px-2 py-2 text-base-50"
			tabindex="0"
		>
			{#each results as item, index (index)}
				<li
					use:melt={$option({
						value: item,
						label: item.title
					})}
					class="relative w-full cursor-pointer scroll-my-2 px-2 py-2 data-[highlighted]:text-accent-200"
				>
					<button
						onclick={() => {
							rateMovieModal.selectedItem = {
								...item,
								currentRating: watchedItems.getRating(item)?.rating ?? undefined,
								currentReview: watchedItems.getRating(item)?.ratingText ?? undefined
							};
							rateMovieModal.showModal = true;
						}}
						class="flex w-full items-center justify-start gap-2"
					>
						<div
							class="relative z-20 aspect-[2/3] h-12 w-auto shrink-0 overflow-hidden rounded-md border border-base-800 bg-base-900/50"
						>
							<img
								src="https://image.tmdb.org/t/p/w154{item.poster_path}"
								alt="movie poster for {item.title}"
								class="size-full object-cover object-center lg:size-full"
							/>
						</div>
						<span class="text-left text-sm font-medium">{item.title}</span>
					</button>
				</li>
			{:else}
				<li
					class="relative cursor-pointer rounded-md py-1 pl-4 pr-4 text-sm data-[highlighted]:text-accent-200"
				>
					{#if searching}
						Searching...
					{:else if $inputValue.length > 1}
						No results found
					{/if}
				</li>
			{/each}
		</div>
	</ul>
{/if}
