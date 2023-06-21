import { writable, type Writable } from 'svelte/store';
import type { SearchResult } from '../interfaces';

export const selectedOption: Writable<SearchResult> = writable();

export const options: Writable<SearchResult[]> = writable([]);