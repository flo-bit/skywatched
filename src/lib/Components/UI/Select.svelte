<script lang="ts">
	import SelectItem from './SelectItem.svelte';

	type Props = {
		items: string[];
		active: string;
		onchange?: (active: string) => void;
	};

	let { items, active = $bindable(), onchange }: Props = $props();
</script>

<div class="inline-block">
	<ul
		class="flex w-fit rounded-full px-3 text-sm font-medium text-base-800 shadow-lg shadow-base-800/5 ring-1 ring-base-900/5 backdrop-blur dark:bg-base-950 dark:text-base-200 dark:ring-white/10"
	>
		{#each items as item}
			<SelectItem
				onclick={() => {
					if (active == item) return;
					active = item;
					if (onchange) onchange(item);
				}}
				isActive={active == item}
			>
				{item}
			</SelectItem>
		{/each}
	</ul>
</div>
