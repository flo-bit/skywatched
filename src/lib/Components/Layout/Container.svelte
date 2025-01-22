<script lang="ts">
	import { cn } from '$lib/utils';

	const { children, class: className }: { children: () => any; class?: string } = $props();
</script>

<div class={cn('mx-auto max-w-2xl sm:px-6 lg:max-w-4xl lg:px-8', className)}>
	{@render children?.()}
</div>
