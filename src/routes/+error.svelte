<script>
	import Container from "$lib/Components/Container.svelte";
	import { page } from '$app/state';
</script>
<Container>
	<div class="flex min-h-screen w-full flex-col items-center justify-center">
		<h1 class="text-4xl font-bold">Upps there was an error!</h1>

		<p class="text-lg mt-2">{page.error?.message}</p>

		<a href="/" class="text-accent-400 hover:text-accent-500 mt-4 text-sm">Go to home</a>
	</div>
</Container>
