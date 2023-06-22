<script lang="ts">
  import { selectedOption } from "../stores/store";
  import type { SearchInfo } from "../interfaces";

  let details: SearchInfo | null = null;
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

<div class="flex flex-col justify-center items-center mt-16">
  {#if details && details?.Poster !== "N/A"}
    <img src={details.Poster} width="150vw" height="auto" alt="Movie poster" />

    {#if details?.Ratings?.length > 0}
      <div class="text-left">
        {#each details.Ratings as rating (rating.Source)}
          <div>{rating.Source}: {rating.Value}</div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
