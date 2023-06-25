<script>
  import "../app.css";
</script>

<svelte:head>
  <title>How good was it really?</title>
  <meta name="description" content="Movie rater" />
  <meta name="description" content="Movie rating" />
  <meta name="description" content="Get my movie rating" />
  <meta name="description" content="How good was x" />
</svelte:head>
<div class="w-screen min-h-screen bg-gradient-to-r from-teal-200 to-lime-200">
  <div class="flex container w-full h-full mx-auto px-2">
    <slot />
  </div>
</div>
