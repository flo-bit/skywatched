<script lang="ts">
	let { value = $bindable(), ...rest } = $props();
</script>

<input
	bind:value
	class="block w-full rounded-full border-0 py-1.5 text-base-900 shadow-sm ring-1 ring-inset ring-base-300 placeholder:text-base-400 focus:ring-2 focus:ring-inset focus:ring-accent-600 dark:bg-base-950 dark:text-base-100 dark:ring-base-700 dark:placeholder:text-base-600 sm:text-sm/6"
	{...rest}
/>
