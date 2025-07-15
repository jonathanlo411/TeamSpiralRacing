<script lang="ts">
  import tracks from '$lib/tracks.json'
  import TrackProfile from '$lib/client/TrackProfile.svelte'

  const trackList: Tracks = tracks;
  const raceTracks = Object.entries(trackList)
    .filter(([_, track]) => track.type === "Race Track")
    .map(([key, track]) => ({ key, ...track }));

  const roadTracks = Object.entries(trackList)
      .filter(([_, track]) => track.type === "Road Course")
      .map(([key, track]) => ({ key, ...track }));
</script>

<svelte:head>
  <title>Team Spiral Racing | Times</title>
</svelte:head>

<div id="main">
  <!-- Initial Screen -->
  <section 
    id="page-entrance" 
    style="background-image: url('/times-splash.jpg')"
  >
    <div id="page-entrance-content">
      <h1>Lap Times</h1>
    </div>
  </section>

  <section id='tracks'>
    <h2>Race Tracks</h2>
    <div class='track-list'>
      {#each raceTracks as trackData}
        <TrackProfile name={trackData.name} linkRef={trackData.key} />
      {/each}
    </div>

    
    <h2>Road Courses</h2>
    <div class='track-list'>
      {#each Object.entries(roadTracks) as [linkRef, trackData]}
        <TrackProfile name={trackData.name} linkRef={trackData.key} />
      {/each}
    </div>
  </section>

</div>

<style>
  :global(body) {
    --driver-card-height: 637px;
    --driver-card-width: 392px;
  }

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
    background: linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0));
    z-index: 1;
  }
  #page-entrance #page-entrance-content {
    position: absolute;
    z-index: 2;
    color: white;
    bottom: 12vh;
    left: 12vw;
  }
  #page-entrance-content h1 {
    font-size: calc(12 * var(--font-size));
    font-weight: 900;
  }

  /* Tracks */
  #tracks {
    width: var(--central-width);
    margin: 5rem auto;
  }
  #tracks > h2 {
    font-size: calc(3.5* var(--font-size));
    margin: 3vh auto;
  }

  /* Mobile Styling */
  @media screen and (max-width: 1080px) {
    #page-entrance #page-entrance-content {
      bottom: 8vh;
    }
    #page-entrance-content h1 {
      font-size: 7rem;
    }
  }

</style>
