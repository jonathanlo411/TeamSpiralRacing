<script lang="ts">
  import tracks from '$lib/tracks.json';
  import cars from '$lib/cars.json';
  import type { PageData } from './$types';

  export let data: PageData;
  const trackList = tracks as Tracks;
  const carList = cars as Cars;

  let userCars: Record<string, carDataType> = {};
  for (let i = 0; i < data.user.cars.length; i++) {
    const carRef = data.user.cars[i];
    userCars[carRef] = carList[carRef];
  }

  let selectedTrack = '';
  let configuration = '';
  let configurations: string[] = [];
  let date = '';
  let car = '';
  let tag = '';
  let tags: string[] = [];
  let timeMinutes = '';
  let timeSeconds = '';
  let timeMilliseconds = '';
  let proof = '';
  let validationMessage = '';
  let isSubmitting = false;

  $: configurations = selectedTrack ? trackList[selectedTrack]?.configuration || [] : [];
  $: tags = car ? userCars[car]?.history.map((entry) => entry.tag) || [] : [];

  const handleSubmit = async () => {
    validationMessage = '';
    if (!/^(https:\/\/)?(www\.)?youtube\.com\/watch\?v=/.test(proof)) {
      validationMessage = 'Proof must be a valid YouTube link.';
      return;
    }

    const totalSeconds =
      parseFloat(timeMinutes) * 60 +
      parseFloat(timeSeconds) +
      parseFloat(timeMilliseconds) / 1000;

    isSubmitting = true;

    try {
      const response = await fetch('/api/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: selectedTrack,
          configuration,
          date,
          car,
          tag,
          time: totalSeconds,
          proof,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit time');

      selectedTrack = '';
      configuration = '';
      date = '';
      car = '';
      tag = '';
      timeMinutes = '';
      timeSeconds = '';
      timeMilliseconds = '';
      proof = '';

      alert('Time submitted successfully!');
    } catch (error) {
      validationMessage = 'Failed to submit time. Please try again.';
    } finally {
      isSubmitting = false;
    }
  };
</script>

<svelte:head>
  <title>Team Spiral Racing | Paddock - Timing</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=report" />
</svelte:head>

<div class="main">
  <section class="description">
    <h2>Description</h2>
    <p>
      We track lap times across different tracks and car configurations. Make sure to include video proof of your run for verification. Ensure that your video proof starts and stops at the expected start and stop points as designated under the track profile if it is a Road Course.
    </p>
  </section>

  <section class="submission">
    <h2>Submit Time</h2>
    <p>Enter your race details below. All fields are required for submission.</p>
    {#if data.user.role === "DRIVER"}
    
    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="track">Track</label>
        <select id="track" bind:value={selectedTrack} required>
          <option value="">Select a track</option>
          {#each Object.entries(trackList) as [ref, trackData]}
            <option value={ref}>{trackData.name}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="configuration">Configuration</label>
        <select id="configuration" bind:value={configuration} required>
          <option value="">Select a configuration</option>
          {#each configurations as config}
            <option value={config}>{config}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="date">Race Date</label>
        <input type="date" id="date" bind:value={date} required />
      </div>

      <div class="form-group">
        <label for="car">Car</label>
        <select id="car" bind:value={car} required>
          <option value="">Select from your cars</option>
          {#each Object.entries(userCars) as [ref, carData]}
            <option value={ref}>{carData.name} ({carData.year} {carData.make} {carData.model})</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="tag">Tag</label>
        <select id="tag" bind:value={tag} required>
          <option value="">Select a tag</option>
          {#each tags as carTag}
            <option value={carTag}>{carTag}</option>
          {/each}
        </select>
      </div>

      <div class="form-group time-group">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label>Time</label>
        <div class="time-inputs">
          <div class="time-input-group">
            <input
              type="number"
              bind:value={timeMinutes}
              min="0"
              placeholder="Min"
              required
            />
            <span>:</span>
          </div>
          <div class="time-input-group">
            <input
              type="number"
              bind:value={timeSeconds}
              min="0"
              max="59"
              placeholder="Sec"
              required
            />
            <span>.</span>
          </div>
          <input
            type="number"
            bind:value={timeMilliseconds}
            min="0"
            max="999"
            placeholder="Ms"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label for="proof">YouTube Proof Link</label>
        <input
          type="url"
          id="proof"
          bind:value={proof}
          placeholder="https://youtube.com/watch?v=..."
          required
        />
      </div>

      {#if validationMessage}
        <p class="error">{validationMessage}</p>
      {/if}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Time'}
      </button>
      
    </form>

    {:else}

      <div id="not-allowed">
        <div>
          <span class="material-symbols-outlined">report</span>
          <h4>Only authenticated users with the role of DRIVER can post times!</h4>
        </div>
      </div>

    {/if}
  </section>
</div>

<style>
  .main {
    width: 100%;
    min-height: 100vh;
    padding: 10rem 0 2rem;
  }

  section {
    width: var(--central-width);
    margin: 0 auto 3rem;
    padding: 2rem;
    background-color: var(--secondary);
    border-radius: 8px;
    border: 1px solid var(--border);
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    color: var(--font-color);
    line-height: 1.6;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  #date {
    font-family: 'Roboto';
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: var(--font-color);
  }

  input, select {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--primary);
    border: 1px solid var(--border);
    border-radius: 5px;
    color: var(--font-color);
    font-size: 1rem;
  }

  .time-inputs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .time-input-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .time-input-group span {
    color: var(--font-color);
    font-size: 1.5rem;
    font-weight: bold;
  }

  button {
    width: 100%;
    padding: 1rem;
    background-color: var(--highlight);
    color: var(--font-color);
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    opacity: 0.9;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .error {
    color: #f85149;
    margin-bottom: 1rem;
  }
  
  #not-allowed {
    display: flex;
    align-items: center;
    font-size: 1rem;
    justify-content: space-around;
    padding: 1.5rem;
    background-color: rgba(255, 137, 131, 0.15);
    border: 1px solid red;
    border-radius: 10px;
    margin: 3rem 0 1.5rem;
    color: red;
    width: 100%;
    --font-size: 1.25rem;
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

  @media screen and (max-width: 768px) {
    section {
      padding: 1.5rem;
    }

    .time-inputs {
      grid-template-columns: 1fr;
    }

    .time-input-group span {
      transform: rotate(90deg);
    }
  }
</style>