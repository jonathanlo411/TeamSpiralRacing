<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
  
  let title = '';
  let content = '';
  let showForm = false;
</script>

<div>
  {#if ['ADMIN', 'DRIVER'].includes(data.user.role)}
    <button 
      class="menu-button"
      on:click={() => showForm = !showForm}
    >
      {showForm ? 'Cancel' : 'Create New Post'}
    </button>

    {#if showForm}
      <form action="?/createPost" method="POST" class="popup-menu">
        <div>
          <label for="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            bind:value={title}
            required
          />
        </div>

        <div>
          <label for="content">Content</label>
          <textarea
            id="content"
            name="content"
            bind:value={content}
            rows="10"
            required
          />
        </div>

        <button type="submit" class="menu-button">
          Create Post
        </button>
      </form>
    {/if}

    <div class="posts-container">
      {#each data.posts as post}
        <div class="post-item">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <div class="post-footer">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <form action="?/deletePost" method="POST">
              <input type="hidden" name="id" value={post.id} />
              <button type="submit" class="signout">Delete</button>
            </form>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p>You don't have permission to create blog posts.</p>
  {/if}
</div>

<style>
  .menu-button {
    margin-top: 5rem;
  }
  .posts-container {
    margin-top: 2rem;
  }

  .post-item {
    background-color: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .post-item h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    color: var(--subdued);
  }

  input, textarea {
    width: 100%;
    background-color: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 0.5rem;
    color: var(--font-color);
    margin: 0.5rem 0 1rem;
  }

  label {
    color: var(--font-color);
    font-size: 1.1rem;
  }
</style>