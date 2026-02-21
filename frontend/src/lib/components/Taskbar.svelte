<script>
  import { windows, bringToFront, minimizeWindow } from '$lib/stores/desktop.svelte.js';
  import { authState, openAuthModal, logout } from '$lib/stores/auth.svelte.js';
  import { findEgg } from '$lib/stores/easter-eggs.svelte.js';

  let clock = $state('');
  let clockInterval;

  $effect(() => {
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  });

  function updateClock() {
    const now = new Date();
    clock = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  // Track how long user has been looking at the clock
  let clockClickCount = $state(0);
  function handleClockClick() {
    clockClickCount++;
    if (clockClickCount >= 5) {
      clockClickCount = 0;
      findEgg('egg_clockwatcher');
    }
  }

  function handleLogoClick() {
    findEgg('egg_title_click');
  }

  function toggleWindow(win) {
    if (win.minimized) {
      win.minimized = false;
      bringToFront(win.id);
    } else {
      minimizeWindow(win.id);
    }
  }
</script>

<div class="taskbar">
  <!-- Left: Logo / brand -->
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="taskbar-logo" onclick={handleLogoClick} role="button">
    <span class="logo-bracket">[</span>
    <span class="logo-name">retr0.dev</span>
    <span class="logo-bracket">]</span>
  </div>

  <!-- Center: Open windows -->
  <div class="taskbar-windows">
    {#each windows as win (win.id)}
      <button
        class="taskbar-win-btn"
        class:minimized={win.minimized}
        onclick={() => toggleWindow(win)}
        title={win.title}
      >
        <span class="win-indicator"></span>
        {win.title}
      </button>
    {/each}
  </div>

  <!-- Right: Auth + Clock -->
  <div class="taskbar-right">
    {#if authState.isValid}
      <span class="auth-name">{authState.model?.name || authState.model?.email || 'user'}</span>
      <button class="taskbar-btn" onclick={logout}>logout</button>
    {:else}
      <button class="taskbar-btn" onclick={openAuthModal}>login</button>
    {/if}

    <!-- svelte-ignore a11y_interactive_supports_focus -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="clock" onclick={handleClockClick} role="button" title="click me...">
      {clock}
    </div>
  </div>
</div>

<style>
  .taskbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--taskbar-h);
    background: var(--color-surface-2);
    border-top: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 12px;
    z-index: 5000;
    font-size: 12px;
    user-select: none;
    -webkit-user-select: none;
  }

  /* ── Logo ─────────────────────────────────────────── */
  .taskbar-logo {
    display: flex;
    align-items: center;
    gap: 0;
    cursor: pointer;
    flex-shrink: 0;
    padding: 2px 6px;
    border: 1px solid transparent;
    border-radius: var(--radius);
    transition: border-color 0.15s, background 0.15s;
  }

  .taskbar-logo:hover {
    border-color: var(--color-border);
    background: rgba(0, 212, 255, 0.06);
  }

  .logo-bracket {
    color: var(--color-dim);
    font-size: 13px;
  }

  .logo-name {
    color: var(--color-accent);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 0 2px;
    text-shadow: 0 0 6px var(--color-accent);
  }

  /* ── Open windows ─────────────────────────────────── */
  .taskbar-windows {
    flex: 1;
    display: flex;
    gap: 6px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
  }

  .taskbar-windows::-webkit-scrollbar { display: none; }

  .taskbar-win-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 2px 8px;
    border-radius: var(--radius);
    cursor: pointer;
    white-space: nowrap;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: background 0.12s, border-color 0.12s;
  }

  .taskbar-win-btn:hover {
    background: rgba(0, 212, 255, 0.08);
    border-color: var(--color-accent);
  }

  .taskbar-win-btn.minimized {
    opacity: 0.5;
  }

  .win-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-accent2);
    flex-shrink: 0;
  }

  .minimized .win-indicator {
    background: var(--color-dim);
  }

  /* ── Right section ────────────────────────────────── */
  .taskbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .auth-name {
    color: var(--color-dim);
    font-size: 11px;
  }

  .taskbar-btn {
    background: none;
    border: 1px solid var(--color-border);
    color: var(--color-text);
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 2px 8px;
    border-radius: var(--radius);
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s, color 0.12s;
  }

  .taskbar-btn:hover {
    background: rgba(0, 212, 255, 0.08);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .clock {
    color: var(--color-accent);
    font-size: 12px;
    letter-spacing: 0.06em;
    cursor: default;
    padding: 2px 6px;
    border: 1px solid transparent;
    border-radius: var(--radius);
    transition: border-color 0.15s;
    font-weight: 500;
    min-width: 80px;
    text-align: center;
  }

  .clock:hover {
    border-color: var(--color-border);
    cursor: pointer;
  }
</style>
