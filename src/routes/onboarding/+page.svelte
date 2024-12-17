<script lang="ts">
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';

	import availableRegions from './available_regions.json';

	type Region = {
		iso_3166_1: string;
		english_name: string;
		native_name: string;
	};

	const toOption = (region: Region): ComboboxOptionProps<Region> => ({
		value: region,
		label: region.english_name,
		disabled: false
	});

	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, touchedInput, selected },
		helpers: { isSelected }
	} = createCombobox<Region>({
		forceVisible: true
	});

	$: if (!$open) {
		$inputValue = $selected?.label ?? '';
	}

	$: filteredRegions = $touchedInput
		? availableRegions.filter(({ english_name, native_name, iso_3166_1 }) => {
				const normalizedInput = $inputValue.toLowerCase();
				return (
					english_name.toLowerCase().includes(normalizedInput) ||
					native_name.toLowerCase().includes(normalizedInput) ||
					iso_3166_1.toLowerCase().includes(normalizedInput)
				);
			})
		: availableRegions;
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<form class="w-full max-w-lg px-4" action="?/settings" method="POST">
		<div class="mb-12 text-2xl font-bold text-base-50">Welcome to Skywatched!</div>

		<div class="flex w-full flex-col gap-1">
			<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
			<label use:melt={$label}>
				<span class="text-sm/6 font-semibold text-base-50">Streaming region</span>
			</label>
			<p class="mt-1 max-w-sm text-sm/6 text-base-400">
				Optionally select your streaming region, so we can show you where you can watch movies.
			</p>

			<div class="relative mt-4">
				<input
					use:melt={$input}
					class="flex h-10 w-full items-center justify-between rounded-lg border-base-800 bg-black px-3 pr-12 text-base-50
			placeholder:text-base-400 focus:border-none focus:outline-none focus:ring-2 focus:ring-accent-500"
					placeholder="Streaming region"
					name="region"
				/>
				<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-accent-500">
					{#if $open}
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
							<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
						</svg>
					{/if}
				</div>
			</div>
		</div>

		{#if $open}
			<ul
				class=" z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
				use:melt={$menu}
				transition:fly={{ duration: 150, y: -5 }}
			>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<div
					class="flex max-h-full flex-col gap-0 overflow-y-auto bg-base-900 px-2 py-2 text-base-200"
					tabindex="0"
				>
					{#each filteredRegions as region, index (index)}
						<li
							use:melt={$option(toOption(region))}
							class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4
		  hover:bg-accent-950/50
		  data-[highlighted]:bg-accent-950/50 data-[highlighted]:text-accent-200
			data-[disabled]:opacity-50"
						>
							{#if $isSelected(region)}
								<div class="check absolute left-2 top-1/2 z-10 text-accent-900">
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
											d="m4.5 12.75 6 6 9-13.5"
										/>
									</svg>
								</div>
							{/if}
							<div class="pl-4">
								<span class="font-medium">{region.english_name}</span>
							</div>
						</li>
					{:else}
						<li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">No results found</li>
					{/each}
				</div>
			</ul>
		{/if}

		<fieldset class="mt-8">
			<legend class="text-sm/6 font-semibold text-base-50">Crossposting</legend>
			<p class="mt-1 max-w-sm text-sm/6 text-base-400">
				Do you want to enable crossposting reviews to bluesky? You can still change this per review
				later.
			</p>
			<div class="mt-6 space-y-4">
				<div class="flex items-center">
					<input
						id="crosspost-enabled"
						name="crosspost-enabled"
						type="radio"
						checked
						value="true"
						class="relative size-4 appearance-none rounded-full border border-base-700 bg-white/10 before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-accent-500 checked:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:border-base-300 disabled:bg-base-100 disabled:before:bg-base-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
					/>
					<label for="crosspost-enabled" class="ml-3 block text-sm/6 font-medium text-base-50"
						>Enable</label
					>
				</div>
				<div class="flex items-center">
					<input
						id="crosspost-disabled"
						name="crosspost-enabled"
						type="radio"
						value="false"
						class="relative size-4 appearance-none rounded-full border border-base-700 bg-white/10 before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-accent-500 checked:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:border-base-300 disabled:bg-base-100 disabled:before:bg-base-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
					/>
					<label for="crosspost-disabled" class="ml-3 block text-sm/6 font-medium text-base-50"
						>Disable</label
					>
				</div>
			</div>
		</fieldset>

		<button
			type="submit"
			class="mt-12 flex w-full justify-center rounded-md bg-accent-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
			>Save</button
		>
	</form>
</div>

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-accent-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
