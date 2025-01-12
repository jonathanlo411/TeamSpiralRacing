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

<footer>
  <div id='left'>

    <div id='upper'>
      <h2>Contact Us</h2>
      <a href="mailto:contact@teamspiralracing.com">contact@teamspiralracing.com</a>
    </div>

    <div id='lower'>
      <div id='chore-row'>
        <a href='/'>Terms of Use</a>
        <a href='/'>Privacy Policy</a>
        <a href='/'>Source Code</a>
      </div>
      <span>© Team Spiral Racing and its contributors 2024-2025</span>
    </div>

  </div>
  <div id='right'>
    <div>
      <h3>Socials</h3>
      <div id='split'>
        <div>
          <a href="/">Discord</a>
          <a href="/">Facebook</a>
          <a href="/">Instagram</a>
        </div>
        <div>
          <a href="/">Twitter</a>
          <a href="/">YouTube</a>
        </div>
      </div>
    </div>
  </div>
</footer>

<style>
  /* General Styling */@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
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


  /* Mobile Styling */
  @media screen and (max-width: 1080px) {
    nav {
      display: none;
    }
  }
</style>
