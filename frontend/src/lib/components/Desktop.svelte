<script>
  import { onMount } from 'svelte';
  import DesktopIcon from './DesktopIcon.svelte';
  import Window from './Window.svelte';
  import Taskbar from './Taskbar.svelte';
  import AuthModal from './AuthModal.svelte';
  import ToastContainer from './ToastContainer.svelte';

  import { windows, openWindow, getOpenCount } from '$lib/stores/desktop.svelte.js';
  import { authUi } from '$lib/stores/auth.svelte.js';
  import { findEgg, restoreLocalEggs } from '$lib/stores/easter-eggs.svelte.js';
  import { screenRect } from '$lib/stores/scene.svelte.js';

  /** Reactive icon grid columns based on available screen height */
  const gridCols = $derived(
    screenRect.height < 280 ? 4
    : screenRect.height < 380 ? 2
    : 1
  );

  // Lazy-load window content components
  import AboutContent from './windows/AboutContent.svelte';
  import ProjectsContent from './windows/ProjectsContent.svelte';
  import ContactContent from './windows/ContactContent.svelte';
  import ReadmeContent from './windows/ReadmeContent.svelte';

  const ICONS = [
    {
      id: 'about',
      label: 'About',
      type: 'folder',
      title: 'About.dir',
      component: AboutContent,
    },
    {
      id: 'projects',
      label: 'Projects',
      type: 'folder',
      title: 'Projects.dir',
      component: ProjectsContent,
    },
    {
      id: 'contact',
      label: 'Contact',
      type: 'folder',
      title: 'Contact.dir',
      component: ContactContent,
    },
    {
      id: 'readme',
      label: 'README.txt',
      type: 'text',
      title: 'README.txt',
      component: ReadmeContent,
    },
  ];

  onMount(() => {
    restoreLocalEggs();
    setupKonami();
  });

  // ─── Konami Code Easter Egg ─────────────────────────────────────────
  const KONAMI = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a',
  ];
  let konamiProgress = 0;

  function setupKonami() {
    window.addEventListener('keydown', (e) => {
      if (e.key === KONAMI[konamiProgress]) {
        konamiProgress++;
        if (konamiProgress === KONAMI.length) {
          konamiProgress = 0;
          findEgg('egg_konami');
        }
      } else {
        konamiProgress = e.key === KONAMI[0] ? 1 : 0;
      }
    });
  }

  // ─── Folder spam Easter Egg ─────────────────────────────────────────
  function handleIconOpen(icon) {
    openWindow({
      id: icon.id,
      title: icon.title,
      component: icon.component,
    });

    // Check for folder spam egg (open same folder 5+ times)
    const count = getOpenCount(icon.id);
    if (count >= 5 && icon.type === 'folder') {
      findEgg('egg_folder_spam');
    }
  }
</script>

<!-- Desktop surface -->
<div class="desktop">
  <!-- Icon grid (top-left) -->
  <div class="icon-grid" style="grid-template-columns: repeat({gridCols}, 80px);">
    {#each ICONS as icon}
      <DesktopIcon
        label={icon.label}
        type={icon.type}
        onclick={() => handleIconOpen(icon)}
      />
    {/each}
  </div>

  <!-- Open windows -->
  {#each windows as win (win.id)}
    {#if !win.minimized}
      <Window id={win.id} title={win.title} zIndex={win.zIndex}>
        <svelte:component this={win.component} />
      </Window>
    {/if}
  {/each}

  <!-- Taskbar -->
  <Taskbar />

  <!-- Auth modal -->
  {#if authUi.open}
    <AuthModal />
  {/if}

  <!-- Toast notifications -->
  <ToastContainer />
</div>

<style>
  .desktop {
    position: absolute;
    inset: 0;
    background: var(--color-bg);
    overflow: hidden;
  }

  .icon-grid {
    display: grid;
    /* grid-template-columns set via inline style (reactive) */
    grid-auto-rows: 96px;
    gap: 4px;
    padding: 16px;
    align-content: start;
  }
</style>
