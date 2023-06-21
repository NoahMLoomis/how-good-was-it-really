<script lang="ts">
  import clsx from "clsx";
  import { options, selectedOption } from "../stores/store";
  import Infographic from "../components/Infographic.svelte";
  import type { Search, SearchResult } from "../interfaces";
  import { onDestroy } from "svelte";
  import { fade, slide } from "svelte/transition";
  import Context from "../components/Context.svelte";

  $: searchStr = "";
  $: isListOpen = $options.length > 0;
  $: focusedIndex = -1;
  let errorResp: {
    Error: string;
    Response: string;
  } | null = null;

  const fetchTitles = async (searchStr: string) => {
    const resp = await fetch(
      `http://www.omdbapi.com/?apikey=cfebe6e7&s=${searchStr}`
    );
    const data = (await resp.json()) as Search;
    if (data.Response === "True") {
      errorResp = null;
      return data.Search;
    } else {
      errorResp = {
        Response: data.Response,
        Error: data.Error as string,
      };
    }
    return [];
  };

  const clear = () => {
    options.set([]);
    errorResp = null;
  };

  const handleKeyPress = async (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusedIndex = Math.max(focusedIndex - 1, 0);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focusedIndex = Math.min(focusedIndex + 1, $options.length - 1);
    } else if (event.key === "Enter" && focusedIndex !== -1) {
      event.preventDefault();
      const selectedOption = $options[focusedIndex];
      if (selectedOption) {
        handleClick(selectedOption.imdbID);
      }
    } else {
      if (searchStr.trim() === "") clear();
      if (searchStr.length > 2) {
        options.set(await fetchTitles(searchStr));
        focusedIndex = -1;
      }
    }
  };

  const handleClick = (imdbID: string) => {
    const found = $options.find((o) => o.imdbID === imdbID);
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
      {#if errorResp}
        <div in:slide out:fade>
          {errorResp.Error}
        </div>
      {/if}
      {#if isListOpen}
        <ul
          transition:slide
          class="border border-gray-400 shadow-lg list-none m-0 min-w-full overflow-y-auto z-50 rounded"
          role="listbox"
        >
          {#each $options as listOption, index (listOption.imdbID)}
            <li
              id={listOption.imdbID}
              class={clsx(
                "hover:bg-gray-300 flex justify-center items-center py-1 hover:cursor-pointer",
                focusedIndex === index && "bg-gray-300"
              )}
              on:click={() => handleClick(listOption.imdbID)}
              on:keydown={(event) => handleKeyPress(event)}
              tabindex={index === focusedIndex ? 0 : -1}
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
