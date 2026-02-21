<script>
  import { onMount } from 'svelte';
  import { findEgg } from '$lib/stores/easter-eggs.svelte.js';

  onMount(() => {
    findEgg('egg_readme');
  });

  const content = `README.txt
==========

If you're reading this, you found it.

This site is a love letter to the era of beige towers,
dot-matrix printers, and 800x600 resolutions.

Built with:
  - SvelteKit 2 + Svelte 5 runes
  - GSAP for animations
  - PocketBase for auth & storage
  - A lot of nostalgia

SECRET LOG
----------
[egg_readme]    ✓ found
[egg_konami]    type ↑↑↓↓←→←→BA on the desktop
[egg_clockwatcher]  click the clock... a lot
[egg_title_click]   what happens when you click the logo?
[egg_folder_spam]   open a folder over and over again

HIDDEN MESSAGE
--------------
The real OS was the friends we made along the way.

EOF`;
</script>

<div class="readme-content">
  <pre class="readme-text">{content}</pre>
</div>

<style>
  .readme-content {
    min-width: 380px;
  }

  .readme-text {
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.7;
    color: var(--color-text);
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* Highlight egg IDs */
  .readme-text :global(.egg-id) {
    color: var(--color-accent2);
  }
</style>
