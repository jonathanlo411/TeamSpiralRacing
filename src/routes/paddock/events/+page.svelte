<script lang="ts">
  import tracks from '$lib/tracks.json';
  export let data;
  const trackList = tracks as Tracks;

  let title = '';
  let imageRef = '';
  let datetime = '';
  let locationType = 'track'; // Default to "track"
  let track = '';
  let coordinates = '';
  let description = '';

  async function createEvent() {
    if (!title || !imageRef || !datetime || (!track && !coordinates) || !description) {
      alert('Please fill out all required fields.');
      return;
    }

    const event = {
      title,
      imageRef,
      datetime,
      location: locationType === 'track' ? track : coordinates,
      description,
    };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Event created successfully!');
        // Optionally, reset form fields after successful creation
        title = '';
        imageRef = '';
        datetime = '';
        locationType = 'track';
        track = '';
        coordinates = '';
        description = '';
      } else {
        alert('Error creating event: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create event.');
    }
  }
</script>

<svelte:head>
  <title>Team Spiral Racing | Paddock - Events</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=report" />
</svelte:head>

<div class="main">
  <section class="description">
    <h2>Description</h2>
    <p>Create events for Team Spiral Racing to bring together drivers, enthusiasts, and fans. Whether it's a track day, a touge run, or a meet-up, ensure all details like time, location, and description are accurately filled out for a successful event.</p>
  </section>

  {#if !data.user || data.user.role === 'USER'}
    <section>
      <h2>Create New Event</h2>
      <div id="not-allowed">
        <div>
          <span class="material-symbols-outlined">report</span>
          <h4>Only authenticated users with the role of DRIVER, ADMIN, or STAFF can create events!</h4>
        </div>
      </div>
    </section>
  {:else}
    <section>
      <h2>Create New Event</h2>
      <form on:submit|preventDefault={createEvent}>
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" type="text" bind:value={title} required placeholder="Enter the event title" />
        </div>

        <div class="form-group">
          <label for="imageRef">Image Reference</label>
          <input id="imageRef" type="text" bind:value={imageRef} placeholder="Enter the URL for the splash image" required />
        </div>

        <div class="form-group">
          <label for="datetime">Date and Time</label>
          <input id="datetime" type="datetime-local" bind:value={datetime} required />
        </div>

        <div class="form-group">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label>Location</label>
          <div class="radio-group">
            <label>
              <input type="radio" bind:group={locationType} value="track" />
              <span>Select Track</span>
            </label>
            <label>
              <input type="radio" bind:group={locationType} value="coordinates" />
              <span>Enter Coordinates</span>
            </label>
          </div>
          {#if locationType === 'track'}
            <select bind:value={track} required>
              <option value="" disabled selected>Select a track</option>
              {#each Object.entries(trackList) as [trackRef, trackData]}
                <option value={trackRef}>{trackData.name}</option>
              {/each}
            </select>
          {:else}
            <input type="text" placeholder="Enter coordinates (e.g., 33.747252, -112.633853)" bind:value={coordinates} required />
          {/if}
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" bind:value={description} required></textarea>
        </div>

        <button type="submit">Create Event</button>
      </form>
    </section>
  {/if}
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
  form {
    display: flex;
    flex-direction: column;
  }
  .form-group {
    margin-bottom: 1.5rem;
  }
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
  }
  input, select, textarea, button {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    background-color: var(--primary);
    color: var(--font-color);
    font-size: 1rem;
    font-family: 'Roboto';
  }
  textarea {
    resize: vertical;
    min-height: 100px;
  }
  button {
    margin-top: 1rem;
    background-color: var(--highlight);
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  button:hover {
    background-color: var(--fastest);
  }
  .radio-group {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  .radio-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .radio-group label span {
    display: flex;
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
  
</style>
