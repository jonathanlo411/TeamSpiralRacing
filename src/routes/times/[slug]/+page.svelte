<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import tracks from '$lib/tracks.json';
  import Modal from 'svelte-simple-modal'
  import TableRow from '$lib/client/tableRow.svelte';
  import SimpleSelect from '$lib/client/SimpleSelect.svelte'

  // Load track data
  const trackList: Tracks = tracks;
  export let data: PageData;
  let trackData: any = trackList[data.track]

  // Clean timing
  function formatTime(seconds: number): string {
    const totalMilliseconds = Math.floor(seconds * 1000);
    const ms = totalMilliseconds % 1000;
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const s = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const m = totalMinutes % 60;
    const h = Math.floor(totalMinutes / 60);

    const pad = (n: number, z = 2) => String(n).padStart(z, '0');
    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(ms, 3)}`;
    }
    return `${pad(m)}:${pad(s)}.${pad(ms, 3)}`;
  }
  let cleanedDataByConfig = Object.fromEntries(
  Object.entries(data.trackTimesByConfig).map(([config, entries]) => [
      config,
      entries.map((entry) => ({
        ...entry,
        time: formatTime(entry.time)
      }))
    ])
  );
  let firstGroup = Object.values(cleanedDataByConfig).find((entries) => entries.length > 0);
  let headers = firstGroup ? Object.keys(firstGroup[0]) : [];

  // Set select menu
  const configurations = trackData.configuration;
  let configuration = configurations[0];
  console.log(configurations)

  // Update page data if redirecting to other page
  $: trackData = trackList[$page.params.slug];
</script>

<svelte:head>
  <title>Team Spiral Racing | Team - {trackData.name}</title>
</svelte:head>

<div id='main'>
  <!-- Initial Screen -->
  <section
    id="page-entrance"
    style="background-image: url('/tracks/{$page.params.slug}/splash.jpg')"
  >
    <div id="page-entrance-content">
      <h1>{trackData.name}</h1>
      <div id="info-sec">

        <span>
          <h5>Course Type</h5>
          <h6>{trackData.type}</h6>
        </span>
        <span>
          <h5># of Turns</h5>
          <h6>{trackData.turns}</h6>
        </span>
        <span>
          <h5>Location</h5>
          <spacer></spacer>
          <h6><a href="https://www.google.com/maps/@{trackData.location.replaceAll('°', '').replaceAll(' ' , '')},17z" target="_blank">{trackData.location}</a></h6>
        </span>

      </div>
    </div>
  </section>

  <section id="description">
    <h2>Description</h2>
    {@html trackData.description}
  </section>

  <section id="results">
    <div id="config-select">
      <span>Configuration</span>
      <SimpleSelect className='s-select' name="configurations" options={configurations} bind:value={configuration} />
    </div>
    <table>
      {#if cleanedDataByConfig[configuration] && cleanedDataByConfig[configuration].length > 0}
        <thead>
          <tr>
          {#each headers as header}
            <th>{header.toUpperCase()}</th>
          {/each}
          </tr>
        </thead>
        <tbody>
          {#each cleanedDataByConfig[configuration] as tableEntry}
            <Modal classContent='modal-content' >
              <TableRow rowData={tableEntry} />
            </Modal>
          {/each}
        </tbody>
      {:else}
      <thead><tr><th style="text-align: center;">NO DATA AVAILABLE</th></tr></thead>
      {/if}
    </table>
  </section>

</div>

<style>
  :global(body) {
    --driver-card-height: 637px;
    --driver-card-width: 392px;
  }

  /* Entrance */
  #page-entrance {
    background-position: center;
    background-size: cover;
    height: 100vh;
    width: 100vw;
    position: relative;
  }
  #page-entrance::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.2));
    z-index: 1;
  }
  #page-entrance #page-entrance-content {
    position: absolute;
    z-index: 2;
    color: white;
    bottom: 12vh;
    left: 12vw;
    display: flex;
    width: 75%;
    justify-content: space-between;
    align-items: center;
  }
  #page-entrance-content h1 {
    font-size: calc(8 * var(--font-size));
    font-weight: 900;
    width: 35%;
  }

  #info-sec {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 0.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    height: fit-content;
  }
  #info-sec span {
    padding: var(--font-size) 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid white;
  }
  spacer {
    padding: 0 2rem;
  }
  #info-sec span:first-child {
    border-top: none;
  }
  #info-sec span h5 {
    font-size: calc(2 * var(--font-size));
    font-weight: 800;
  }
  #info-sec span h6 {
    font-size: calc(1.5 * var(--font-size));
    font-weight: 400;
    border-radius: 5px;
    padding: calc(0.75 * var(--font-size)) calc(0.25 * var(--font-size));
    white-space: nowrap;
  }
  h6:last-of-type { padding: 0; }
  #info-sec span h6 a {
    color: white;
    text-decoration: none;
    padding: calc(0.75 * var(--font-size)) calc(0.25 * var(--font-size));
    transition: 0.2s;
  }
  #info-sec span h6 a:hover {
    background-color: rgb(131, 131, 131);
    border-radius: 5px;
  }

  /* Track Description */
  #description {
    width: var(--central-width);
    margin: 5vh auto;
    font-size: calc(1.5 * var(--font-size));
    line-height: calc(2 * var(--font-size));
  }
  section h2 {
    font-size: calc(2.5 * var(--font-size));
    margin: 2rem 0;
  }
  :global(#description a), :global(#description a:visited) {
    color: var(--highlight);
  }
  :global(#description img) {
    max-width: 70%;
    max-height: 40vh;
    margin: 2rem auto 0;
    border-radius: 10px;
    display: flex;
  }

  /* Results */
  #config-select {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  #config-select span {
    margin: 1rem;
  }
  :global(.s-select) {
    font-size: 1.05rem;
    padding: 0.5rem;
    margin: 0.5rem;
    outline: none;
    border: none;
    border-radius: 5px;
    border: 1px solid var(--border);
    background-color: var(--primary);
    color: var(--font-color);
    transition: 0.3s;
  }
  #results {
    width: var(--central-width);
    margin: 2rem auto;
    border: 1px solid var(--border);
    border-radius: 5px;
    background-color: var(--secondary);
    overflow-x: auto;
  }
  :global(table) {
    border-collapse: collapse;
    font-size: 1rem;
    width: 100%;
  }
  :global(table thead tr) {
    background-color: var(--primary);
    color: rgb(101, 93, 98);
    font-weight: bold;
    font-size: 0.7rem;
    text-align: left;
  }
  :global(table th),
  :global(table td) {
    padding: 0.4rem;
  }
  :global(table tbody tr) {
    border-bottom: 1px solid var(--border);
  }
  :global(table tbody tr:hover) {
    cursor: pointer;
    background-color: var(--primary);
  }

  /* Modal */
  :global(.modal-content) {
    background-color: var(--secondary);
    border-radius: 5px;
    border: var(--border);
    overflow-x: hidden !important;
  }

  /* Mobile Styling */
  @media screen and (max-width: 1080px) {
    #page-entrance #page-entrance-content {
      flex-direction: column;
      width: 100%;
      bottom: 0;
      left: 0;
    }
    #page-entrance #page-entrance-content {
      bottom: 13vh;
    }
    #page-entrance-content h1 {
      margin-bottom: 2rem;
      font-size: 4rem;
      width: 85%;
      padding-right: 5%;
    }
    #info-sec {
      width: 85%;
    }
    #info-sec span {
      padding: 1rem 0;
    }
    #info-sec span h5 {
      font-size: 1.5rem;
    }
    #info-sec span h6 {
      font-size: 1.3rem;
    }

    /* Driver Description */
    #description {
      font-size: 1.1rem;
      line-height: 1.5rem;
    }
    section h2 {
      font-size: 2rem;
    }
    :global(#description img) {
      max-width: 95% !important;
      max-height: 50vh !important;
    }
  }
</style>