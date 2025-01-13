<script lang="ts">
  import { onMount } from "svelte";
  import { Slidy } from "@slidy/svelte";
  import { stairs } from "@slidy/animation";
  import "@slidy/svelte/dist/slidy.css";

  // Carousel
  const slides = [
    { id: 1, src: "/carousel-1.jpg", width: 1200, height: 800 },
    { id: 2, src: "/carousel-2.jpg", width: 1200, height: 800 },
    { id: 3, src: "/carousel-3.jpg", width: 1200, height: 800 },
  ];

  // Google Maps
  let map: any;
  let googleMapsLoaded = false;

  const locations = [
    { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
    { lat: 32.7157, lng: -117.1611, label: "San Diego" },
    { lat: 33.9806, lng: -117.3755, label: "Riverside" },
  ];

  const loadGoogleMaps = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Define callback function
      window.initMap = () => {
        googleMapsLoaded = true;
        resolve();
      };

      // Check if script is already loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        if (window.google && window.google.maps) {
          googleMapsLoaded = true;
          resolve();
        }
        return;
      }

      // Create and append script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAIWdT1FG8JhrTPIC1bl1rT9jqn76tU_lc&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const createMarker = (location: typeof locations[0], map: any) => {
    return new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map,
      title: location.label,
    });
  };

  const initializeMap = async () => {
    try {
      await loadGoogleMaps();
      
      const mapElement = document.getElementById("gmap");
      if (!mapElement) return;

      map = new google.maps.Map(mapElement, {
        zoom: 8,
        center: { lat: 33.5, lng: -117.5 },
      });

      locations.forEach(location => createMarker(location, map));
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  onMount(() => {
    initializeMap();

    return () => {
      if (map) {
        // Clean up map instance
        map = null;
      }
    };
  });
</script>

<svelte:head>
  <title>Team Spiral Racing</title>
</svelte:head>

<div id="main">
  <!-- Initial Screen -->
  <section 
    id="page-entrance" 
    style="background-image: url('/home-splash.jpg')"
  >
    <div id="page-entrance-content">
      <img id="logo" src="/logos/full.png" alt="logo of the Team Spiral racing" />
      <h4>
        A team driven by passion for canyon and track, finding the perfect 
        balance between street driving and track racing.
      </h4>
      <a href="/signup"><button>Join Now</button></a>
    </div>
  </section>

  <section id="intro">
    <h2>Who are we?</h2>
    <div id="description">
      <p>
        At Team Spiral, we embrace the harmony between the raw, flowing 
        challenge of canyon roads and the precision and refinement of the 
        racetrack. Each inspires the other—track skills enhance safety and 
        control on the streets, while the touge fuels creativity and passion 
        on the track.<br><br>
        Safety and respect are at our core. Whether carving through canyons 
        or chasing lap times, we honor the roads, the community, and the 
        thrill of driving. Team Spiral is more than a team; it's a lifestyle 
        where passion meets responsibility, celebrating the balance of street 
        and track.
      </p>
      <div id="carousel">
        <Slidy
          animation={stairs}
          duration={450}
          gravity={1.45}
          snap="center"
          {slides}
          arrows
          loop 
        />
      </div>
    </div>
  </section>

  <section id="join">
    <div id="gmap"></div>
    <div id="join-info">
      
      <div id='upper'>
        <h2>Join the team!</h2>
        <p>
          Join Team Spiral and become part of a passionate community that
          celebrates the art of driving, from canyon roads to the racetrack, with
          skill, safety, and camaraderie at its core.
        </p>
        <div id="stats">
          <div class="stat">
            <h3>14</h3>
            <h5>Members</h5>
          </div>
          <div class="stat">
            <h3>21</h3>
            <h5>Meet Ups</h5>
          </div>
          <div class="stat">
            <h3>130</h3>
            <h5>Canyon Runs</h5>
          </div>
          <div class="stat">
            <h3>53</h3>
            <h5>Group Track Days</h5>
          </div>
        </div>
      </div>

      <hr style='width: 85%; margin: auto;'>

      <div id='lower'>
        <div><img src='/discord-logo.jpg' alt='discord logo' /></div>
        <p>Join us to chat with the other members of the community, get started with contributing, or ask us a question!</p>
        <a href="https://discord.gg/vaEQqNVzBx" target="_blank"><button>Join Community!</button></a>        
      </div>

    </div>
  </section>

  <section id='stories'>
    <h2>Our Stories</h2>
    <div id="story-grid">

      <a href="/" class="story story-1">
        <div class='picture' style="background-image: url('/story-placeholder-1.jpg')"></div>
        <div class="story-info">
          <h3>Exploring Newcomb's Ranch</h3>
          <p>December 15th, 2024 | 3 Minute Read</p>
        </div>
      </a>

      <a href="/" class="story story-2">
        <div class='picture' style="background-image: url('/story-placeholder-2.jpg')"></div>
        <div class="story-info">
          <h3>Rating Ohlins</h3>
          <p>September 3rd, 2024 | 10 Minute Read</p>
        </div>
      </a>
      
      <a href="/" class="story story-3">
        <div class='picture' style="background-image: url('/story-placeholder-3.jpg')"></div>
        <div class="story-info">
          <h3>SoW Track Day Lunch</h3>
          <p>July 15th, 2024 | 8 Minute Read</p>
        </div>
      </a>
      
      <a href="/" class="story story-4">
        <div class='picture' style="background-image: url('/story-placeholder-4.jpg')"></div>
        <div class="story-info">
          <h3>Picking our newest member's 06' S2000</h3>
          <p>March 29th, 2024 | 20 Minute Read</p>
        </div>
      </a>
      
    </div>
    <div class='centering'><a href='blog'><button class="read-more">Read More →</button></a></div>
  </section>
  

</div>

<style>
  #page-entrance {
    background-position: center;
    background-size: cover;
    height: 100vh;
    width: 100vw;
    position: relative;
  }
  #page-entrance::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1;
  }
  #page-entrance #page-entrance-content {
    position: relative;
    z-index: 2;
    color: white;
    padding: 20px;
    width: var(--central-width);
    margin: 0 auto;
    top: 50%;
    transform: translateY(-55%);
  }
  #page-entrance-content #logo {
    height: 13vh;
    margin: 2rem 0;
  }
  #page-entrance-content h4 {
    font-size: 2rem;
    font-weight: 300;
    width: 50%;
    margin-bottom: 2rem;
  }
  #page-entrance-content a {
    text-decoration: none;
  }
  #page-entrance-content button {
    background-color: var(--highlight);
    color: white;
    padding: 1rem 2rem;
    font-size: 1.3rem;
    border: none;
    border-radius: 1000px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.3s;
  }
  #page-entrance-content button:hover {
    opacity: 0.8;
  }

  #intro {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 70vh;
    width: 80%;
    margin: 5vh auto;
  }
  #intro h2 {
    font-size: 4rem;
    text-align: center;
    margin-bottom: 5vh;
  }
  #description {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem; 
  }
  #description p {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.6;
    padding: 2rem;
    max-width: 45%; 
    font-size: 1.5rem;
  }
  #carousel {
    max-width: 45%; 
    padding: 2rem;
  }

  /* Add styles for join section */
  #join {
    display: flex;
    flex-direction: row;
    background-color: white;
    color: black;
    height: 75vh;
  }
  #join #gmap {
    width: 50%;
  }
  #join #join-info {
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    width: 50vw;
  }
  
  #join-info #upper {
    width: 75%;
    margin: auto;
  }
  #join-info #upper h2 {
    font-size: 4rem;
    margin: 5vh auto 0;
  }
  #join-info #upper p {
    font-size: 1.5rem;
    margin-bottom: 2.5vh;
  }

  #upper #stats {
    display: flex;
    margin: 2.5vh auto 5vh;
    justify-content: space-between;
  }
  .stat h3 {
    font-size: 4rem;
  }
  .stat h5 {
    font-size: 1.7em;
    font-weight: 400;
  }

  #lower {
    width: 75%;
    margin: auto;
    display: flex;
    flex-direction: column;
  }
  #lower img {
    height: 10rem;
    width: auto;
  }
  #lower p {
    font-size: 1.5rem;
  }
  #lower button {
    background-color: #7289da;
    color: white;
    padding: 1rem 2rem;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.3s;
    margin: 1rem 0;
  }
  #lower button:hover { opacity: 0.8; }

  /* Stories */
  #stories h2 {
    font-size: 4rem;
    text-align: center;
    margin: 5vh auto;
  }

  #stories #story-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 3em;
    width: 75%;
    margin: auto;
  }

  .story {
    height: 50vh;
    width: auto;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    color: white;
    transition: 0.3s;
  }
  .story:hover {
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  }
  .story .picture {
    height: 100%;
    background-position: center;
    background-size: cover;
  }
  .story .picture::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0));
    z-index: 1;
  }
  .story .story-info {
    position: absolute;
    bottom: 2.5em;
    left: 2.5em;
    z-index: 2;
  }
  .story-info h3 {
    font-size: 2.5rem;
    padding-right: 2.5em;
  }
  .story-info p { font-size: 1.2rem; margin-top: 0.5rem; }

  .story-1 { grid-column: span 2; }
  .story-4 { grid-column: span 2; }

  .centering {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  #stories button {
    margin: 5rem auto;
    background-color: var(--highlight);
    color: white;
    padding: 1rem 2rem;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.3s;
  }
  #stories button:hover {
    opacity: 0.8;
  }

</style>
