<script lang="ts">
  import ComboBox from "../components/ComboBox.svelte";
  import { options, selectedOption } from "../stores/store";
  import Infographic from "../components/Infographic.svelte";
  import type { Search, SearchResult } from "../interfaces";
  import { onDestroy } from "svelte";
  import { slide } from "svelte/transition";
  import Context from "../components/Context.svelte";

  $: searchStr = "";
  $: isListOpen = $options.length > 0;

  const fetchTitles = async (searchStr: string) => {
    const resp = await fetch(
      `http://www.omdbapi.com/?apikey=cfebe6e7&s=${searchStr}`
    );
    const data = (await resp.json()) as Search;
    if (data.Response === "True") {
      return data.Search;
    }
    return [];
  };

  const handleKeyPress = async () => {
    if (searchStr.trim() === "") options.set([]);
    if (searchStr.length > 2) {
      options.set(await fetchTitles(searchStr));
    }
  };

  const handleClick = (
    event: MouseEvent & {
      currentTarget: EventTarget & HTMLElement;
    }
  ) => {
    const found = $options.find((o) => o.imdbID === event.currentTarget.id);
    if (found) selectedOption.set(found);
    isListOpen = false;
  };
</script>

<div class="flex-1 text-center my-16">
  <h1 class="text-xl font-bold">How good was it really?</h1>
  <div class="text-sm text-gray-500">
    Search for your favorite movie or tv series and see the rating
  </div>
  <div class="flex flex-col mt-12 mx-auto">
    <Context>
      <input
        bind:value={searchStr}
        on:keyup={handleKeyPress}
        class="tracking-wider px-4 py-2 rounded-full border border-black w-full text-center"
        type="text"
        autocapitalize="none"
        autocomplete="off"
        spellcheck="false"
        aria-autocomplete="list"
      />
      {#if isListOpen}
        <ul
          transition:slide
          class="border border-gray-400 shadow-lg list-none m-0 min-w-full max-h-[40vh] overflow-y-auto z-50 rounded"
          role="listbox"
        >
          {#each $options as listOption (listOption.imdbID)}
            <li
              id={listOption.imdbID}
              class="hover:bg-gray-300 flex justify-center items-center py-1 hover:cursor-pointer"
              on:click={handleClick}
              on:keydown
            >
              {listOption.Title}
            </li>
          {/each}
        </ul>
      {/if}
    </Context>
  </div>
  <Infographic />
</div>
