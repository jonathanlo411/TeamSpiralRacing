<script lang="ts">
  import { Carta, MarkdownEditor } from 'carta-md';
  import { code } from '@cartamd/plugin-code';
  import DOMPurify from 'isomorphic-dompurify';
  import { invalidate } from '$app/navigation';

  export let data;

  let formData = {
    title: '',
    imageRef: '',
    content: ''
  };

  let errors = {
    title: '',
    imageRef: '',
    content: ''
  };

  let status = {
    loading: false,
    message: '',
    type: ''
  };

  const carta = new Carta({
    sanitizer: DOMPurify.sanitize,
    extensions: [code()]
  });

  function validateForm() {
    errors = {
      title: !formData.title.trim() ? 'Title is required' : '',
      imageRef: !formData.imageRef.trim() ? 'Splash image is required': '',
      content: !formData.content.trim() ? 'Content is required' : ''
    };
    return !errors.title && !errors.imageRef && !errors.content;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    status.loading = true;
    status.message = '';

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) {
        status.type = 'error';
        status.message = data.error || 'Failed to create post';
        return;
      }

      formData = { title: '', content: '', imageRef: '' };
      status.type = 'success';
      status.message = 'Post created successfully!';
      await invalidate('posts');

    } catch (err) {
      status.type = 'error';
      status.message = 'Failed to create post';
    } finally {
      status.loading = false;
    }
  }
</script>

<svelte:head>
  <title>Team Spiral Racing | Paddock - Blog</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=report" />
</svelte:head>

