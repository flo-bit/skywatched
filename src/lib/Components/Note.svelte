<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		children,
		class: className
	}: {
		children: () => any;
		class?: string;
	} = $props();
</script>

<div class={cn('rounded-md border border-sky-500/20 bg-sky-500/10 p-4', className)}>
	<div class="flex">
		<div class="shrink-0">
			<svg
				class="size-5 text-sky-500"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
				data-slot="icon"
			>
				<path
					fill-rule="evenodd"
					d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
		<div class="ml-3 flex-1 md:flex md:justify-between">
			<p class="text-sm text-sky-400">{@render children()}</p>
		</div>
	</div>
</div>
