<script lang='ts'>
  import CarProfile from "./CarProfile.svelte";

  export let rowData: any;

  const excludedKeys = ["proof"]
  const youtubeRef = rowData.proof.replace("https://www.youtube.com/watch?v=", "")
</script>

<div id='modal'>
  <h1>Details</h1>
  <table>
    <thead>
      <tr>
        <th>RUN DETAILS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each Object.entries(rowData) as [key, value]}
        {#if !excludedKeys.includes(key)}
        <tr>
          <td class='key'>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
          <td class='value'>{(value) ? value : '\n'}</td>
        </tr>
        {/if}
      {/each}
    </tbody>
  </table>

  <div id="video-proof">
    <iframe src="https://www.youtube.com/embed/{youtubeRef}" title="youtube video"></iframe>
  </div>

  <h2>Metadata</h2>
  <CarProfile linkRef={rowData.car} isModal={true} />
</div>


<style>
  /* General Modal Details */
  #modal {
    background-color: var(--secondary);
    color: var(--font-color);
    overflow-x: hidden;
  }
  h1 {
    font-size: 1.5rem;
  }
  h2 {
    font-size: 1.3rem;
    margin: 2rem 0 1rem;
  }

  /* Table */
  table {
    margin: 1rem auto;
    border: 1px solid var(--border);
  }
  table tbody tr:hover {
    cursor: inherit;
    background-color: inherit;
  }

  :global(.hidden) {
    display: none !important;
  }

  /* Youtube Embed */
  #video-proof {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  iframe {
    width: 95%;
    height: 45vh;
    border: none;
    border-radius: 10px;
  }
</style>