<script lang="ts">
	import Rating from './Rating.svelte';
	import RelativeTime from './relative-time/RelativeTime.svelte';

	let {
		review,
		item,
		user
	}: {
		review: {
			rating: number;
			ratingText?: string;
			updatedAt: string;
			movieId?: number;
			showId?: number;
		};
		item: {
			original_title?: string;
			original_name?: string;
			kind: string;
			poster_path: string;
		};
		user: {
			displayName?: string;
			handle: string;
			avatar: string;
		};
	} = $props();
</script>

<a href={item.movieId ? `/movie/${item.movieId}` : `/tv/${item.showId}`} class="flex w-full max-w-2xl flex-col gap-2 rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
	<div class="flex gap-4 items-center">
		<div
			class="relative z-20 aspect-[2/3] h-44 w-auto shrink-0 overflow-hidden rounded-md border border-base-800 bg-base-900/50 transition-opacity duration-75 group-hover:opacity-75"
		>
			{#if item.poster_path}
					<img
						src="https://image.tmdb.org/t/p/w500{item.poster_path}"
						alt="movie poster for {item.original_title ?? item.original_name}"
						class="size-full object-cover object-center lg:size-full"
					/>
			{/if}
		</div>
		<div class="flex w-full flex-col justify-center gap-4">
			<div class="flex w-full flex-row sm:items-center gap-4">
				<div class="flex items-center gap-2">
					{#if user.avatar}
						<img src={user.avatar} alt="user avatar" class="size-5 rounded-full" />
					{/if}
					<div class="text-md font-semibold">{user.displayName ?? user.handle}</div>
				</div>
				<div class="text-sm text-base-500">
					<RelativeTime date={new Date(review.updatedAt)} locale="en-US" />
				</div>
			</div>

			<div class="flex w-full flex-col gap-4">
				<div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
					<div class="text-2xl font-bold">{item.original_title ?? item.original_name}</div>
					<Rating rating={review.rating} size="size-6" />
				</div>

				<div class="text-sm text-base-300">{@html review.ratingText?.replace('\n', '<br /><br />')}</div>
			</div>
		</div>
	</div>
</a>
