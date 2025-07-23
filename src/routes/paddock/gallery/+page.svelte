<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  let selectedFile: { url: string; key: string; type: 'image' | 'video' } | null = null;
  let showModal = false;
  let isUploading = false;

  // Function to determine if a file is a video based on URL or file extension
  function getFileType(url: string): 'image' | 'video' {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.m4v'];
    const lowercaseUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowercaseUrl.includes(ext)) ? 'video' : 'image';
  }

  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    isUploading = true;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/cloudflare', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      window.location.reload();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Please try again.');
      isUploading = false;
    }
  }

  function openModal(file: { url: string; key: string }) {
    const fileType = getFileType(file.url);
    selectedFile = { ...file, type: fileType };
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedFile = null;
  }

  async function copyLink() {
    if (!selectedFile) return;
    try {
      await navigator.clipboard.writeText(selectedFile.url.replaceAll(" ", "%20"));
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }

  function downloadFile() {
    if (!selectedFile) return;
    const link = document.createElement('a');
    link.href = selectedFile.url;
    const fileName = selectedFile.key.split('/').pop() || (selectedFile.type === 'video' ? 'video' : 'image');
    link.download = fileName;
    link.click();
  }

  async function deleteFile() {
    if (!selectedFile) return;
    const fileTypeLabel = selectedFile.type === 'video' ? 'video' : 'image';
    if (!confirm(`Are you sure you want to delete this ${fileTypeLabel}?`)) return;

    try {
      const response = await fetch(`/api/cloudflare?key=${encodeURIComponent(selectedFile.key)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${fileTypeLabel}`);
      }

      alert(`${fileTypeLabel.charAt(0).toUpperCase() + fileTypeLabel.slice(1)} deleted successfully.`);
      window.location.reload();
    } catch (error) {
      console.error(`Failed to delete ${selectedFile.type}:`, error);
      alert(`Failed to delete ${selectedFile.type}. Please try again.`);
    }
  }

  // Function to get thumbnail URL for videos
  function getThumbnailUrl(file: { url: string; key: string }): string {
    const fileType = getFileType(file.url);
    if (fileType === 'video') {
      // For now, use the video URL itself - the browser will show the first frame
      // This works for most modern browsers
      return file.url;
    }
    return file.url;
  }

  // Function to create a video element for thumbnail preview
  function createVideoThumbnail(videoUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.currentTime = 1; // Get frame at 1 second
      
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(thumbnailUrl);
        } else {
          resolve(videoUrl); // Fallback to video URL
        }
      };
      
      video.onerror = () => {
        resolve(videoUrl); // Fallback to video URL
      };
      
      video.src = videoUrl;
      video.load();
    });
  }
</script>

<svelte:head>
  <title>Team Spiral Racing | Paddock - Gallery</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=report,upload_file" />
</svelte:head>

