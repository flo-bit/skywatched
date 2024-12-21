<script lang="ts">
	import Avatar from '$lib/Components/Avatar.svelte';
	import Container from '$lib/Components/Container.svelte';
	import ItemsGrid from '$lib/Components/ItemsGrid.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	function calculateAge(birthday: string) {
		// set birthday time to 00:00:00
		const birthdayDate = new Date(birthday);
		birthdayDate.setHours(0, 0, 0, 0);

		// set current time to 00:00:00
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);

		const ageDifMs = currentDate.getTime() - birthdayDate.getTime();
		const ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

	let showFullBiography = $state(false);
</script>

<Container class="relative z-10 pb-8 pt-4">
	<div class="flex items-center gap-4 px-4 pt-8">
		<Avatar
			src={data.personDetails.profile_path
				? 'https://image.tmdb.org/t/p/w500' + data.personDetails.profile_path
				: undefined}
			size="size-44"
		/>
		<div class="flex flex-col gap-2">
			<div class="max-w-xl text-2xl font-semibold text-white sm:text-4xl">
				{data.personDetails.name}
			</div>
			{#if data.personDetails.birthday}
				<div class="text-sm text-base-300">
					{calculateAge(data.personDetails.birthday)} years old
				</div>
			{/if}
		</div>
	</div>
	<div class="px-4 pt-4 text-sm text-white">
		<div class="mb-8 max-w-2xl text-sm text-white">
			<div class="mb-2 text-lg font-semibold">overview</div>
			<div class={showFullBiography ? '' : 'line-clamp-4'}>
				{data.personDetails.biography}
			</div>
			{#if !showFullBiography}
				<button class="text-accent-400 font-semibold mt-1" onclick={() => (showFullBiography = true)}>
					show more
				</button>
			{/if}
		</div>

		<div class="mb-4 max-w-2xl text-sm text-white">
			<div class="mb-2 text-lg font-semibold">appearing in</div>
			<ItemsGrid items={data.combinedCredits} />
		</div>
	</div>
</Container>
