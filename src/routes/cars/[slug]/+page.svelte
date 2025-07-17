<script lang="ts">
  import type { PageData } from './$types';
  import cars from '$lib/cars.json';

  const carsList: Cars = cars;
  export let data: PageData;
  let carData: carDataType = carsList[data.car];
  let tags = carData["history"].map((x) => x.tag);

  let tagIndex = tags.length - 1;
  let currentTag = tags[tagIndex];
  let compareTag = 'none';
  let tagHistory = carData.history[tagIndex];

  function getModsByTag(tag: string) {
    const history = carData.history[tags.indexOf(tag)];
    return {
      power: history.power,
      underbody: history.underbody,
      body: history.body,
      interior: history.interior,
      misc: history.misc
    };
  }

  function computeDiff(targetTag: string[], sourceTag: string[]) {
    const added = targetTag.filter(mod => !sourceTag.includes(mod));
    const removed = sourceTag.filter(mod => !targetTag.includes(mod));
    const unchanged = targetTag.filter(mod => sourceTag.includes(mod));
    return { added, removed, unchanged };
  }

  $: {
    tagIndex = tags.indexOf(currentTag);
    tagHistory = carData.history[tagIndex];
  }

  $: diffResult = compareTag !== 'none' ? {
    power: computeDiff(getModsByTag(compareTag).power, getModsByTag(currentTag).power),
    underbody: computeDiff(getModsByTag(compareTag).underbody, getModsByTag(currentTag).underbody),
    body: computeDiff(getModsByTag(compareTag).body, getModsByTag(currentTag).body),
    interior: computeDiff(getModsByTag(compareTag).interior, getModsByTag(currentTag).interior),
    misc: computeDiff(getModsByTag(compareTag).misc, getModsByTag(currentTag).misc)
  } : null;
</script>

<svelte:head>
  <title>Team Spiral Racing | Cars - {carData.name}</title>
</svelte:head>

