<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  let selectedImage: { url: string; key: string } | null = null;
  let showModal = false;

  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

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
      alert('Failed to upload image. Please try again.');
    }
  }

  function openModal(file: { url: string; key: string }) {
    selectedImage = file;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedImage = null;
  }

  async function copyLink() {
    if (!selectedImage) return;
    try {
      await navigator.clipboard.writeText(selectedImage.url);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }

  function downloadImage() {
    if (!selectedImage) return;
    const link = document.createElement('a');
    link.href = selectedImage.url;
    link.download = selectedImage.key.split('/').pop() || 'image';
    link.click();
  }

  async function deleteImage() {
    if (!selectedImage) return;
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/cloudflare?key=${encodeURIComponent(selectedImage.key)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      alert('Image deleted successfully.');
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image. Please try again.');
    }
  }
</script>

<svelte:head>
  <title>Team Spiral Racing | Paddock - Gallery</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=report,upload_file" />
</svelte:head>

<div class="main">
  <section class="description">
    <h2>Description</h2>
    <p>Enjoy pictures of us, our events, and our passion. The gallery is available to all users for viewing purposes. However, only authorized users are allowed to upload their own images.</p>
  </section>

  <section>
    <h2>Gallery</h2>
    {#if data.user.role === "USER"}
    <div id="not-allowed">
      <div>
        <span class="material-symbols-outlined">report</span>
        <h4>Only authenticated users with the role of DRIVER, ADMIN, or STAFF can post images!</h4>
      </div>
    </div>
    {/if}

    <div class="gallery">
      {#if data.user.role !== 'USER'}
      <label for="file-upload" class="upload-icon">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          style="display: none;"
          on:change={handleFileUpload}
        />
        <span class="material-symbols-outlined">upload_file</span>
      </label>
      {/if}
      {#each data.files as file}
        <div
          class="image-item"
          role="button"
          tabindex="0"
          aria-label="Open Image Modal"
          style="background-image: url('{file.url}')"
          on:click={() => openModal(file)}
          on:keydown={(event) => event.key === 'Enter' || event.key === ' ' ? openModal(file) : null}>
        </div>
      {/each}
    </div>
  </section>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  {#if showModal && selectedImage}
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-backdrop" on:click={closeModal} on:keydown={(event) => event.key === 'Escape' ? closeModal() : null} tabindex="0">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="modal-content" on:click|stopPropagation>
      <div class="options">
        <button on:click={copyLink}>Copy Link</button>
        <button on:click={downloadImage}>Download Image</button>
        {#if data.user.role === 'ADMIN' || selectedImage.key.includes(`uploads/${data.user.id}/`)}
          <button on:click={deleteImage}>Delete Image</button>
        {/if}
      </div>
      <div class="image-container">
        <!-- svelte-ignore a11y_img_redundant_alt -->
        <img src={selectedImage.url} alt="Selected Image" />
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
