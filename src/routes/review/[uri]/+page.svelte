<script lang="ts">
  import { onMount } from 'svelte';
  import ReviewCard from '$lib/Components/ReviewCard.svelte';
	import Container from '$lib/Components/Container.svelte';

  let { data } = $props();
</script>

<Container>
	<ReviewCard data={data.record} />
</Container>
