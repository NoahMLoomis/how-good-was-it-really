<script lang="ts">
  import { slide } from "svelte/transition";
  import { selectedOption } from "../stores/store";
  import type { SearchResult } from "../interfaces";
  import { uid, onClickOutside } from "./Context.svelte";
  import { onDestroy } from "svelte";

  export let disabled: boolean | undefined = undefined;
  export let error: boolean | undefined = undefined;
  export let expand = true;
  export let id = uid();
  export let label = "";
  export let loading = false;
  export let name: any;
  export let options: SearchResult[] = [];
  export let placeholder: any = undefined;
  export let readonly: boolean | undefined = undefined;
  export let required: boolean | undefined = undefined;
  export let value: string = "";

  export let onKeyPress: (searchStr: string) => void;

  let filter = (text: string) => {
    const sanitized = text.trim().toLowerCase();

    return options.reduce((a: SearchResult[], o) => {
      let match: SearchResult | null = null;

      if (o.Title.toLowerCase().includes(sanitized)) {
        match = o;
      }
      match && a.push(match);
      return a;
    }, []);
  };

  let listElement: any;
  let inputElement: HTMLInputElement;
  let list: SearchResult[] = [];
  let isListOpen = false;

  const unsub = selectedOption.subscribe((value) => {
    if (value && inputElement) {
      inputElement.value = value.Title;
    }
  });

  onDestroy(unsub);

  async function onInputKeyup(event: any) {
    onKeyPress(inputElement.value);
    switch (event.key) {
      case "Escape":
      case "ArrowUp":
      case "ArrowLeft":
      case "ArrowRight":
      case "Enter":
      case "Tab":
      case "Shift":
        break;
      case "ArrowDown":
        await showList(event.target.value);
        listElement
          .querySelector(`[role="option"]:not([aria-disabled="true"])`)
          ?.focus();

        event.preventDefault();
        event.stopPropagation();
        break;

        await showList(event.target.value);
    }
  }

  function onInputKeydown(event: {
    key: any;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) {
    let flag = false;

    switch (event.key) {
      case "Escape":
        hideList();
        flag = true;
        break;

      case "Tab":
        hideList();
        break;
    }

    if (flag) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  async function onInputClick(event: any) {
    await showList(event.target.value);
    // Scroll selected option into view.
    listElement
      .querySelector(`[role="option"][data-value="${value}"]`)
      ?.scrollIntoView();
  }

  function onOptionClick(event: any) {
    selectOption(event.target.id);
    hideList();
  }

  function onListKeyDown(event: any) {
    let flag = false;

    switch (event.key) {
      case "ArrowUp":
        let prevOptionElement = event.target.previousElementSibling;

        while (prevOptionElement) {
          if (
            prevOptionElement.matches(
              `[role="option"]:not([aria-disabled="true"])`
            )
          )
            break;
          prevOptionElement = prevOptionElement.previousElementSibling;
        }

        prevOptionElement?.focus();
        flag = true;
        break;

      case "ArrowDown":
        let nextOptionElement = event.target.nextElementSibling;

        while (nextOptionElement) {
          if (
            nextOptionElement.matches(
              `[role="option"]:not([aria-disabled="true"])`
            )
          )
            break;
          nextOptionElement = nextOptionElement.nextElementSibling;
        }

        nextOptionElement?.focus();
        flag = true;
        break;

      case "Enter":
        // TODO fix this
        selectOption(event.target);
        hideList();
        flag = true;
        break;

      case "Escape":
        hideList();
        flag = true;
        break;

      case "Tab":
        hideList();
        break;

      default:
        inputElement.focus();
    }

    if (flag) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  async function showList(inputValue: string) {
    const isExactMatch = options.some((o) => o.Title === inputValue);

    if (inputValue !== "") {
      list = isExactMatch ? options : filter(inputValue);
    }
    isListOpen = true;
  }

  function hideList() {
    if (!isListOpen) return;

    if ($selectedOption) {
      inputElement.value = $selectedOption.Title;
    }

    isListOpen = false;
    inputElement.focus();
  }

  function selectOption(id: string) {
    const foundOption = options.find(
      (option) => option.imdbID.trim() === id.trim()
    );
    if (foundOption) selectedOption.set(foundOption);
  }
</script>

<div class="combobox w-full">
  <label class="combobox__label label" for={id}>
    {label}
    {#if error}
      <span class="form-validation-error">
        {error}
      </span>
    {/if}
  </label>

  <div class="input-container w-full" use:onClickOutside={hideList}>
    <slot name="icon-start" />

    <input
      bind:this={inputElement}
      on:focus
      on:blur
      on:input
      on:keyup={onInputKeyup}
      on:keydown={onInputKeydown}
      on:mousedown={onInputClick}
      class="tracking-wider px-4 py-2 rounded-full border border-black w-full text-center"
      {id}
      {name}
      type="text"
      {disabled}
      autocapitalize="none"
      autocomplete="off"
      {readonly}
      {placeholder}
      spellcheck="false"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={isListOpen}
      aria-required={required ? "true" : undefined}
    />
    {#if isListOpen}
      <ul
        transition:slide
        class="combobox__list border border-gray-400 shadow-lg"
        role="listbox"
        aria-label={label}
        on:click={onOptionClick}
        on:keydown={onListKeyDown}
        bind:this={listElement}
      >
        {#each list as listOption (listOption.imdbID)}
          <li
            class="list__option"
            id={listOption.imdbID}
            tabindex={listOption ? undefined : -1}
            data-text={listOption.Title}
            data-value={listOption.Title}
            aria-selected={value === listOption.Title}
            role="option"
          >
            {listOption.Title}
          </li>
        {:else}
          <li class="list__no-results">No results available</li>
        {/each}
      </ul>
    {/if}
    <div class="visually-hidden" role="status" aria-live="polite">
      {list.length} results available.
    </div>
  </div>
</div>

<style>
  .combobox {
    --accent-color: #06113c;
    --background-color: white;
    --border-radius: 1em;

    --option-border: ;
    --option-padding: ;

    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  .input-container {
    position: relative;
  }

  .combobox__list {
    /* Reset */
    list-style: none;
    margin: 0;
    padding: 0.3rem;
    /* Position and Size */
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: calc(100% + 0.3rem);
    min-width: 100%;
    max-height: 40vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    z-index: 100;
    background-color: var(--background-color);
    border-radius: 0.3em;
  }

  .list__no-results {
    padding: 0.8rem 1rem;
  }

  .list__option {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: space-between;
    padding: 0.8rem 1rem;
    border: 0.2rem solid transparent;
    border-radius: 0.3rem;
  }

  .list__option > :global(*) {
    pointer-events: none;
  }

  .list__option:focus,
  .list__option:not([aria-disabled="true"]):hover {
    outline: none;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .list__option:active {
    cursor: pointer;
    outline: none;
    color: white;
    background-color: var(--accent-color) !important;
  }

  .list__option:focus :global(svg),
  .list__option:hover :global(svg) {
    --icon-color: white !important;
  }
</style>
