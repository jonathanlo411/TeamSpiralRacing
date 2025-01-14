<script lang="ts">
  import cars from '$lib/cars.json'
  import CarProfile from '$lib/client/CarProfile.svelte'
</script>

<svelte:head>
  <title>Team Spiral Racing | Cars</title>
</svelte:head>

<div id="main">
  <!-- Initial Screen -->
  <section 
    id="page-entrance" 
    style="background-image: url('/carousel-1.jpg')"
  >
    <div id="page-entrance-content">
      <h1>Our Cars</h1>
    </div>
  </section>

  <section id='cars'>
    <h2>Cars</h2>
    <div id='car-list'>
      {#each Object.keys(cars) as carRef}
        <CarProfile linkRef={carRef} />
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
    font-size: 12rem;
    font-weight: 900;
  }

  /* Cars */
  #cars {
    width: var(--central-width);
    margin: 5rem auto;
  }
  #cars > h2 {
    font-size: 3.5rem;
    margin: 3vh auto;
  }

</style>
