<script lang="ts">
	import type { ActionData } from './$types';
	import Logo from '$lib/Components/Logo.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-screen flex-col items-center justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<Logo class="mx-auto size-10" />
		<h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">You have Won. Congratulations</h2>
	</div>
</div>
