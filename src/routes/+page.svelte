<div id='main'>
  <div id='page-entrance' style="background-image: url('/home-splash.jpg')">
    <div id='page-entrance-content'>
      <h1>Racing Team Spiral</h1>
      <h4>A team driven by passion for canyon and track, finding the perfect balance between street driving and track racing.</h4>
      <a href="/login">
        <button>Join Now</button>
      </a>
    </div>
  </div>
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
    text-align: center;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-50%);
  }
  #page-entrance-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  #page-entrance-content h4 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  #page-entrance-content a {
    text-decoration: none;
  }
  #page-entrance-content button {
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
  #page-entrance-content button:hover {
    opacity: 0.8;
  }
</style>
