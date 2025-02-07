<script lang="ts">
	import type { ActionData } from './$types';
	import Logo from '$lib/Components/Logo.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-screen flex-col items-center justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<Logo class="mx-auto size-10" />
		<h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Are you sure you want to logout</h2>
	</div>

	<div class="mt-10 w-full sm:mx-auto sm:max-w-sm">
		<form class="space-y-6" action="?/login" method="POST">

			<div>
				<button
					type="submit"
					class="flex w-full justify-center rounded-xl bg-accent-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
					>logout</button
				>
			</div>
		</form>
	</div>
</div>
