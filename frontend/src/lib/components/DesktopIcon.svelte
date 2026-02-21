<script>
  /**
   * A reusable desktop icon (folder or file).
   * Props:
   *   label   — text shown below the icon
   *   type    — 'folder' | 'file' | 'text'
   *   onclick — called on double-click
   */
  let { label = '', type = 'folder', onclick = () => {} } = $props();

  let clicks = $state(0);
  let clickTimer;

  function handleClick() {
    clicks++;
    clearTimeout(clickTimer);
    if (clicks >= 2) {
      clicks = 0;
      onclick();
    } else {
      clickTimer = setTimeout(() => { clicks = 0; }, 400);
    }
  }
</script>

<button class="icon-btn" onclick={handleClick} title="Double-click to open">
  <div class="icon-graphic">
    {#if type === 'folder'}
      <!-- Folder SVG -->
      <svg viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="10" width="46" height="28" rx="1" fill="#1e3a5f" stroke="#00d4ff" stroke-width="1.5"/>
        <path d="M1 10 L1 7 Q1 6 2 6 L18 6 Q20 6 21 8 L23 10 Z" fill="#1e3a5f" stroke="#00d4ff" stroke-width="1.5" stroke-linejoin="round"/>
        <rect x="8" y="17" width="32" height="2" fill="#00d4ff" opacity="0.25" rx="1"/>
        <rect x="8" y="22" width="24" height="2" fill="#00d4ff" opacity="0.18" rx="1"/>
        <rect x="8" y="27" width="28" height="2" fill="#00d4ff" opacity="0.14" rx="1"/>
      </svg>
    {:else if type === 'text'}
      <!-- Text file SVG -->
      <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 1 H28 L38 11 V47 H4 Z" fill="#111827" stroke="#00ff88" stroke-width="1.5"/>
        <path d="M28 1 L28 11 L38 11" fill="none" stroke="#00ff88" stroke-width="1.5"/>
        <rect x="9" y="17" width="22" height="1.5" fill="#00ff88" opacity="0.6" rx="0.5"/>
        <rect x="9" y="22" width="18" height="1.5" fill="#00ff88" opacity="0.45" rx="0.5"/>
        <rect x="9" y="27" width="20" height="1.5" fill="#00ff88" opacity="0.45" rx="0.5"/>
        <rect x="9" y="32" width="14" height="1.5" fill="#00ff88" opacity="0.3" rx="0.5"/>
        <rect x="9" y="37" width="17" height="1.5" fill="#00ff88" opacity="0.3" rx="0.5"/>
      </svg>
    {:else}
      <!-- Generic icon SVG -->
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="32" height="32" rx="2" fill="#1e3a5f" stroke="#00d4ff" stroke-width="1.5"/>
        <circle cx="20" cy="20" r="8" stroke="#00d4ff" stroke-width="1.5" fill="none"/>
        <circle cx="20" cy="20" r="3" fill="#00d4ff" opacity="0.5"/>
      </svg>
    {/if}
  </div>
  <span class="icon-label">{label}</span>
</button>

<style>
  .icon-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 2px;
    transition: background 0.12s;
    user-select: none;
    -webkit-user-select: none;
    outline: none;
    width: 80px;
  }

  .icon-btn:hover {
    background: rgba(0, 212, 255, 0.08);
  }

  .icon-btn:focus-visible {
    outline: 1px solid var(--color-accent);
  }

  /* Selected state — handle externally with a class if needed */
  .icon-btn:active {
    background: rgba(0, 212, 255, 0.15);
  }

  .icon-graphic {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-graphic svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 4px rgba(0, 212, 255, 0.3));
    transition: filter 0.12s;
  }

  .icon-btn:hover .icon-graphic svg {
    filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.6));
  }

  .icon-label {
    color: var(--color-text);
    font-family: var(--font-mono);
    font-size: 11px;
    text-align: center;
    word-break: break-word;
    line-height: 1.3;
    max-width: 72px;
    text-shadow: 0 1px 4px rgba(0,0,0,0.8);
  }
</style>
