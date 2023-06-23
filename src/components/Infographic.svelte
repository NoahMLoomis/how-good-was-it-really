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

<div class="flex flex-col justify-center items-center mt-12">
  {#if details && details?.Poster !== "N/A"}
    {#if details?.Ratings?.length > 0}
      <div
        class="text-left rounded bg-gradient-to-br mb-2 from-teal-300 to-lime-300 p-1 shadow-md"
      >
        {#each details.Ratings as rating (rating.Source)}
          <div class="font-bold">{rating.Source}: {rating.Value}</div>
        {/each}
      </div>
    {/if}
    <img
      src={details.Poster}
      width="160vw"
      height="auto"
      class="rounded"
      alt="Movie poster"
    />
  {/if}
</div>
