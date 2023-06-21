<script lang="ts">
  import { selectedOption } from "../stores/store";
  import type { SearchInfo } from "../interfaces";

  let details: SearchInfo;

  selectedOption.subscribe(async (value) => {
    if (value) {
      const resp = await fetch(
        `http://www.omdbapi.com/?apikey=cfebe6e7&i=${value.imdbID}&type=episode`
      );
      const data = (await resp.json()) as SearchInfo;
      if (data.Response === "True") {
        details = data;
      }
    }
  });
</script>

<div>
  {#if details}
    {details.Title}
  {/if}
</div>
