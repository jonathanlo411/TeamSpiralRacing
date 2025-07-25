<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import drivers from '$lib/drivers.json';
  import cars from '$lib/cars.json';
  import CarProfile from '$lib/client/CarProfile.svelte'

  // Load driver data
  const driverList: Drivers = drivers;
  const carList: Cars = cars;
  export let data: PageData;
  let driverData: driverDataType = driverList[data.driver];
  let driverCar = carList[driverData["cars"][0]]

  // Update page data if redirecting to other driver
  $: driverData = driverList[$page.params.slug];
</script>

<svelte:head>
  <title>Team Spiral Racing | Team - {driverData.driver}</title>
</svelte:head>

<div id='main'>
  <!-- Initial Screen -->
  <section 
    id="page-entrance" 
    style="background-image: url('/drivers/{$page.params.slug}/splash.jpg')"
  >
    <div id="page-entrance-content">
      <h1>{driverData.driver}</h1>
      <div id="info-sec">

        <span>
          <h5>Racing Number</h5>
          <h6>{driverData.racingNumber}</h6>
        </span>
        <span>
          <h5>Born</h5>
          <h6>{driverData.birthday}</h6>
        </span>
        <span>
          <h5>Car</h5>
          <spacer></spacer>
          <h6>{driverCar.year} {driverCar.make} {driverCar.model}</h6>
        </span>

      </div>
    </div>
  </section>

  <section id="description">
    <h2>Biography</h2>
    {@html driverData.description}
  </section>

  <section id="cars">
    <h2>Cars</h2>
    {#if driverData.cars.length === 0}
      <p>N/A</p>
    {:else}
      {#each driverData.cars as car}
        <CarProfile linkRef={car} />
      {/each}
    {/if}
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
    font-size: calc(10 * var(--font-size));
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
    padding: calc(0.75 * var(--font-size)) calc(0.25 * var(--font-size));
    white-space: nowrap;
  }

  /* Driver Description */
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
  :global(.p-img) {
    display: flex;
    justify-content: space-evenly;
  }
  :global(.p-img img) {
    margin: 2rem 0rem 0 !important;
  }

  /* Cars */
  #cars {
    width: var(--central-width);
    margin: 5vh auto;
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
    :global(.p-img) {
      flex-direction: column;
    }
  }
</style>