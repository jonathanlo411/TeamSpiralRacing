<script lang="ts">
  import { page } from '$app/stores'
  import { browser } from '$app/environment'

  // Track page views when the route changes
  $: {
    if (browser && typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('config', 'G-QQ8Z0BRN32', {
        page_title: document.title,
        page_path: $page.url.pathname,
        page_location: $page.url.href
      })
    }
  }

</script>

<svelte:head>
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-QQ8Z0BRN32">
  </script>
  <script>
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', 'G-QQ8Z0BRN32', {
      // Initial configuration - page tracking will be handled by the reactive statement
      send_page_view: false
    })
  </script>
</svelte:head>