<script lang="ts">
  import { goto } from "$app/navigation";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let firstName = "";
  let lastName = "";
  let error = "";

  async function handleSubmit() {
    if (password !== confirmPassword) {
      error = "Passwords don't match";
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName })
    });

    if (res.ok) {
      goto("/login");
    } else {
      const data = await res.json();
      error = data.message;
    }
  }
</script>

<div class="auth-container">
  <form on:submit|preventDefault={handleSubmit}>
    <h1>Sign Up</h1>
    {#if error}
      <div class="error">{error}</div>
    {/if}
    <div class="name-inputs">
      <input
        type="text"
        placeholder="First Name"
        bind:value={firstName}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        bind:value={lastName}
        required
      />
    </div>
    <input
      type="email"
      placeholder="Email"
      bind:value={email}
      required
    />
    <input
      type="password"
      placeholder="Password"
      bind:value={password}
      required
    />
    <input
      type="password"
      placeholder="Confirm Password"
      bind:value={confirmPassword}
      required
    />
    <button type="submit">Sign Up</button>
    <div class="alt-action">
      Already have an account? <a href="/login">Login</a>
    </div>
  </form>
</div>

<style>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 56px - 30vh);
    padding: 2rem;
  }

  form {
    background-color: var(--secondary);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    width: 100%;
    max-width: 400px;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.8rem;
    margin: 0.5rem 0;
    border: 1px solid var(--border);
    border-radius: 4px;
    background-color: var(--primary);
    color: var(--font-color);
  }

  button {
    width: 100%;
    padding: 0.8rem;
    margin: 1rem 0;
    background-color: var(--highlight);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }

  button:hover {
    opacity: 0.9;
  }

  .error {
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid red;
    color: red;
    padding: 0.5rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .alt-action {
    text-align: center;
    margin-top: 1rem;
  }

  .alt-action a {
    color: var(--highlight);
    text-decoration: none;
  }

  .alt-action a:hover {
    text-decoration: underline;
  }

  .name-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
</style>