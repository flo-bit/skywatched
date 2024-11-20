<script lang="ts">
	import { cn } from '../utils';
	const {
		movies,
		class: className
	}: { movies: { poster_path: string; original_title: string; id: number }[]; class?: string } =
		$props();
</script>

<div
	class={cn(
		'mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8',
		className
	)}
>
	{#each movies as movie}
		<div class="group relative">
			<div
				class="aspect-h-3 aspect-w-2 w-full overflow-hidden rounded-md border border-base-800 bg-base-900/50 transition-opacity duration-75 group-hover:opacity-75"
			>
				{#if movie.poster_path}
					<img
						src="https://image.tmdb.org/t/p/w500{movie.poster_path}"
						alt="poster"
						class="size-full object-cover object-center lg:size-full"
					/>
				{/if}
			</div>
			<div class="mt-2 flex justify-between">
				<div>
					<h3 class="sm:text-md text-sm font-medium text-base-50">
						<a href="/movie/{movie.id}">
							<span aria-hidden="true" class="absolute inset-0"></span>
							<div class="line-clamp-2 max-w-full">
								{movie.original_title}
							</div>
						</a>
					</h3>
				</div>
			</div>
		</div>
	{/each}
</div>
