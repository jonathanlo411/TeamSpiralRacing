<script lang='ts'>
  export let linkRef: string;
  import cars from '$lib/cars.json'

  const carsData = cars as Cars;
  let carData = carsData[linkRef] as carDataType;
  let tags = carData["history"].map((x) => x.tag)

  // Start with the most recent verion of the car
  let tagIndex = tags.length - 1;
  $: currentTag = tags[tagIndex];

  function iteratePreviousVersion(): void {
      tagIndex = Math.max(0, tagIndex - 1); 
  }

  function iterateNextVersion(): void {
      tagIndex = Math.min(tags.length - 1, tagIndex + 1); 
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=arrow_forward" />
</svelte:head>

<div id="container-resize">
<a class='car-card' href="/cars/{linkRef}">
  <div class='content'>
    <h1>{carData.name}<p>{currentTag}</p></h1>
    <div class="controls">
      <button class="up-button" 
              on:click={(e) => {
                e.preventDefault();
                e.stopPropagation();
                iterateNextVersion();
              }}
        disabled={tagIndex === tags.length - 1}>
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
      <button class="down-button" 
              on:click={(e) => {
                e.preventDefault();
                e.stopPropagation();
                iteratePreviousVersion();
              }}
              disabled={tagIndex === 0}>
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
    <img src="/cars/{linkRef}/{currentTag}/outline.png" alt="outline of car" />
  </div>
</a>
</div>

<style>
  #container-resize {
    container-type: inline-size;
    container-name: modal;
  }

  .car-card, .car-card:visited {
    background: radial-gradient(
      circle,
      rgba(150, 150, 150, 0.1) 0%,
      rgba(100, 100, 100, 0.3) 40%,
      rgba(50, 50, 50, 0.6) 70%,
      rgba(30, 30, 30, 0.9) 100%
    );
    background-size: 200% 200%;
    animation: shimmer 3s infinite;
    padding: 1.2rem;
    display: block;
    margin: 4rem 0;
    border-radius: 30px;
    transition: 0.3s;
    text-decoration: none;
    color: white;
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
  .car-card:hover {
    transform: translateY(-10px) scale(1.05);
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

  .car-card .content {
    background-color: var(--highlight);
    border-radius: 15px;
    position: relative;
    height: 650px;
  }
  .content h1 {
    font-size: calc(10 * var(--font-size));
    position: absolute;
    padding-right: 2rem;
    display: inline-block;
    top: 2rem;
    left: 5rem;
    display: inline;
    z-index: 1;
  }
  .content h1 p {
    display: inline;
    margin-left: 1rem;
    color: orange;
  }
  .content img {
    width: 90%;
    margin: auto;
    padding: 13rem 0 2rem;
    display: flex;
    z-index: 2;
    position: relative;
  }
  
  .controls {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 1rem;
    left: 1rem;
  }
  .controls > button {
    z-index: 10;
    margin: 0.5rem;
    height: 2rem;
    width: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0;
    border: none;
    border-radius: 100px;
  }
  .controls > button:hover {
    cursor: pointer;
  }
  button:disabled:hover,
  button[disabled]:hover {
      cursor: not-allowed;
  }
  .up-button { transform: rotate(-90deg); }
  .down-button { transform: rotate(90deg); }

  /* Medium Styling */
  @media screen and (min-width: 1080px) and (max-width: 1920px) {
    .car-card .content {
      height: 550px;
    }
    .content img {
      padding-top: 10rem;
    }
  }

  /* Mobile Styling */
  @media screen and (max-width: 1080px) {
    .car-card, .car-card:visited {
      padding: 1rem;
    }
    
    .car-card .content {
      height: 300px;
    }
    .content h1 {
      font-size: 3rem;
      top: 5rem;
      left: 1.25rem;
      display: block;
    }
    .content h1 p {
      display: block;
      margin-left: 0rem;
    }
    
    .controls {
      flex-direction: row;
    }
    .up-button { transform: rotate(180deg); }
    .down-button { transform: rotate(0deg); }
  }

  @container modal (max-width: 700px) {
    .car-card, .car-card:visited {
      padding: 1rem;
      margin: 0.5rem 1rem;
    }

    .car-card .content {
      height: 300px;
    }
    .content h1 {
      font-size: 3rem;
      top: 5rem;
      left: 1.25rem;
      display: block;
    }
    .content h1 p {
      display: block;
      margin-left: 0rem;
    }

    .content img {
      padding: 8rem 0 2rem;
    }
    .controls {
      flex-direction: row;
    }
    .up-button { transform: rotate(180deg); }
    .down-button { transform: rotate(0deg); }
  }

</style>