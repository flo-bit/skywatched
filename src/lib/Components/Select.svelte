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
    class="text-base-800 shadow-base-800/5 ring-base-900/5 dark:text-base-200 dark:bg-base-950 flex w-fit rounded-full px-3 text-sm font-medium ring-1 shadow-lg backdrop-blur dark:ring-white/10"
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
