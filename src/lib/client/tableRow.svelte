<script lang='ts'>
  import { getContext } from 'svelte';
  import type { Context } from 'svelte-simple-modal';
  import Popup from './popup.svelte';
  const { open } = getContext<Context>('simple-modal');


  function showModal(
    data: TimingResponse
  ) {
    open(Popup, {
      rowData: data
    });
  }

  export let rowData: TimingResponse;
</script>

<tr on:click={() => showModal(rowData)}>
  {#each Object.values(rowData) as value}
    <td>{(value) ? value : '\n'}</td>
  {/each}
</tr>

<style>
  /* .fastest {
    color: var(--fastest)
  } */
</style>