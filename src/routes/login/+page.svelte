<script lang="ts">
	import type { ActionData } from './$types';
	import Logo from '$lib/Components/Logo.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<Logo class="mx-auto size-10" />
		<h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">login/register</h2>
	</div>

	<div class="mt-10 w-full sm:mx-auto sm:max-w-sm">
		<form class="space-y-6" action="?/login" method="POST">
			<p class="min-h-6 font-semibold lowercase text-red-500">{form?.message ?? ''}</p>
			<div>
				<label for="username" class="block text-sm/6 font-medium text-white">username</label>
				<div class="mt-2">
					<input
						id="username"
						name="username"
						type="text"
						autocomplete="username"
						required
						class="block w-full rounded-xl border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-accent-500 sm:text-sm/6"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between">
					<label for="password" class="block text-sm/6 font-medium text-white">password</label>
				</div>
				<div class="mt-2">
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="block w-full rounded-xl border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-accent-500 sm:text-sm/6"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					class="flex w-full justify-center rounded-xl bg-accent-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
					>login</button
				>
				<button
					formaction="?/register"
					type="submit"
					class="mt-4 flex w-full justify-center rounded-xl bg-white/10 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
					>register</button
				>
			</div>
		</form>
	</div>
</div>
