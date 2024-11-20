<script lang="ts">
	import { cn } from '../utils';

	const { children, class: className }: { children: () => any; class?: string } = $props();
</script>

<div class={cn('mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-5xl lg:px-8', className)}>
	{@render children?.()}
</div>
