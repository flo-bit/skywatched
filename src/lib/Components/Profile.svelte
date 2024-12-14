<script lang="ts">
  import type { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';

  let { profile }: { profile: ProfileViewDetailed } = $props();
</script>

{#if profile}
  <div class="sm:py-6">
    <div>
      {#if profile.banner}
        <img class="aspect-[3/1] w-full object-cover sm:rounded-xl sm:border border-b border-base-800" src={profile.banner} alt="" />
      {:else}
        <div class="aspect-[8/1] w-full"></div>
      {/if}
    </div>
    <div class="-mt-12 flex items-end space-x-5 px-4 sm:-mt-16 sm:px-6 lg:px-8">
      <div class="flex">
        <img
          class="ring-base-950 size-24 rounded-full ring-4 sm:size-32"
          src={profile.avatar}
          alt=""
        />
      </div>
      <div
        class="flex min-w-0 flex-1 flex-row sm:flex-row sm:items-center sm:justify-end sm:space-x-6 sm:pb-1"
      >
        <div class="mt-4 flex min-w-0 flex-1 items-baseline gap-2 sm:mt-0">
          <h1 class="text-base-900 dark:text-base-100 truncate text-xl font-bold">
            {profile.displayName}
          </h1>
          <div class="text-base-900 dark:text-base-400 text-md truncate">
            @{profile.handle}
          </div>
        </div>
        <div class="hidden mt-6 flex flex-row justify-stretch space-y-0 space-x-4">
          <button
            type="button"
            class="text-base-900 ring-base-300 hover:bg-base-50 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold ring-1 shadow-sm ring-inset"
          >
            <span>Call</span>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
