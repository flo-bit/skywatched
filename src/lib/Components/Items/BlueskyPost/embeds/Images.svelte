<script lang="ts">
	const { data } = $props();
</script>

{#each data as { fullsize: string; alt: string; thumb: string; aspectRatio: { width: number; height: number } }[] as image}
	<div class="ring-base-800 relative h-fit w-fit rounded-2xl ring-1">
		<img
			loading="lazy"
			src={image.thumb}
			alt={image.alt}
			height={image.aspectRatio.height}
			width={image.aspectRatio.width}
			class="h-72 w-auto rounded-2xl"
		/>

		<div
			class="inset-shadow-md inset-shadow-base-950/30 inset-ring-base-950/10 absolute inset-0 h-full w-full rounded-2xl inset-ring-2"
		></div>
	</div>
{/each}
