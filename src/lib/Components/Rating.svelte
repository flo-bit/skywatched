<script lang="ts">
	import { cn } from '$lib/utils';
	let {
		rating = $bindable(),
		size = 'size-5',
		canChange = false
	}: { rating: number; size?: string; canChange?: boolean } = $props();

	let hoverRating = $state(rating);

	$effect(() => {
		hoverRating = rating;
	});
</script>

<div class="flex items-center xl:col-span-1">
	<div class="flex items-center">
		{#if canChange}
			{#each Array.from({ length: 5 }).map((_, i) => i + 1) as i}
				<button onclick={() => (rating = i)}>
					<svg
						class={cn(
							size,
							'shrink-0 stroke-base-500 text-base-600',
							i <= hoverRating && 'stroke-accent-400 text-accent-500'
						)}
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
						data-slot="icon"
						onmouseenter={() => (hoverRating = i)}
						onmouseleave={() => (hoverRating = rating)}
					>
						<path
							fill-rule="evenodd"
							d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
							clip-rule="evenodd"
						/>
					</svg>

					<span class="sr-only">rate {i} stars</span>
				</button>
			{/each}
		{:else}
			{#each Array.from({ length: 5 }).map((_, i) => i + 1) as i}
				<svg
					class={cn(
						size,
						'shrink-0 stroke-base-500 text-base-600',
						i <= rating && 'stroke-accent-400 text-accent-500'
					)}
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						fill-rule="evenodd"
						d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
						clip-rule="evenodd"
					/>
				</svg>
			{/each}
		{/if}
	</div>
</div>
