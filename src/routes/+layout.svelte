<script>
  import { onMount } from "svelte";
  let scrolled = false;

  const handleScroll = () => {
    scrolled = window.scrollY > 0;
  };

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<div id="centering" class:scrolled={scrolled}>
  <nav>
    <div id="nav-items">
      <a class="nav-item" href="/">Home</a>
      <a class="nav-item" href="/team">Team</a>
      <a class="nav-item" href="/cars">Cars</a>
      <a class="nav-item" href="/times">Times</a>
      <a class="nav-item" href="/partners">Partners</a>
      <a class="nav-item" href="/blog">Blog</a>
    </div>
    <a href="/login" id="login"><button>Login</button></a>
  </nav>
</div>
<div id="base">
  <slot></slot>
</div>

<style>
  /* General Styling */
  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
  :global(*) {
    box-sizing: border-box;
    margin: 0;
  }
  :global(body) {
    font-family: 'Roboto';
    color: var(--font-color);
    background-color: var(--primary);
    overflow-x: hidden;

    /* Color vars */
    --primary: #2a2729;
    --secondary: #302c2e;
    --border: rgb(55, 52, 59);
    --highlight: rgb(163, 90, 132);
    --fastest: rgb(174, 62, 201);
    --font-color: white;
    --subdued: rgb(101, 93, 98);
  }

  /* Nav Bar */
  #centering {
    width: 100vw;
    background-color: transparent;
    position: fixed;
    z-index: 100;
    border-bottom: 1px solid transparent;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  #centering.scrolled {
    background-color: var(--secondary);
    border-color: var(--border);
  }
  nav {
    width: calc(min(90%, 1500px) - 3.5rem);
    height: 56px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
  }
  nav #nav-items {
    display: flex;
  }

  nav .nav-item, nav .nav-item:visited {
    color: var(--font-color);
    text-decoration: none;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    font-size: 1.1rem;
    border: 2px solid transparent;
    transition: 0.2s;
  }
  nav .nav-item:hover {
    border-bottom: 2px solid var(--highlight);
  }

  #login {
    display: flex;
    text-decoration: none;
    justify-content: space-evenly;
    flex-direction: column;
  }
  #login button {
    background-color: var(--highlight);
    color: white;
    outline: none;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: bold;
    padding: 0.5rem 1rem;
  }
  #login button:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  /* Mobile Styling */
  @media screen and (max-width: 1080px) {
    nav {
      display: none;
    }
  }
</style>
