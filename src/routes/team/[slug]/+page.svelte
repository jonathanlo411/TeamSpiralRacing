<script lang="ts">
  import type { PageData } from './$types';
  import drivers from '$lib/drivers.json';

  const driverList: Drivers = drivers;
  export let data: PageData;

  const driverData: driverDataType = driverList[data.driver];
</script>

<div id='main'>
  <!-- Initial Screen -->
  <section 
    id="page-entrance" 
    style="background-image: url('/drivers/{driverData.pictureSplash}')"
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
          <h6>{driverData.car}</h6>
        </span>

      </div>
    </div>
  </section>

  <section id="description">
    {@html driverData.description}
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
    font-size: 12rem;
    font-weight: 900;
    width: 30%;
  }

  #info-sec {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 0.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 25%;
  }
  #info-sec span {
    padding: 1.5rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid white;
  }
  #info-sec span:first-child {
    border-top: none;
  }
  #info-sec span h5 {
    font-size: 2rem;
    font-weight: 800;
  }
  #info-sec span h6 {
    font-size: 1.5rem;
    font-weight: 400;
  }

  /* Driver Description */

</style>