<div class="main">
  <section class="description">
    <h2>Description</h2>
    <p>Use the Markdown Editor to create blog posts about Team Spiral Racing. If you are unfamiliar with how to use Markdown, take a minute to view a <a href="https://www.markdownguide.org/basic-syntax/">quick guide</a>. You can use the "Preview" button to view how the Blog will look like once rendered. For images you can upload them to the <a href="/paddock/gallery">gallery</a> first then reference it in the markdown by passing in the link. For example:<br><br><span class="code-pre">![](https://pub-74cb85bf31ce44d08e83ee38e052fc7a.r2.dev/DSC03307.JPG)</span></p>
  </section>

  {#if !data.user || data.user.role === 'USER'}
    <section>
      <h2>Create New Posst</h2>
      <div id="not-allowed">
        <div>
          <span class="material-symbols-outlined">report</span>
          <h4>Only authenticated users with the role of DRIVER, ADMIN, or STAFF can post images!</h4>
        </div>
      </div>
    </section>
  {:else}
    <section>
      <h2>Create New Post</h2>

      {#if status.message}
        <div class="alert {status.type}">
          {status.message}
        </div>
      {/if}

      <form on:submit|preventDefault={handleSubmit}>
        <div>
          <label for="title">
            <h2>Post Title</h2>
          </label>
          <input
            type="text"
            id="title"
            bind:value={formData.title}
            placeholder="Enter your post title"
          />
          {#if errors.title}
            <p class="error">{errors.title}</p>
          {/if}
        </div>

        <div>
          <label for="imageRef">
            <h2>Post Splash Image</h2>
          </label>
          <input
            type="text"
            id="imageRef"
            bind:value={formData.imageRef}
            placeholder="Enter the URL for the splash image"
          />
          {#if errors.imageRef}
            <p class="error">{errors.imageRef}</p>
          {/if}
        </div>

        <div>
          <label for="content">
            <h2>Post Content</h2>
          </label>
          <div class="editor-container carta-theme__github">
            <MarkdownEditor
              bind:value={formData.content}
              mode="tabs"
              theme="github"
              {carta}
            />
          </div>
          {#if errors.content}
            <p class="error">{errors.content}</p>
          {/if}
        </div>

        <button type="submit" disabled={status.loading}>
          {status.loading ? 'Creating...' : 'Create Post'}
        </button>
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
  .main a {
    color: var(--highlight);
    text-decoration: none;
  }
  .main a:hover {
    text-decoration: underline;
  }
  .code-pre {
    background-color: var(--primary) !important;
    border: 1px solid var(--border);
    padding: 0.5rem;
    border-radius: 5px;
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

  /* Form Styling */
  form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 1em;
    margin-top: 2rem;
  }
  form label h2 {
    font-size: 1.5rem;
  }
  .error {
    color: red;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  .alert {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
  }
  .alert.success {
    background-color: #d4edda;
    color: #155724;
  }
  .alert.error {
    background-color: #f8d7da;
    color: #721c24;
  }
  input {
    width: 100%;
    padding: 0.7rem;
    margin-top: 0.5rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    background-color: var(--primary);
    color: var(--font-color);
    font-size: 1rem;
  }
  input:focus {
    outline: 2px solid var(--highlight);
  }
  button {
    margin-top: 2rem;
    padding: 0.5rem 1rem;
    background-color: var(--highlight);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover:not(:disabled) {
    opacity: 0.9;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Carta Styles */
  :global(.carta-theme__github.carta-editor) {
    background-color: var(--primary);
    border-radius: 0.5rem;
    outline: 2px solid var(--border);
  }
  :global(.carta-theme__github.carta-editor:focus-within) {
    outline: 2px solid var(--highlight);
  }
  :global(.carta-theme__github .carta-wrapper) {
    padding: 1rem;
    flex-grow: 1;
  }
  :global(.carta-theme__github .carta-input),
  :global(.carta-theme__github .carta-renderer) {
    min-height: 120px;
    max-height: 160px;
    overflow: auto;
  }
  :global(.carta-theme__github .carta-font-code) {
    font-family: 'Roboto', monospace;
    color: var(--font-color);
    font-size: 1.1rem;
  }
  :global(.carta-theme__github .carta-toolbar) {
    height: 2.5rem;
    background-color: var(--secondary);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
  :global(.carta-theme__github .carta-toolbar .carta-icon) {
    width: 2rem;
    height: 2rem;
    background-color: var(--secondary);
    outline: none;
    border: none;
    color: white;
  }
  :global(.carta-theme__github .carta-toolbar .carta-icon:hover) {
    color: var(--font-color);
    background-color: var(--border);
  }
  :global(.carta-theme__github .carta-toolbar-left button),
  :global(.carta-theme__github .carta-toolbar-right),
  :global(.carta-theme__github .carta-filler) {
    border-bottom: 1px solid var(--border);
  }
  :global(.carta-theme__github .carta-toolbar-left > *:first-child) {
    border-top-left-radius: 0.5rem;
  }
  :global(.carta-theme__github .carta-toolbar-left > *) {
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 0.95rem;
  }
  :global(.carta-theme__github .carta-toolbar-left button) {
    height: 100%;
    background-color: var(--secondary);
    color: white;
    border: none;
  }
  :global(.carta-theme__github .carta-toolbar-left .carta-active) {
    background-color: var(--primary);
    color: var(--font-color);
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--primary);
  }
  :global(.carta-theme__github .carta-toolbar-left .carta-active:not(:first-child)) {
    border-left: 1px solid var(--border);
  }
  :global(.carta-theme__github .carta-toolbar-right) {
    padding-right: 12px;
  }
  :global(.carta-theme__github .carta-icons-menu) {
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    min-width: 180px;
    background: var(--primary);
  }
  :global(.carta-theme__github .carta-icons-menu .carta-icon-full) {
    padding-left: 6px;
    padding-right: 6px;
    margin-top: 2px;
  }
  :global(.carta-theme__github .carta-icons-menu .carta-icon-full:first-child) {
    margin-top: 0;
  }
  :global(.carta-theme__github .carta-icons-menu .carta-icon-full:hover) {
    color: var(--font-color);
    background-color: var(--border);
  }
  :global(.carta-theme__github .carta-icons-menu .carta-icon-full span) {
    margin-left: 6px;
    color: var(--font-color);
    font-size: 0.85rem;
  }
  :global(.carta-theme__github.carta-emoji) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 19rem;
    max-height: 14rem;
    overflow-x: auto;
    overflow-y: auto;
    border-radius: 4px;
    font-family: inherit;
    background-color: var(--primary);
  }
  :global(.carta-theme__github.carta-emoji button) {
    background: var(--primary);
    cursor: pointer;
    display: inline-block;
    border-radius: 4px;
    border: 0;
    padding: 0;
    margin: 0.175rem;
    min-width: 2rem;
    height: 2rem;
    font-size: 1.2rem;
    line-height: 100%;
    text-align: center;
    white-space: nowrap;
  }
  :global(.carta-theme__github.carta-emoji button:hover),
  :global(.carta-theme__github.carta-emoji button.carta-active) {
    background: var(--border);
  }
  :global(html.dark .shiki),
  :global(html.dark .shiki span) {
    color: var(--shiki-dark) !important;
  }
</style>