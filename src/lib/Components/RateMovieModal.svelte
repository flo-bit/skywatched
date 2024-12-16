<script lang="ts">
	import { rateMovieModal, watchedItems } from '$lib/state.svelte';
	import { toast } from 'svelte-sonner';
	import Rating from './Rating.svelte';

	let rating = $state(rateMovieModal.selectedItem.currentRating ?? 0);
	let review = $state(rateMovieModal.selectedItem.currentReview ?? '');

	$effect(() => {
		rating = rateMovieModal.selectedItem.currentRating ?? 0;
		review = rateMovieModal.selectedItem.currentReview ?? '';
	});
</script>

{#if rateMovieModal.showModal}
	<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div
			class="fixed inset-0 bg-base-950/90 backdrop-blur-sm transition-opacity"
			onclick={() => (rateMovieModal.showModal = false)}
			aria-hidden="true"
		></div>
		<div class="pointer-events-none fixed inset-0 z-50 h-screen w-screen overflow-y-auto">
			<div class="flex h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					class="pointer-events-auto relative w-full transform overflow-hidden rounded-lg border border-base-800 bg-base-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:max-w-sm sm:p-6"
				>
					<div>
						<h3 class="text-lg font-semibold text-base-50" id="modal-title">
							Rate {rateMovieModal.selectedItem.name}
						</h3>

						<div class="mt-4 flex items-center gap-2">
							<p class="text-xs font-medium text-base-50">stars</p>

							<Rating bind:rating canChange />
						</div>

						<div class="mt-4">
							<label for="comment" class="block text-xs font-medium text-base-50">review</label>
							<div class="mt-2">
								<textarea
									rows="4"
									name="comment"
									id="comment"
									bind:value={review}
									placeholder="write a review"
									class="block w-full rounded-md bg-base-950 px-3 py-1.5 text-base text-base-50 outline outline-1 -outline-offset-1 outline-base-700 placeholder:text-base-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
								></textarea>
							</div>
						</div>
					</div>
					<div class="mt-5 sm:mt-6">
						<button
							onclick={async () => {
								rateMovieModal.showModal = false;

								await fetch(`/api/rate`, {
									method: 'POST',
									body: JSON.stringify({
										rating,
										review,
										kind: rateMovieModal.selectedItem.kind,
										id: rateMovieModal.selectedItem.movieId ?? rateMovieModal.selectedItem.showId
									})
								});

								watchedItems.addRated({
									movieId: rateMovieModal.selectedItem.movieId,
									showId: rateMovieModal.selectedItem.showId,
									rating
								});

								toast.success('Rating saved');
							}}
							type="button"
							class="inline-flex w-full justify-center rounded-md border border-accent-900 bg-accent-950/80 px-3 py-2 text-sm font-semibold text-accent-300 shadow-sm hover:bg-accent-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
							>save</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
