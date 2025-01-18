<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from './$types';
  let scrolled = false;
  let menuOpen = false;
  let menuRef: HTMLDivElement;
  
  export let data: PageData;
  const user = data.user;

  const handleScroll = () => {
    scrolled = window.scrollY > 0;
  };

  function handleClickOutside(event: MouseEvent) {
    if (menuRef && !menuRef.contains(event.target as Node)) {
      menuOpen = false;
    }
  }

  async function handleSignOut() {
    await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
    });
    window.location.reload();
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div id="centering" class:scrolled={scrolled}>
  <nav>
    <div id="nav-items">
      <a id="logo" href="/"><img src="/logos/icon.png" alt="home logo" /></a>
      <a class="nav-item" href="/team">Team</a>
      <a class="nav-item" href="/cars">Cars</a>
      <a class="nav-item" href="/times">Times</a>
    </div>
    {#if user}
      <div id="login">
        <div class="menu-container" bind:this={menuRef}>
          <button class="menu-button" on:click={() => menuOpen = !menuOpen}>Menu</button>
          {#if menuOpen}
            <div class="popup-menu">
              <a href="/console/profile" class="menu-item">Profile</a>
              <a href="/console" class="menu-item">Console</a>
              <button class="menu-item signout" on:click={handleSignOut}>Sign Out</button>
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <a href="/login" id="login"><button>Login</button></a>
    {/if}
  </nav>
</div>

<div id="base">
  <slot></slot>
</div>

<footer>
  <div id='left'>

    <div id='upper'>
      <h2>Contact Us</h2>
      <a href="mailto:contact@teamspiralracing.com">contact@teamspiralracing.com</a>
    </div>

    <div id='lower'>
      <div id='chore-row'>
        <a href='https://documents.teamspiralracing.com/pdfs/Team%20Spiral%20Racing%20-%20Terms%20of%20Service.pdf' target="_blank">Terms of Use</a>
        <a href='https://documents.teamspiralracing.com/pdfs/Team%20Spiral%20Racing%20-%20Privacy%20Policy.pdf' target="_blank">Privacy Policy</a>
        <a href='https://github.com/jonathanlo411/team-spiral-racing' target="_blank">Source Code</a>
      </div>
      <span>© Team Spiral Racing and its contributors 2024-2025</span>
    </div>

  </div>
  <div id='right'>
    <div>
      <h3>Socials</h3>
      <div id='split'>
        <div>
          <a href="https://discord.gg/vaEQqNVzBx" target="_blank">Discord</a>
          <a href="https://www.facebook.com/profile.php?id=61571963818512" target="_blank">Facebook</a>
          <a href="https://www.instagram.com/teamspiralracing/" target="_blank">Instagram</a>
        </div>
        <div>
          <a href="https://x.com/SpiralRacing" target="_blank">Twitter</a>
          <a href="https://www.youtube.com/@TeamSpiralRacing" target="_blank">YouTube</a>
        </div>
      </div>
    </div>
  </div>
</footer>

<style>
  /* General Styling */
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
  @import url('https://fonts.googleapis.com/css?family=Racing+Sans+One&display=swap');
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

    /* Size vars */
    --central-width: calc(min(90%, 1500px) - 3.5rem);
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
    width: var(--central-width);
    height: 56px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
  }
  nav #nav-items {
    display: flex;
  }
  #logo {
    display: flex;
    align-items: center;
    padding: 0 1rem;
  }
  #logo > img {
    height: 33px;
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

  /* Footer */
  footer {
    display: flex;
    background-color: var(--secondary);
    width: 100%;
    justify-content: space-around;
    height: 30vh;
    border-top: 1px solid var(--border);
  }
  footer #left {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  #left #upper h2 {
    font-size: 3rem;
    font-weight: 500;
  }
  #left #upper a {
    color: white;
    text-decoration: none;
    font-size: 1.3rem;
    font-weight: 300;
    transition: 0.3s;
  }
  #left #upper a:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  #left #lower #chore-row {
    margin-bottom: 0.5rem;
  }
  #left #lower #chore-row * {
    text-decoration: none;
    color: white;
    margin-right: 3rem;
    font-size: 1.4rem;
  }
  #left #lower #chore-row *:hover { text-decoration: underline; }
  #left #lower span {
    color: #A8A8A8;
    font-size: 0.9rem;
  }

  footer #right {
    height: 100%;
    width: 15vw;
    display: flex;
    align-items: center;
  }
  #right h3 {
    font-size: 1.7rem;
    font-weight: 400;
  }
  #right #split { display: flex; }
  #right #split > div {
    display: flex;
    flex-direction: column;
    margin: 1rem 1rem 1rem 0;
  }
  #right #split > div a {
    color: #D2D2D2;
    text-decoration: none;
    font-weight: 300;
    font-size: 1.2rem;
    margin: 0.4rem 1rem 0.4rem 0;
  }
  #right #split > div a:hover { color: white; }

  /* Popup Menu */
  .menu-container {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .menu-button {
    background-color: var(--highlight);
    color: white;
    outline: none;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: bold;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .menu-button:hover {
    opacity: 0.8;
  }

  .popup-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background-color: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 5px;
    min-width: 160px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  .menu-item {
    display: block;
    padding: 0.75rem 1rem;
    color: var(--font-color);
    text-decoration: none;
    transition: background-color 0.2s;
    font-size: 1rem;
    width: 100%;
  }

  .menu-item:hover {
    background-color: var(--primary);
  }

  .signout {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    border-radius: 0;
    color: var(--font-color);
    font-weight: normal;
    cursor: pointer;
    padding: 0.75rem 1rem;
  }

  /* Mobile Styling */
  @media screen and (max-width: 1080px) {
    nav {
      display: none;
    }
  }
</style>
