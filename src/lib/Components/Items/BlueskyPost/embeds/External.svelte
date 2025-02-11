<script lang="ts">
	const { data } = $props();
	$inspect(data);
	console.log(data.uri);
	console.log(new URL(data.uri));
	const domain = new URL(data.uri).hostname.replace('www.', '');
</script>

<article
	class="bg-base-900 ring-base-800 relative isolate flex aspect-16/9 h-64 flex-col justify-end rounded-2xl p-4 ring-1"
>
	{#if data.thumb}
		<img
			src={data.thumb}
			alt={data.description}
			class="absolute inset-0 -z-10 size-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
		/>
	{/if}
	<div
		class="from-base-950/90 via-base-950/40 absolute inset-0 -z-10 rounded-xl bg-linear-to-t"
	></div>

	<div
		class="inset-shadow-md inset-ring-base-950/50 inset-shadow-base-950/40 ring-base-800 absolute inset-0 -z-10 h-full w-full rounded-2xl inset-ring-1 ring-1"
	></div>

	<div class="text-base-300 flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6">
		<div>{domain}</div>
	</div>
	<h3 class="mt-1 text-lg/6 font-semibold text-white">
		<a href={data.uri} target="_blank" rel="noopener noreferrer nofollow">
			<span class="absolute inset-0"></span>
			{data.title}
		</a>
	</h3>
</article>
