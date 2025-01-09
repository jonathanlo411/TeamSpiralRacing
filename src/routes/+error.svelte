<script>
  import { page } from '$app/stores';
</script>

<main>
  <h1>{$page.status || 500} - {$page.error?.message || "An unexpected error occurred"}</h1>
  <p>Something went wrong. Please try again later or go back to the homepage.</p>
  <a href="/">Return to Homepage</a>
</main>

<style>
  main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      text-align: center;
  }

  h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: var(--highlight);
  }

  p {
      font-size: 1.2rem;
      color: white;
      margin-bottom: 1.5rem;
  }

  a {
      color: var(--font-color);
      background-color: var(--highlight);
      padding: 0.8rem 1.5rem;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      transition: background-color 0.2s ease;
  }

  a:hover {
      background-color: var(--fastest);
  }
</style>
