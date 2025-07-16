<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>Team Spiral Racing | Paddock</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=report" />
</svelte:head>

<div id="main">
  <!-- Initial Screen -->
  <section 
    id="page-entrance" 
    style="background-image: url('/paddock-splash.jpg')"
  >
    <div id="page-entrance-content">
      <h1>Welcome to the Paddock, {data.user.firstName}!</h1>
    </div>
  </section>

  <section id="navigate" class="paddock-sec">
    <h2>Navigate</h2>
    {#if data.user && data.user.role === "USER"}
    <div id="not-allowed">
      <div>
        <span class="material-symbols-outlined">report</span>
        <h4>You currently have role USER. To apply to the driver, staff, or admin roles, please contact <a href="mailto:contact@teamspiralracing.com">contact@teamspiralracing.com</a></h4>
      </div>
    </div>
    {/if}
    <div id="nav-grid">
      {#if data.user && data.user.role !== "USER"}
        <a href="/paddock/events" class="nav-item" style="background-image: url('/paddock-nav-1.jpg')"><h4>Events</h4></a>
        <a href="/paddock/blog" class="nav-item" style="background-image: url('/paddock-nav-2.jpg')"><h4>Blog</h4></a>
        <a href="/paddock/timing" class="nav-item" style="background-image: url('/paddock-nav-3.jpg')"><h4>Timing</h4></a>
        <a href="/paddock/gallery" class="nav-item" style="background-image: url('/paddock-nav-4.jpg')"><h4>Gallery</h4></a>
      {:else}
        <a href="/paddock/gallery" class="nav-item" style="background-image: url('/paddock-nav-4.jpg')"><h4>Gallery</h4></a>
      {/if}
    </div>
  </section>

  <section id="events" class="paddock-sec">
    <h2>Events</h2>
    <div id="events-grid">

      <div class="event-item">

      </div>

    </div>
  </section>

</div>

<style>
  /* Main Entrance */
  #page-entrance {
    background-position: center;
    background-size: cover;
    height: 80vh;
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
    background-color: rgba(0, 0, 0, 0.7);
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
    font-size: calc(6 * var(--font-size));
    width: 70%;
    margin-bottom: 2rem;
  }

  /* Content Styling */
  .paddock-sec {
    width: var(--central-width);
    margin: 5rem auto;
  }
  .paddock-sec h2 {
    font-size: calc(3.75 * var(--font-size));
    margin-bottom: 2.5rem;
  }

  /* Navigate */
  #nav-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(2, 30vh);
    grid-gap: 3em;
  }
  .nav-item, .nav-item:visited {
    width: 100%;
    border-radius: 15px;
    background-position: center;
    background-size: cover;
    position: relative;
    color: white;
    text-decoration: none;
    transition: 0.3s;
  }
  .nav-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.2));
    z-index: 1;
    border-radius: 15px;
  }
  .nav-item:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
    animation: shimmer-hover 1.5s infinite;
    cursor: pointer;
  }
  .nav-item h4 {
    position: absolute;
    z-index: 2;
    font-size: calc(3 * var(--font-size));
    bottom: 1em;
    left: 1em;
  }

  
  /* Error Message */
  #not-allowed {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 1.5rem;
    background-color: rgba(255, 137, 131, 0.15);
    border: 1px solid red;
    border-radius: 10px;
    margin: 3rem 0 1.5rem;
    color: red;
    width: 100%;
    font-size: var(--font-size);
  }
  #not-allowed > div {
    display: flex;
    align-items: center;
  }
  #not-allowed span {
    font-size: calc(var(--font-size) * 1.5);
    padding-right: 0.5rem;
  }
  #not-allowed a {
    color: var(--highlight);
  }
</style>