<div id="main">
  <!-- Initial Screen -->
  <section 
    id="page-entrance" 
    style="background-image: url('/cars/{data.car}/{currentTag}/splash.jpg')"
  >
    <div id="page-entrance-content">
      <h1>{carData.name}<p>{currentTag}</p></h1>
      <div id="info-sec">

        <span>
          <h5>Year</h5>
          <h6>{carData.year}</h6>
        </span>
        <span>
          <h5>Make</h5>
          <h6>{carData.make}</h6>
        </span>
        <span>
          <h5>Model</h5>
          <h6>{carData.model}</h6>
        </span>
        <span>
          <h5>Updated</h5>
          <spacer></spacer>
          <h6>{tagHistory.updateDate}</h6>
        </span>

      </div>
    </div>
  </section>

  <section id="description">
    <h2>Description</h2>
    {@html carData.intro}
  </section>

      
  <section id="mods">
    <h2>Modifications</h2>
    <p>{tagHistory.description}</p>
    
    <div id="mods-list">
      <!-- Power -->
      <div class="mods-section">
        <h3>Power</h3>
        <div class="mod-items">
          {#if !diffResult}
            {#if tagHistory.power.length === 0}
              <span class="mod-item">N/A</span>
            {:else}
              {#each tagHistory.power as mod}
                <span class="mod-item">{mod}</span>
              {/each}
            {/if}
          {:else}
            {#each diffResult.power.unchanged as mod}
              <span class="mod-item">{mod}</span>
            {/each}
            {#each diffResult.power.added as mod}
              <span class="mod-item removed">- {mod}</span>
            {/each}
            {#each diffResult.power.removed as mod}
              <span class="mod-item added">+ {mod}</span>
            {/each}
          {/if}
        </div>
      </div>
  
      <!-- Underbody -->
      <div class="mods-section">
        <h3>Underbody</h3>
        <div class="mod-items">
          {#if !diffResult}
            {#if tagHistory.underbody.length === 0}
              <span class="mod-item">N/A</span>
            {:else}
              {#each tagHistory.underbody as mod}
                <span class="mod-item">{mod}</span>
              {/each}
            {/if}
          {:else}
            {#each diffResult.underbody.unchanged as mod}
              <span class="mod-item">{mod}</span>
            {/each}
            {#each diffResult.underbody.added as mod}
              <span class="mod-item removed">- {mod}</span>
            {/each}
            {#each diffResult.underbody.removed as mod}
              <span class="mod-item added">+ {mod}</span>
            {/each}
          {/if}
        </div>
      </div>
  
      <!-- Body -->
      <div class="mods-section">
        <h3>Body</h3>
        <div class="mod-items">
          {#if !diffResult}
            {#if tagHistory.body.length === 0}
              <span class="mod-item">N/A</span>
            {:else}
              {#each tagHistory.body as mod}
                <span class="mod-item">{mod}</span>
              {/each}
            {/if}
          {:else}
            {#each diffResult.body.unchanged as mod}
              <span class="mod-item">{mod}</span>
            {/each}
            {#each diffResult.body.added as mod}
              <span class="mod-item removed">- {mod}</span>
            {/each}
            {#each diffResult.body.removed as mod}
              <span class="mod-item added">+ {mod}</span>
            {/each}
          {/if}
        </div>
      </div>
  
      <!-- Interior -->
      <div class="mods-section">
        <h3>Interior</h3>
        <div class="mod-items">
          {#if !diffResult}
            {#if tagHistory.interior.length === 0}
              <span class="mod-item">N/A</span>
            {:else}
              {#each tagHistory.interior as mod}
                <span class="mod-item">{mod}</span>
              {/each}
            {/if}
          {:else}
            {#each diffResult.interior.unchanged as mod}
              <span class="mod-item">{mod}</span>
            {/each}
            {#each diffResult.interior.added as mod}
              <span class="mod-item removed">- {mod}</span>
            {/each}
            {#each diffResult.interior.removed as mod}
              <span class="mod-item added">+ {mod}</span>
            {/each}
          {/if}
        </div>
      </div>
  
      <!-- Misc -->
      <div class="mods-section">
        <h3>Miscellaneous</h3>
        <div class="mod-items">
          {#if !diffResult}
            {#if tagHistory.misc.length === 0}
              <span class="mod-item">N/A</span>
            {:else}
              {#each tagHistory.misc as mod}
                <span class="mod-item">{mod}</span>
              {/each}
            {/if}
          {:else}
            {#each diffResult.misc.unchanged as mod}
              <span class="mod-item">{mod}</span>
            {/each}
            {#each diffResult.misc.added as mod}
              <span class="mod-item removed">- {mod}</span>
            {/each}
            {#each diffResult.misc.removed as mod}
              <span class="mod-item added">+ {mod}</span>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  
    <div id="comparison">
      <h3>Compare Diffs:</h3>
      <select 
        bind:value={currentTag}
        on:change={() => {
          if (compareTag === currentTag) {
            compareTag = 'none';
          }
        }}
      >
        {#each tags as tag}
          <option value={tag}>{tag}</option>
        {/each}
      </select>
      <h6>←</h6>
      <select bind:value={compareTag}>
        <option value="none">None</option>
        {#each tags as tag}
          {#if tag !== currentTag}
            <option value={tag}>{tag}</option>
          {/if}
        {/each}
      </select>
    </div>
  </section>

  <section id="timeline">
    <h2>Timeline</h2>
    <div class="timeline-container">
      {#each [...carData.history].reverse() as entry}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          class="timeline-entry {entry.tag === currentTag ? 'current' : ''}"
          on:click={() => {
            tagIndex = tags.indexOf(entry.tag);
            currentTag = entry.tag;
            tagHistory = carData.history[tagIndex];
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div class="tag-info">
            <span class="tag">{entry.tag}</span>
            <span class="date">{entry.updateDate}</span>
          </div>
          <p class="description">{entry.description}</p>
        </div>
      {/each}
    </div>
   </section>

</div>

<style>
  /* Intro Page */
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
    font-size: calc(8.5 * var(--font-size));
    font-weight: 900;
    width: 35%;
  }
  #page-entrance-content h1 p {
    color: var(--highlight);
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

  /* Description */
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

  /* Modifications */
  #mods {
    width: var(--central-width);
    margin: 5vh auto;
    font-size: calc(1.5 * var(--font-size));
  }
  #mods > p {
    font-weight: 200;
    margin-bottom: 2rem;
  }
  #mods-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 1.2rem;
  }
  .mods-section h3 {
    font-weight: 400;
  }
  .mod-items {
    display: flex;
    flex-direction: column;
    margin: 0.2rem 0;
    font-weight: 200;
  }

  /* Comparison */
  #comparison {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 2.5rem 0;
    background-color: var(--secondary);
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    gap: 1rem;
    width: fit-content;
  }
  #comparison h3 {
    font-size: calc(1.3 * var(--font-size));
    font-weight: 400;
    margin-right: 1.2rem;
    color: var(--font-color);
  }
  #comparison select {
    font-size: var(--font-size);
    font-weight: 400;
    padding: 0.5rem 3rem;
    color: var(--font-color);
    background-color: var(--primary);
    border: 1px solid var(--border);
    border-radius: 5px;
    outline: none;
    transition: all 0.3s ease;
    cursor: pointer;
    font-family: 'Roboto';
  }
  #comparison h6 {
    font-size: calc(1.7 * var(--font-size));
    font-weight: 700;
  }
  .mod-item.added {
    background-color: rgba(46, 160, 67, 0.15);
    border-color: rgba(46, 160, 67, 0.4);
    color: #2ea043;
  }

  .mod-item.removed {
    background-color: rgba(248, 81, 73, 0.15);
    border-color: rgba(248, 81, 73, 0.4);
    color: #f85149;
  }

  /* Timeline */
  #timeline {
    width: var(--central-width);
    margin: 5vh auto;
    font-size: calc(1.5 * var(--font-size));
    line-height: calc(2 * var(--font-size));
  }
  .timeline-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .timeline-entry {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: 0.3s;
  }
  .timeline-entry:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
  }
  .timeline-entry.current {
    border: 1px solid var(--highlight);
  }
  .tag-info {
    min-width: 120px;
  }
  .tag {
    display: block;
    font-weight: bold;
    font-size: calc(2 * var(--font-size));
  }
  .date {
    font-size: calc(0.9 * var(--font-size));
    opacity: 0.8;
    }
  .description {
    flex-grow: 1;
    font-size: calc(1.2 * var(--font-size));
    font-weight: 200;
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

    /* Modifications */
    #mods {
      font-size: 1.1rem;
      line-height: 1.5rem;
    }
    #mods-list {
      grid-template-columns: 1fr;
    }

    /* Comparison */
    #comparison {
      flex-direction: column;
      width: 100%;
      margin: 5vh auto;
    }
    #comparison h3 {
      font-size: 1.5rem;
      text-align: center;
      margin-right: 0;
    }
    #comparison select {
      width: 100%;
      text-align: center;
    }
    #comparison h6 {
      font-size: 1.1rem;
      transform: rotate(90deg);
    }

    /* Timeline */
    .timeline-entry {
      flex-direction: column;
      align-items: start;
      padding: 1.5rem;
    }
    .description {
      font-size: 1rem;
      line-height: 1.5rem;
    }

  }

</style>
