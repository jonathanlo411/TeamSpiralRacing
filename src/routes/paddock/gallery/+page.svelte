<script lang="ts">
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  export let data: PageData;

  let selectedFile: { url: string; key: string; type: 'image' | 'video' } | null = null;
  let showModal = false;
  let isUploading = false;

  // Pagination
  $: currentPage = parseInt($page.url.searchParams.get('page') || '1');
  $: totalPages = data.totalPages || 1;
  $: hasNextPage = currentPage < totalPages;
  $: hasPrevPage = currentPage > 1;

  // Toast notification system
  let toasts: Array<{ id: number; message: string; type: 'success' | 'error' | 'info'; visible: boolean }> = [];
  let toastId = 0;

  function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = toastId++;
    const toast = { id, message, type, visible: true };
    toasts = [...toasts, toast];

    // Auto-hide after 4 seconds
    setTimeout(() => {
      hideToast(id);
    }, 4000);
  }

  function hideToast(id: number) {
    toasts = toasts.map(toast => 
      toast.id === id ? { ...toast, visible: false } : toast
    );

    // Remove from array after animation completes
    setTimeout(() => {
      toasts = toasts.filter(toast => toast.id !== id);
    }, 300);
  }

  // Pagination functions
  function goToPage(pageNum: number) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', pageNum.toString());
    goto(url.toString());
  }

  function nextPage() {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (hasPrevPage) {
      goToPage(currentPage - 1);
    }
  }

  function getPageNumbers() {
    const pages = [];
    const maxVisible = 5; // Maximum number of page buttons to show
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (currentPage <= 3) {
        // Show first pages
        for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > maxVisible) {
          pages.push('...');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last pages
        pages.push(1);
        if (totalPages > maxVisible) {
          pages.push('...');
        }
        for (let i = Math.max(totalPages - maxVisible + 1, 1); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }

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

      showToast('File uploaded successfully!', 'success');
      // Reload to page 1 to see the new file (since it will be most recent)
      const url = new URL(window.location.href);
      url.searchParams.set('page', '1');
      window.location.href = url.toString();
    } catch (error) {
      console.error('Upload failed:', error);
      showToast('Failed to upload file. Please try again.', 'error');
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
      showToast('Link copied to clipboard!', 'success');
    } catch (error) {
      console.error('Failed to copy link:', error);
      showToast('Failed to copy link to clipboard', 'error');
    }
  }

  function downloadFile() {
    if (!selectedFile) return;
    const link = document.createElement('a');
    link.href = selectedFile.url;
    const fileName = selectedFile.key.split('/').pop() || (selectedFile.type === 'video' ? 'video' : 'image');
    link.download = fileName;
    link.click();
    showToast('Download started', 'info');
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

      showToast(`${fileTypeLabel.charAt(0).toUpperCase() + fileTypeLabel.slice(1)} deleted successfully!`, 'success');
      closeModal();
      // Stay on current page after deletion
      window.location.reload();
    } catch (error) {
      console.error(`Failed to delete ${selectedFile.type}:`, error);
      showToast(`Failed to delete ${selectedFile.type}. Please try again.`, 'error');
    }
  }
</script>

<svelte:head>
  <title>Team Spiral Racing | Paddock - Gallery</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</svelte:head>

