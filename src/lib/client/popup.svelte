<script lang='ts'>
  import CarProfile from "./CarProfile.svelte";
  export let rowData: any;
  const excludedKeys = ["proof"]
  
  // Function to extract video ID and start time from YouTube URL
  function parseYouTubeUrl(url: string) {
    try {
      const urlObj = new URL(url);
      let videoId = '';
      let startTime = '';
      
      // Handle different YouTube URL formats
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
        const timeParam = urlObj.searchParams.get('t');
        if (timeParam) {
          // Convert time formats like '57s', '1m23s', '3600' to seconds
          if (timeParam.includes('m') || timeParam.includes('s')) {
            // Parse formats like '1m23s' or '57s'
            const minutes = timeParam.match(/(\d+)m/);
            const seconds = timeParam.match(/(\d+)s/);
            const totalSeconds = (minutes ? parseInt(minutes[1]) * 60 : 0) + (seconds ? parseInt(seconds[1]) : 0);
            startTime = totalSeconds.toString();
          } else {
            // Handle plain number format
            startTime = timeParam;
          }
        }
      } else if (urlObj.hostname.includes('youtu.be')) {
        // Handle youtu.be short URLs
        videoId = urlObj.pathname.slice(1);
        const timeParam = urlObj.searchParams.get('t');
        if (timeParam) {
          startTime = timeParam.replace('s', '');
        }
      }
      
      return { videoId, startTime };
    } catch (error) {
      // Fallback for malformed URLs - try the old method
      const videoId = url.replace("https://www.youtube.com/watch?v=", "").split('&')[0];
      return { videoId, startTime: '' };
    }
  }
  
  const { videoId, startTime } = parseYouTubeUrl(rowData.proof);
  const embedUrl = `https://www.youtube.com/embed/${videoId}${startTime ? `?start=${startTime}` : ''}`;
</script>

<div id='modal'>
  <h1>Details</h1>
  <table>
    <thead>
      <tr>
        <th>RUN DETAILS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each Object.entries(rowData) as [key, value]}
        {#if !excludedKeys.includes(key)}
        <tr>
          <td class='key'>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
          <td class='value'>{(value) ? value : '\n'}</td>
        </tr>
        {/if}
      {/each}
    </tbody>
  </table>
  <div id="video-proof">
    <iframe src="{embedUrl}" title="youtube video"></iframe>
  </div>
  <h2>Metadata</h2>
  <CarProfile linkRef={rowData.car} isModal={true} />
</div>

<style>
  /* General Modal Details */
  #modal {
    background-color: var(--secondary);
    color: var(--font-color);
    overflow-x: hidden;
  }
  h1 {
    font-size: 1.5rem;
  }
  h2 {
    font-size: 1.3rem;
    margin: 2rem 0 1rem;
  }
  /* Table */
  table {
    margin: 1rem auto;
    border: 1px solid var(--border);
  }
  table tbody tr:hover {
    cursor: inherit;
    background-color: inherit;
  }
  :global(.hidden) {
    display: none !important;
  }
  /* Youtube Embed */
  #video-proof {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  iframe {
    width: 95%;
    height: 45vh;
    border: none;
    border-radius: 10px;
  }
</style>