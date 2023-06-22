<script lang="ts">
  import { draw } from "svelte/transition";

  import * as d3 from "d3";
  import clsx from "clsx";
  // props
  export let data: { age: number; temp: number }[] = [];
  export let show = false;
  export let pos: string = "";

  // scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data.map((d) => d.age)) as [number, number])
    .range([5, 95]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data.map((d) => d.temp)) as [number, number])
    .range([5, 75]);

  // the path generator
  const pathLine = d3
    .line<{ age: number; temp: number }>()
    .x((d) => xScale(d.age))
    .y((d) => yScale(d.temp))
    .curve(d3.curveBasis);
</script>

<svg viewBox="0 0 100 100" class={`absolute ${pos}`}>
  {#if show}
    <path transition:draw={{ duration: 2000 }} d={pathLine(data)} />
  {/if}
</svg>

<style>
  path {
    stroke: purple;
    stroke-width: 2;
    fill: none;
    stroke-linecap: round;
  }
</style>