<div class="main">
  <section class="description">
    <h2>Description</h2>
    <p>Enjoy pictures and videos of us, our events, and our passion. The gallery is available to all users for viewing purposes. However, only authorized users are allowed to upload their own images and videos.</p>
  </section>

  <section>
    <div class="section-header">
      <h2>Gallery</h2>
      <div class="gallery-info">
        <span class="item-count">
          Showing {data.files.length} of {data.totalFiles || data.files.length} files
        </span>
        {#if totalPages > 1}
          <span class="page-info">
            Page {currentPage} of {totalPages}
          </span>
        {/if}
      </div>
    </div>
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

    <!-- Pagination -->
    {#if totalPages > 1}
    <div class="pagination">
      <button 
        class="pagination-btn" 
        class:disabled={!hasPrevPage}
        on:click={prevPage}
        disabled={!hasPrevPage}
      >
        <span class="material-symbols-outlined">keyboard_arrow_left</span>
        Previous
      </button>

      <div class="page-numbers">
        {#each getPageNumbers() as pageNum}
          {#if pageNum === '...'}
            <span class="pagination-ellipsis">...</span>
          {:else}
            <button 
              class="page-number" 
              class:active={pageNum === currentPage}
              on:click={() => goToPage(pageNum)}
            >
              {pageNum}
            </button>
          {/if}
        {/each}
      </div>

      <button 
        class="pagination-btn" 
        class:disabled={!hasNextPage}
        on:click={nextPage}
        disabled={!hasNextPage}
      >
        Next
        <span class="material-symbols-outlined">keyboard_arrow_right</span>
      </button>
    </div>
    {/if}
  </section>

  <!-- Modal -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  {#if showModal && selectedFile}
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
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
          <!-- svelte-ignore a11y_media_has_caption -->
          <video controls preload="metadata" style="max-width: 100%; max-height: 80vh;">
            <source src={selectedFile.url} type="video/mp4">
            <source src={selectedFile.url} type="video/webm">
            <source src={selectedFile.url} type="video/ogg">
            Your browser does not support the video tag.
          </video>
        {:else}
          <!-- svelte-ignore a11y_img_redundant_alt -->
          <img src={selectedFile.url} alt="Selected Image" style="max-width: 100%; max-height: 80vh;" />
        {/if}
      </div>
    </div>
  </div>
  {/if}

  <!-- Toast Container -->
  <div class="toast-container">
    {#each toasts as toast (toast.id)}
      <div class="toast toast-{toast.type} {toast.visible ? 'toast-visible' : 'toast-hidden'}">
        <div class="toast-content">
          <span class="toast-icon material-icons">
            {#if toast.type === 'success'}
              check_circle
            {:else if toast.type === 'error'}
              error
            {:else}
              info
            {/if}
          </span>
          <span class="toast-message">{toast.message}</span>
        </div>
        <button class="toast-close" on:click={() => hideToast(toast.id)}>
          <span class="material-icons">close</span>
        </button>
      </div>
    {/each}
  </div>
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

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .gallery-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    font-size: 0.9rem;
    color: var(--font-color);
    opacity: 0.8;
  }

  .item-count, .page-info {
    font-size: 0.85rem;
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

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .pagination-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--highlight);
    color: var(--font-color);
    border: none;
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  .pagination-btn:hover:not(.disabled) {
    background: var(--highlight);
    opacity: 0.8;
    transform: translateY(-1px);
  }

  .pagination-btn.disabled {
    background: var(--border);
    color: var(--font-color);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-numbers {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .page-number {
    background: var(--primary);
    color: var(--font-color);
    border: 1px solid var(--border);
    width: 40px;
    height: 40px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page-number:hover {
    background: var(--highlight);
    border-color: var(--highlight);
    transform: translateY(-1px);
  }

  .page-number.active {
    background: var(--highlight);
    border-color: var(--highlight);
    color: var(--font-color);
    font-weight: 600;
  }

  .pagination-ellipsis {
    color: var(--font-color);
    opacity: 0.6;
    font-size: 0.9rem;
    padding: 0 0.5rem;
  }

  /* Toast Notifications */
  .toast-container {
    position: fixed;
    top: 2rem;
    right: 2rem;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 400px;
  }

  .toast {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
    min-width: 300px;
  }

  .toast-visible {
    transform: translateX(0);
    opacity: 1;
  }

  .toast-hidden {
    transform: translateX(100%);
    opacity: 0;
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }

  .toast-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .toast-message {
    color: var(--font-color);
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .toast-close {
    background: none;
    border: none;
    color: var(--font-color);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
    margin-left: 0.5rem;
  }

  .toast-close:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .toast-close span {
    font-size: 1.125rem;
  }

  /* Toast type styles */
  .toast-success {
    border-left: 4px solid #10b981;
  }

  .toast-success .toast-icon {
    color: #10b981;
  }

  .toast-error {
    border-left: 4px solid #ef4444;
  }

  .toast-error .toast-icon {
    color: #ef4444;
  }

  .toast-info {
    border-left: 4px solid #3b82f6;
  }

  .toast-info .toast-icon {
    color: #3b82f6;
  }

  /* Mobile responsiveness for toasts */
  @media (max-width: 768px) {
    .toast-container {
      top: 1rem;
      right: 1rem;
      left: 1rem;
      max-width: none;
    }

    .toast {
      min-width: auto;
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .gallery-info {
      align-items: flex-start;
    }

    .pagination {
      gap: 0.5rem;
    }

    .pagination-btn {
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
    }

    .page-number {
      width: 36px;
      height: 36px;
      font-size: 0.85rem;
    }
  }
</style>