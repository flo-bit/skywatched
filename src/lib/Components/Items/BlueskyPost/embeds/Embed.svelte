<script lang="ts">
	import External from './External.svelte';
	import Images from './Images.svelte';
	// import Video from "./Video.svelte";
	const { post } = $props();
</script>

{#if post.embed}
	<div class="mt-4">
		{#if post.embed.$type === 'app.bsky.embed.images#view'}
			<Images data={post.embed.images} />
		{:else if post.embed.$type === 'app.bsky.embed.external#view' && post.embed.external?.uri}
			<External data={post.embed.external} />
			<!-- {:else if data.post.embed.$type === "app.bsky.embed.video#view"}
      <Video data={data.post.embed} /> -->
		{:else}
			Unsupported embed
		{/if}
	</div>
{/if}
