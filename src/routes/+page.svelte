<script lang="ts">
  import ComboBox from "../components/ComboBox.svelte";
  import type { Search, SearchResult } from "../interfaces";

  let options: SearchResult[] = [];

  const fetchTitles = async (searchStr: string) => {
    const resp = await fetch(
      `http://www.omdbapi.com/?apikey=cfebe6e7&s=${searchStr}`
    );
    const data = (await resp.json()) as Search;
    if (data.Response === "True") {
      options = data.Search;
    }
  };

  const handleKeyPress = async (searchStr: string) => {
    if (searchStr.length > 2) {
      await fetchTitles(searchStr);
    }
  };
</script>

<div class="flex-1 text-center my-16">
  <h1 class="text-xl font-bold">How good was it really?</h1>
  <div class="text-sm text-gray-500">
    Search for your favorite movie or tv series and see the rating
  </div>
  <div class="flex mt-12 mx-auto">
    <ComboBox
      label="Movies/TV Series"
      name="movies"
      placeholder="Type to search..."
      onSelect={(e) => console.log(e)}
      onKeyPress={handleKeyPress}
      {options}
    />
  </div>
</div>
