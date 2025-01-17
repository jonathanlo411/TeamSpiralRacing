<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<h1>Welcome {data.user.firstName}</h1>
<p>Your role is: {data.user.role}</p>