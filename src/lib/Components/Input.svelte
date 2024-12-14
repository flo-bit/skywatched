<script lang="ts">
  let { value = $bindable(), ...rest } = $props();
</script>

<input
  bind:value
  class="dark:bg-base-950 text-base-900 dark:text-base-100 ring-base-300 dark:ring-base-700 placeholder:text-base-400 dark:placeholder:text-base-600 focus:ring-accent-600 block w-full rounded-full border-0 py-1.5 ring-1 shadow-sm ring-inset focus:ring-2 focus:ring-inset sm:text-sm/6"
  {...rest}
/>
