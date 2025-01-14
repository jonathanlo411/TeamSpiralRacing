<script lang="ts">
  export let name: string;
  export let linkRef: string;
</script>

<a class='track-card' href="/times/{linkRef}">
  <div class='content' style="background-image: url(/tracks/{linkRef}/splash.jpg)">
    <h1>{name}</h1>
    <img src="/tracks/{linkRef}/map.png" alt="track map" />
  </div>
</a>

<style>
  .track-card, .track-card:visited {
    background: radial-gradient(
      circle,
      rgba(150, 150, 150, 0.1) 0%,
      rgba(100, 100, 100, 0.3) 40%,
      rgba(50, 50, 50, 0.6) 70%,
      rgba(30, 30, 30, 0.9) 100%
    );
    background-size: 200% 200%;
    animation: shimmer 3s infinite;
    padding: 1.2rem;
    display: block;
    border-radius: 30px;
    transition: 0.3s;
    text-decoration: none;
    color: white;
    margin: 3rem auto;
  }
  @keyframes shimmer {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  .track-card:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
    animation: shimmer-hover 1.5s infinite;
    cursor: pointer;
  }
  @keyframes shimmer-hover {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .track-card .content {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    height: 650px;
    border-radius: 15px;
    overflow: hidden;
  }
  .track-card .content::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;    
    background: linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0));
  }
  .content h1 {
    position: absolute;
    bottom: 3rem;
    left: 3rem;
    z-index: 3;
    font-size: 5rem;
  }
  .content img {
    position: absolute;
    z-index: 2;
    top: 3rem;
    right: 3rem;
    max-height: 40%;
    max-width: 30%;
  }
</style>