<div class="main">
  <section class="description">
    <h2>Description</h2>
    <p>Enjoy pictures and videos of us, our events, and our passion. The gallery is available to all users for viewing purposes. However, only authorized users are allowed to upload their own images and videos.</p>
  </section>

  <section>
    <h2>Gallery</h2>
    {#if data.user.role === "USER"}
    <div id="not-allowed">
      <div>
        <span class="material-symbols-outlined">report</span>
        <h4>Only authenticated users with the role of DRIVER, ADMIN, or STAFF can post images and videos!</h4>
      </div>
    </div>
    {/if}

    <div class="gallery">
      {#if data.user.role !== 'USER'}
      <label for="file-upload" class="upload-icon {isUploading ? 'uploading' : ''}">
        <input
          id="file-upload"
          type="file"
          accept="image/*,video/*"
          style="display: none;"
          on:change={handleFileUpload}
          disabled={isUploading}
        />
        {#if isUploading}
          <div class="loading-spinner"></div>
        {:else}
          <span class="material-symbols-outlined">upload_file</span>
        {/if}
      </label>
      {/if}
      {#each data.files as file}
        {@const fileType = getFileType(file.url)}
        <div
          class="image-item {fileType === 'video' ? 'video-item' : ''}"
          role="button"
          tabindex="0"
          aria-label="Open {fileType === 'video' ? 'Video' : 'Image'} Modal"
          on:click={() => openModal(file)}
          on:keydown={(event) => event.key === 'Enter' || event.key === ' ' ? openModal(file) : null}>
          
          {#if fileType === 'video'}
            <video 
              class="video-thumbnail" 
              src={file.url} 
              preload="metadata"
              muted
              playsinline>
            </video>
            <div class="video-overlay">
              <div class="play-icon"></div>
            </div>
          {:else}
            <div class="image-background" style="background-image: url('{file.url}')"></div>
          {/if}
        </div>
      {/each}
    </div>
  </section>

  <!-- Modal -->
  {#if showModal && selectedFile}
  <div class="modal-backdrop" on:click={closeModal} on:keydown={(event) => event.key === 'Escape' ? closeModal() : null} tabindex="0">
    <div class="modal-content" on:click|stopPropagation>
      <div class="options">
        <button on:click={copyLink}>Copy Link</button>
        <button on:click={downloadFile}>Download {selectedFile.type === 'video' ? 'Video' : 'Image'}</button>
        {#if data.user.role === 'ADMIN' || selectedFile.key.includes(`uploads/${data.user.id}/`)}
          <button on:click={deleteFile}>Delete {selectedFile.type === 'video' ? 'Video' : 'Image'}</button>
        {/if}
      </div>
      <div class="media-container">
        {#if selectedFile.type === 'video'}
          <video controls preload="metadata" style="max-width: 100%; max-height: 80vh;">
            <source src={selectedFile.url} type="video/mp4">
            <source src={selectedFile.url} type="video/webm">
            <source src={selectedFile.url} type="video/ogg">
            Your browser does not support the video tag.
          </video>
        {:else}
          <img src={selectedFile.url} alt="Selected Image" style="max-width: 100%; max-height: 80vh;" />
        {/if}
      </div>
    </div>
  </div>
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

  .gallery {
    display: grid;
    grid-template-rows: repeat(auto-fill, minmax(150px, 1fr));
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    align-items: center;
    gap: 16px;
  }
  .upload-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed var(--border);
    background: var(--primary);
    height: 100%;
    width: 100%;
    cursor: pointer;
    border-radius: 15px;
    transition: 0.15s;
  }
  .upload-icon:hover {
    opacity: 0.7;
  }
  .image-item {
    background-position: center;
    background-size: cover;
    border-radius: 15px;
    transition: 0.3s;
    height: 150px;
    width: 100%;
  }
  .image-item:hover {
    cursor: pointer;
    opacity: 0.7;
  }
  .video-item {
    position: relative;
    overflow: hidden;
  }

  .video-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }

  .image-background {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
    opacity: 1;
    transition: all 0.2s ease;
  }

  .video-item:hover .video-overlay,
  .video-item:focus .video-overlay {
    background: rgba(0, 0, 0, 0.4);
  }

  .play-icon {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .play-icon:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

  .play-icon::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 55%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-left: 15px solid #333;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }

  .media-container {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 90vw;
    max-height: 80vh;
  }

  /* Ensure videos and images fit nicely in the modal */
  .media-container video,
  .media-container img {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid var(--highlight);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Error Message */
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

  /* Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: var(--secondary);
    padding: 2rem;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    max-width: 80%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  .options {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
    margin-right: 1.5rem;
  }

  .options button {
    background: var(--highlight);
    color: var(--font-color);
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
  }

  .options button:hover {
    opacity: 0.7;
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--primary);
    border-radius: 10px;
    overflow: hidden;
  }

  .image-container img {
    max-width: 100%;
    max-height: 80vh;
    border-radius: 10px;
    object-fit: cover;
  }
</style>
