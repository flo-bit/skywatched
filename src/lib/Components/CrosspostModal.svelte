<script lang="ts">
	import { crosspostModal, user } from '$lib/state.svelte';
	import { toast } from 'svelte-sonner';

	let ratingText = $derived.by(() => {
		const ratingText = `I rated "${crosspostModal.title}" with ${crosspostModal.rating} star${crosspostModal.rating === 1 ? '' : 's'} on skywatched.app`;

		let text = crosspostModal.review
			? `My review for "${crosspostModal.title}" on skywatched.app:<br /> <br />${crosspostModal.review}`
			: ratingText;

		if (text.length > 299) {
			text = text.slice(0, 295) + '...';
		}

		return text;
	});
</script>

{#if crosspostModal.showModal}
	<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div
			class="fixed inset-0 bg-base-950/90 backdrop-blur-sm transition-opacity"
			onclick={() => (crosspostModal.showModal = false)}
			aria-hidden="true"
		></div>
		<div class="pointer-events-none fixed inset-0 z-50 h-[100dvh] w-screen overflow-y-auto">
			<div class="flex h-[100dvh] items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					class="pointer-events-auto relative w-full transform overflow-hidden rounded-lg border border-base-800 bg-base-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:max-w-md sm:p-6"
				>
					<button
						class="absolute right-2 top-2 rounded-full bg-base-800/50 p-1 hover:bg-base-800/80"
						onclick={() => (crosspostModal.showModal = false)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-4"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>

						<span class="sr-only">close</span>
					</button>

					<div>
						<h3 class="text-md mb-4 font-semibold text-base-50" id="modal-title">
							Crosspost to Bluesky
						</h3>

						<p class="text-sm text-base-300">Do you want to crosspost this review to Bluesky?</p>

						<div class="mt-4 rounded-xl border border-base-800 bg-base-950 p-4">
							<div class="flex items-center gap-2">
								{#if user.avatar}
									<img src={user.avatar} alt="user avatar" class="size-5 rounded-full" />
								{/if}
								<div class="truncate text-sm font-medium">
									{user.displayName || user.handle}
								</div>
							</div>

							<p class="mt-2 text-sm text-base-300">
								{@html ratingText}
							</p>

							<div
								class="relative mt-4 aspect-2 h-auto w-full overflow-hidden rounded-md border border-base-800 bg-base-800"
							>
								<div
									class="absolute inset-0 flex h-full w-full items-center justify-center bg-base-950/90"
								>
									<p>Loading image...</p>
								</div>
								<img
									src="/review/{encodeURIComponent(crosspostModal.uri ?? '')}/og.png"
									alt="crosspost"
									class="absolute inset-0 h-full w-full object-cover"
								/>
							</div>
						</div>
					</div>
					<div class="mt-5 sm:mt-6">
						<button
							onclick={async () => {
								crosspostModal.hide();
							}}
							type="button"
							class="inline-flex w-full justify-center rounded-md border border-base-700 bg-white/5 px-3 py-2 text-sm font-semibold text-base-300 shadow-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
							>No thanks</button
						>

						<button
							onclick={async () => {
								crosspostModal.showModal = false;

								const response = await fetch(`/api/crosspost`, {
									method: 'POST',
									body: JSON.stringify({
										uri: crosspostModal.uri
									})
								});

								if (!response.ok) {
									toast.error('Failed to crosspost');
									return;
								}

								toast.success('Crossposted to Bluesky');
							}}
							type="button"
							class="mt-2 inline-flex w-full justify-center rounded-md border border-accent-900 bg-accent-950/80 px-3 py-2 text-sm font-semibold text-accent-300 shadow-sm hover:bg-accent-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
							>Post to Bluesky</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
