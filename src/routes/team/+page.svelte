<script lang="ts">
  import drivers from '$lib/drivers.json'
</script>

<svelte:head>
  <title>Team Spiral Racing | Team</title>
</svelte:head>

<div id="main">
  <!-- Initial Screen -->
  <section 
    id="page-entrance" 
    style="background-image: url('/team-splash.jpg')"
  >
    <div id="page-entrance-content">
      <h1>The Team</h1>
    </div>
  </section>

  <section id='drivers'>
    <h2>Drivers</h2>
    <div id='driver-grid'>
      {#each Object.entries(drivers) as [driver, driverData]}

      <a class='driver-card' href="/team/{driver}">
        <div class='content'>
          <span class='driver-number'>{driverData.racingNumber}</span>
          <img src='/drivers/{driver}/outline.png' alt='driver profile' />
          <h3 class='driver-name'>{driverData.driver}</h3>
        </div>
      </a>

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

  /* Drivers */
  #drivers {
    width: var(--central-width);
    margin: 5rem auto;
  }
  #drivers > h2 {
    font-size: 3.5rem;
    margin: 3vh auto;
  }
  #driver-grid {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1fr 1fr;
    grid-gap: 3rem;
    align-items: center;
    justify-items: center;
  }

  .driver-card {
    background: radial-gradient(
      circle,
      rgba(150, 150, 150, 0.1) 0%,
      rgba(100, 100, 100, 0.3) 40%,
      rgba(50, 50, 50, 0.6) 70%,
      rgba(30, 30, 30, 0.9) 100%
    );
    background-size: 200% 200%;
    animation: shimmer 3s infinite;
    width: fit-content;
    padding: 1.2rem;
    border-radius: 30px;
    transition: 0.3s;
  }
  @keyframes shimmer {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .driver-card:hover {
    transform: translateY(-10px) scale(1.05) rotate(-2deg);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
    animation: shimmer-hover 1.5s infinite;
    cursor: pointer;
  }
  @keyframes shimmer-hover {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .driver-card > .content {
    background-color: var(--highlight);
    color: white;
    position: relative;
    height: var(--driver-card-height);
    width: var(--driver-card-width);
    border-radius: 15px;
  }
  .driver-card > .content::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;    
    background: linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
    z-index: 3;
    border-radius: 15px;
  }
  .content span {
    position: absolute;
    left: 5%;
    font-size: 6rem;
    z-index: 1;
    font-family: 'Racing Sans One';
  }
  .content img {
    position: absolute;
    max-height: calc(var(--driver-card-height) - 3em);
    max-width: calc(var(--driver-card-width) - 3em);
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }
  .content .driver-name {
    z-index: 4;
    position: absolute;
    font-size: 3rem;
    font-weight: 900;
    bottom: 0.5em;
    left: 0.5em;
  }

  /* Mobile Styling */
  @media screen and (max-width: 1080px) {
    :global(body) {
      --driver-card-height: 400px !important;
      --driver-card-width: 70vw !important;
    }
    
    #page-entrance #page-entrance-content {
      bottom: 8vh;
    }
    #page-entrance-content h1 {
      font-size: 7rem;
    }

    /* Drivers */
    #drivers {
      width: 95%;
    }
    #driver-grid {
      grid-template-columns: 1fr;
    }
    .driver-card {
      padding: 1rem;
    }
    
    .content span {
      left: 7.5%;
      font-size: 4.5rem;
    }
    .content .driver-name {
      font-size: 2.5rem;
    }
    
  }
</style>
