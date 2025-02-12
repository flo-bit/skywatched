<script lang="ts">
	import { type MainRecord } from '$lib/db';
	import { rateMovieModal } from '$lib/state/modals.svelte';
	import { user } from '$lib/state/user.svelte';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { toast } from 'svelte-sonner';
	import { fly } from 'svelte/transition';

	const {
		elements: { trigger, menu },
		states: { open }
	} = createDropdownMenu({
		forceVisible: true,
		loop: true
	});

	export let data: MainRecord;
</script>

<button type="button" class="" use:melt={$trigger}>
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
			d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
		/>
	</svg>

	<span class="sr-only">show options</span>
</button>

{#if $open}
	<div
		class="z-20 flex flex-col items-start divide-y divide-base-800 overflow-hidden rounded-xl border border-base-800 bg-base-900 shadow-xl shadow-base-950"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -10 }}
	>
		{#if data.author.handle === user?.handle}
			<button
				class="item"
				on:click={async () => {
					const response = await fetch(`/api/review?uri=${encodeURIComponent(data.uri)}`, {
						method: 'DELETE'
					});
					console.log(await response.json());

					$open = false;

					await new Promise((resolve) => setTimeout(resolve, 1000));

					if (window.location.pathname.includes('/review/')) {
						window.location.href = '/';
					} else {
						window.location.reload();
					}
				}}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1"
					stroke="currentColor"
					class="size-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
					/>
				</svg>

				delete review</button
			>
			<button
				class="item"
				on:click={() => {
					$open = false;

					rateMovieModal.show({
						id: parseInt(data.record.item.value),
						ref: data.record.item.ref as Ref,
						media_type: data.record.item.ref === 'tmdb:s' ? 'tv' : 'movie',
						title: data.record.metadata?.title ?? '',
						poster_path: data.record.metadata?.poster_path ?? '',
						currentRating: (data.record.rating?.value ?? 0) / 2,
						currentReview: data.record.note?.value,
						editUri: data.uri
					});
				}}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1"
					stroke="currentColor"
					class="size-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
					/>
				</svg>

				edit review</button
			>
		{:else}
			<!-- <button
				class="item"
				on:click={() => {
					alert('Check for Updates...');
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1"
					stroke="currentColor"
					class="size-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
					/>
				</svg>

				report review</button
			> -->
		{/if}

		{#if data.record.crosspost?.uri}
			<button class="item" on:click={() => {}}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1"
					stroke="currentColor"
					class="size-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
					/>
				</svg>
				go to crosspost
			</button>
		{/if}

		<button
			class="item"
			on:click={() => {
				$open = false;

				// copy link to clipboard
				navigator.clipboard.writeText(
					'https://skywatched.app/review/' + encodeURIComponent(data.uri)
				);

				toast.success('Link copied to clipboard');
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1"
				stroke="currentColor"
				class="size-4"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
				/>
			</svg>

			copy link to post
		</button>
	</div>
{/if}

<style>
	.item {
		@apply inline-flex w-full items-center gap-2 px-3 py-2 text-sm text-base-300 hover:bg-accent-950/30 hover:text-accent-400;
	}
</style>
