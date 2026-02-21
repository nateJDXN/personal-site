<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Desktop from './Desktop.svelte';
  import { updateScreenRect } from '$lib/stores/scene.svelte.js';

  /** Callback props for desk object interactions (Svelte 5 pattern). */
  let { oncatclick = () => {}, onmugclick = () => {} } = $props();

  /** Bound to the .screen div — used to publish screen coordinates to Window.svelte. */
  let screenEl = $state(null);

  /** Kiosk mode: hide desk chrome, show Desktop fullscreen */
  let kioskMode = $state(false);

  const KIOSK_WIDTH = 700;
  const KIOSK_ASPECT = 1.0;

  function computeKiosk() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    kioskMode = w < KIOSK_WIDTH || (w / h) <= KIOSK_ASPECT;
  }

  function scheduleRectUpdate() {
    requestAnimationFrame(() => updateScreenRect(screenEl));
  }

  onMount(() => {
    computeKiosk();
    scheduleRectUpdate();

    const ro = new ResizeObserver(() => {
      computeKiosk();
      scheduleRectUpdate();
    });
    ro.observe(document.documentElement);

    return () => ro.disconnect();
  });
</script>

<div class="scene">

  {#if !kioskMode}
    <!-- Ambient background: soft hazy wall behind the desk -->
    <div class="scene-bg" aria-hidden="true" transition:fade={{ duration: 200 }}></div>

    <!-- Desk surface -->
    <div class="desk-surface" aria-hidden="true" transition:fade={{ duration: 200 }}>
      <div class="desk-edge" aria-hidden="true"></div>
    </div>

    <!-- Cat placeholder: left side of desk -->
    <!-- svelte-ignore a11y_interactive_supports_focus -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="desk-object cat-placeholder"
      role="button"
      tabindex="0"
      onclick={oncatclick}
      onkeydown={(e) => e.key === 'Enter' && oncatclick()}
      aria-label="Cat (click to interact)"
      title="A cat is sleeping here"
      transition:fade={{ duration: 200 }}
    >
      <span class="placeholder-label">cat here</span>
    </div>

    <!-- Mug placeholder: right side of desk -->
    <!-- svelte-ignore a11y_interactive_supports_focus -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="desk-object mug-placeholder"
      role="button"
      tabindex="0"
      onclick={onmugclick}
      onkeydown={(e) => e.key === 'Enter' && onmugclick()}
      aria-label="Coffee mug (click to interact)"
      title="A coffee mug"
      transition:fade={{ duration: 200 }}
    >
      <span class="placeholder-label">mug here</span>
    </div>

    <!-- 3D perspective wrapper -->
    <div class="perspective-stage" transition:fade={{ duration: 200 }}>

      <!-- The Macintosh body -->
      <div class="mac-body">

        <!-- Top face: visible due to rotateX tilt (3D depth illusion) -->
        <div class="mac-top-face" aria-hidden="true">
          <div class="mac-top-vents" aria-hidden="true"></div>
        </div>

        <!-- Front face: the main visible surface -->
        <div class="mac-front">

          <!-- Plastic sheen overlay -->
          <div class="mac-sheen" aria-hidden="true"></div>

          <!-- Screen recess: the sunken area housing the CRT -->
          <div class="screen-recess">
            <div class="screen" bind:this={screenEl}>
              <Desktop />
              <!-- CRT glass glare -->
              <div class="screen-glare" aria-hidden="true"></div>
            </div>
          </div>

          <!-- Chin area below screen -->
          <div class="mac-chin">
            <!-- Left: floppy disk slot -->
            <div class="floppy-slot" aria-hidden="true">
              <div class="floppy-slit"></div>
            </div>

            <!-- Center: brand badge -->
            <div class="mac-badge" aria-hidden="true">
              <div class="badge-rainbow" aria-hidden="true"></div>
              <span class="badge-text">retro/os</span>
            </div>

            <!-- Right: eject + power buttons -->
            <div class="chin-buttons" aria-hidden="true">
              <button class="chin-btn eject-btn" title="Eject" tabindex="-1">
                <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10">
                  <polygon points="8,2 14,9 2,9" />
                  <rect x="2" y="11" width="12" height="2" rx="0.5" />
                </svg>
              </button>
              <button class="chin-btn power-btn" title="Power" tabindex="-1">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" width="10" height="10">
                  <path d="M8 1v5" />
                  <path d="M4.2 3.8a6 6 0 1 0 7.6 0" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Keyboard -->
      <div class="keyboard" aria-hidden="true">
        <div class="keyboard-body">
          <div class="key-row">
            {#each Array(13) as _, i}
              <div class="key key-sm"></div>
            {/each}
            <div class="key key-md"></div>
          </div>
          <div class="key-row">
            <div class="key key-md"></div>
            {#each Array(12) as _, i}
              <div class="key key-sm"></div>
            {/each}
            <div class="key key-sm"></div>
          </div>
          <div class="key-row">
            <div class="key key-lg"></div>
            {#each Array(11) as _, i}
              <div class="key key-sm"></div>
            {/each}
            <div class="key key-lg"></div>
          </div>
          <div class="key-row">
            <div class="key key-xl"></div>
            {#each Array(9) as _, i}
              <div class="key key-sm"></div>
            {/each}
            <div class="key key-xl"></div>
          </div>
          <div class="key-row">
            {#each Array(3) as _, i}
              <div class="key key-md"></div>
            {/each}
            <div class="key key-space"></div>
            {#each Array(3) as _, i}
              <div class="key key-md"></div>
            {/each}
          </div>
        </div>
      </div>

    </div>
  {:else}
    <!-- Kiosk mode: Desktop fills the entire viewport -->
    <div class="screen kiosk-screen" bind:this={screenEl} transition:fade={{ duration: 200 }}>
      <Desktop />
    </div>
  {/if}
</div>

<style>
  /* ════════════════════════════════════════════════════════════════
     SCENE ROOT — full viewport
     ════════════════════════════════════════════════════════════════ */
  .scene {
    position: fixed;
    inset: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ════════════════════════════════════════════════════════════════
     BACKGROUND — soft hazy wall (city pop warm tones)
     ════════════════════════════════════════════════════════════════ */
  .scene-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: linear-gradient(
      175deg,
      #8a9ba8 0%,
      #97a4a0 15%,
      #b8c0b0 35%,
      #c8bda0 55%,
      #d4c8a8 75%,
      #c8b898 100%
    );
  }

  /* Warm haze overlays */
  .scene-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 45% 40%, rgba(210, 195, 160, 0.35) 0%, transparent 65%),
      radial-gradient(ellipse 60% 40% at 70% 20%, rgba(140, 160, 170, 0.20) 0%, transparent 55%),
      radial-gradient(ellipse 90% 50% at 50% 100%, rgba(180, 155, 120, 0.18) 0%, transparent 45%);
  }

  /* ════════════════════════════════════════════════════════════════
     DESK SURFACE — flat plane filling the lower portion
     ════════════════════════════════════════════════════════════════ */
  .desk-surface {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 52%;
    z-index: 1;
    background: linear-gradient(
      180deg,
      #7a9aad 0%,
      #6e90a5 30%,
      #6888a0 60%,
      #5f7f98 100%
    );
  }

  /* Subtle desk texture — fine noise-like crosshatch */
  .desk-surface::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.08;
    background:
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 3px,
        rgba(0, 0, 0, 0.12) 3px,
        rgba(0, 0, 0, 0.12) 4px
      ),
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 3px,
        rgba(0, 0, 0, 0.08) 3px,
        rgba(0, 0, 0, 0.08) 4px
      );
  }

  /* Front edge of the desk */
  .desk-edge {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 18px;
    background: linear-gradient(to bottom, #5a7888, #4a6878);
    box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.06);
  }

  /* ════════════════════════════════════════════════════════════════
     PERSPECTIVE STAGE — 3D transform context
     Looking down from above (rotateX tilts top away from viewer)
     ════════════════════════════════════════════════════════════════ */
  .perspective-stage {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: perspective(1800px) rotateX(8deg);
    transform-origin: 50% 70%;
    /* Straight-on view — no tilt */
    margin-top: 3vh;
    will-change: transform;
  }

  /* ════════════════════════════════════════════════════════════════
     MACINTOSH BODY — the all-in-one boxy CRT unit
     ════════════════════════════════════════════════════════════════ */
  .mac-body {
    position: relative;
    width: clamp(560px, 75vw, 848px);
    /* Golden proportions for the Mac Classic shape */
    aspect-ratio: 1.22;
    transform-style: preserve-3d;
  }

  /* ════════════════════════════════════════════════════════════════
     FRONT FACE — main visible surface of the Macintosh
     ════════════════════════════════════════════════════════════════ */
  .mac-front {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      165deg,
      #d8d0c0 0%,
      #d0c8b8 20%,
      #c8c0af 50%,
      #c0b8a5 80%,
      #b8b09d 100%
    );
    border-radius: 16px 16px 10px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 7% 8% 5% 8%;
    box-shadow:
      /* Outer edge highlights — plastic beveling */
      inset 0  2px 0 rgba(255, 255, 255, 0.35),
      inset 0 -2px 0 rgba(0, 0, 0, 0.12),
      inset  2px 0 0 rgba(255, 255, 255, 0.15),
      inset -1px 0 0 rgba(0, 0, 0, 0.06),
      /* Cast shadow onto desk */
      0 40px 80px rgba(0, 0, 0, 0.35),
      0 15px 35px rgba(0, 0, 0, 0.25),
      0 5px 12px rgba(0, 0, 0, 0.18);
  }

  /* Plastic sheen: overhead light reflection */
  .mac-sheen {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      155deg,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0.05) 25%,
      transparent 50%,
      rgba(0, 0, 0, 0.03) 100%
    );
    pointer-events: none;
    z-index: 5;
  }

    /* ════════════════════════════════════════════════════════════════
     TOP FACE — 3D depth visible from overhead angle
     ════════════════════════════════════════════════════════════════ */
  .mac-top-face {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(
      180deg,
      #d8d0c0 0%,
      #c8bfad 100%
    );
    border-radius: 16px 16px 0 0;
    transform: rotateX(72deg);
    transform-origin: bottom center;
    box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.08);
  }

  .mac-top-vents {
    position: absolute;
    top: 8px;
    left: 20%;
    right: 20%;
    height: 22px;
    background: repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 5px,
      rgba(0, 0, 0, 0.12) 5px,
      rgba(0, 0, 0, 0.12) 7px
    );
    border-radius: 2px;
  }

  /* ════════════════════════════════════════════════════════════════
     SCREEN RECESS — sunken area housing the CRT tube
     ════════════════════════════════════════════════════════════════ */
  .screen-recess {
    position: relative;
    width: 100%;
    flex: 1;
    background: #2a2520;
    border-radius: 10px;
    padding: 10px;
    box-shadow:
      /* Deep inset shadow — the tube cavity */
      inset 0  4px 12px rgba(0, 0, 0, 0.55),
      inset 0 -2px  6px rgba(0, 0, 0, 0.25),
      inset  3px 0 8px rgba(0, 0, 0, 0.35),
      inset -3px 0 8px rgba(0, 0, 0, 0.35),
      /* Outer bevel at the recess lip */
      0 2px 0 rgba(255, 255, 255, 0.08),
      0 -1px 0 rgba(0, 0, 0, 0.15);
  }

  /* ════════════════════════════════════════════════════════════════
     SCREEN — coordinate anchor for Desktop and all children
     ════════════════════════════════════════════════════════════════ */
  .screen {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--color-bg);
    border-radius: 6px;
    box-shadow:
      /* Phosphor depth */
      inset 0 0 40px rgba(0, 0, 0, 0.5),
      /* Subtle CRT glow */
      0 0 20px rgba(0, 212, 255, 0.03),
      0 0 60px rgba(0, 212, 255, 0.02);
  }

  /* Glass glare: curved CRT reflection */
  .screen-glare {
    position: absolute;
    inset: 0;
    z-index: 200;
    pointer-events: none;
    border-radius: 6px;
    background:
      radial-gradient(
        ellipse 45% 30% at 25% 15%,
        rgba(255, 255, 255, 0.06) 0%,
        transparent 60%
      ),
      radial-gradient(
        ellipse 30% 20% at 75% 85%,
        rgba(255, 255, 255, 0.02) 0%,
        transparent 50%
      );
  }

  /* ════════════════════════════════════════════════════════════════
     CHIN — area below the screen (floppy + brand)
     ════════════════════════════════════════════════════════════════ */
  .mac-chin {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 4px 0 4px;
    gap: 12px;
  }

  /* Floppy disk slot */
  .floppy-slot {
    width: 180px;
    height: 14px;
    flex-shrink: 0;
    background: linear-gradient(to bottom, #a09888, #b0a898, #a89888);
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      inset 0 1px 3px rgba(0, 0, 0, 0.25),
      0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .floppy-slit {
    width: 85%;
    height: 3px;
    background: #3a3530;
    border-radius: 1px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.4);
  }

  /* Brand badge — centered */
  .mac-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  /* Chin buttons — eject + power */
  .chin-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .chin-btn {
    width: 22px;
    height: 22px;
    border: none;
    border-radius: 3px;
    background: linear-gradient(to bottom, #b8b0a0, #a8a090);
    color: #706858;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow:
      inset 0  1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.15);
    transition: background 0.1s, box-shadow 0.1s, transform 0.08s;
  }

  .chin-btn:hover {
    background: linear-gradient(to bottom, #c0b8a8, #b0a898);
    color: #5a5040;
  }

  .chin-btn:active {
    transform: translateY(1px);
    box-shadow:
      inset 0  1px 2px rgba(0, 0, 0, 0.15),
      0 0 1px rgba(0, 0, 0, 0.1);
  }

  .badge-rainbow {
    width: 10px;
    height: 12px;
    border-radius: 1px;
    background: linear-gradient(
      to bottom,
      #61BB46 0%,
      #61BB46 16.6%,
      #FDB827 16.6%,
      #FDB827 33.3%,
      #F5821F 33.3%,
      #F5821F 50%,
      #E03A3E 50%,
      #E03A3E 66.6%,
      #963D97 66.6%,
      #963D97 83.3%,
      #009DDC 83.3%,
      #009DDC 100%
    );
  }

  .badge-text {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 500;
    color: #8a8070;
    letter-spacing: 0.08em;
    user-select: none;
  }

  /* ════════════════════════════════════════════════════════════════
     KEYBOARD — in front of the Macintosh
     ════════════════════════════════════════════════════════════════ */
  .keyboard {
    margin-top: 18px;
    width: clamp(380px, 65vw, 480px);
  }

  .keyboard-body {
    background: linear-gradient(
      180deg,
      #d0c8b8 0%,
      #c8c0af 40%,
      #c0b8a5 100%
    );
    border-radius: 6px 6px 8px 8px;
    padding: 8px 10px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    box-shadow:
      /* Beveled edge */
      inset 0  1px 0 rgba(255, 255, 255, 0.25),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1),
      inset  1px 0 0 rgba(255, 255, 255, 0.1),
      inset -1px 0 0 rgba(0, 0, 0, 0.05),
      /* Shadow on desk */
      0 8px 20px rgba(0, 0, 0, 0.2),
      0 3px 8px rgba(0, 0, 0, 0.15);
  }

  .key-row {
    display: flex;
    gap: 2px;
    justify-content: center;
  }

  .key {
    height: 14px;
    background: linear-gradient(to bottom, #e8e0d0, #d8d0c0);
    border-radius: 2px;
    box-shadow:
      inset 0  1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.12),
      0 1px 1px rgba(0, 0, 0, 0.1);
  }

  .key-sm { width: 16px; }
  .key-md { width: 22px; }
  .key-lg { width: 30px; }
  .key-xl { width: 38px; }
  .key-space { width: 100px; }

  /* ════════════════════════════════════════════════════════════════
     DESK OBJECTS — cat & mug placeholders
     ════════════════════════════════════════════════════════════════ */
  .desk-object {
    position: absolute;
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px dashed rgba(50, 70, 85, 0.45);
    border-radius: 6px;
    background: rgba(80, 110, 130, 0.08);
    transition: background 0.15s ease, border-color 0.15s ease, transform 0.12s ease, box-shadow 0.12s ease;
    user-select: none;
    -webkit-user-select: none;
  }

  .desk-object:hover {
    background: rgba(80, 110, 130, 0.18);
    border-color: rgba(70, 100, 120, 0.7);
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
  }

  .desk-object:active {
    transform: translateY(-1px);
    background: rgba(80, 110, 130, 0.24);
  }

  .placeholder-label {
    font-family: var(--font-mono);
    font-size: 10px;
    color: rgba(40, 65, 85, 0.55);
    letter-spacing: 0.07em;
    text-align: center;
    pointer-events: none;
  }

  /* Cat: left of desk */
  .cat-placeholder {
    width: 100px;
    height: 130px;
    bottom: 10%;
    left: 7%;
  }

  /* Mug: right of desk */
  .mug-placeholder {
    width: 65px;
    height: 85px;
    bottom: 14%;
    right: 8%;
  }

  /* ════════════════════════════════════════════════════════════════
     KIOSK MODE — Desktop fills entire viewport
     ════════════════════════════════════════════════════════════════ */
  .kiosk-screen {
    position: absolute;
    inset: 0;
    z-index: 10;
    overflow: hidden;
    background: var(--color-bg);
  }
</style>
