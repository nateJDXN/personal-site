<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  /** Called when the boot sequence finishes. */
  let { onComplete } = $props();

  let containerEl;
  let lines = $state([]);
  let progressPct = $state(0);
  let showProgress = $state(false);
  let done = $state(false);

  const BIOS_LINES = [
    'RETRO/BIOS v2.4.1  Copyright (C) 1994-2024',
    '',
    'CPU: Pentium II-Compatible 350MHz',
    'Testing memory... 640KB OK',
    'Extended memory: 64512KB OK',
    '',
    'Auto-detecting primary IDE controller... OK',
    'Auto-detecting secondary IDE controller... OK',
    '',
    'PNP BIOS initialized',
    'Loading RETRO/OS 1.0...',
  ];

  onMount(() => {
    runBootSequence();
  });

  async function runBootSequence() {
    // Stagger BIOS lines
    const tl = gsap.timeline();

    for (let i = 0; i < BIOS_LINES.length; i++) {
      const delay = BIOS_LINES[i] === '' ? 0.04 : 0.12;
      tl.call(
        () => {
          lines = [...lines, BIOS_LINES[i]];
        },
        [],
        `+=${delay}`
      );
    }

    // Show progress bar
    tl.call(() => {
      showProgress = true;
    }, [], '+=0.3');

    // Animate loading bar
    tl.to({}, {
      duration: 2.2,
      ease: 'none',
      onUpdate() {
        progressPct = Math.round(this.progress() * 100);
      },
    });

    tl.call(() => {
      done = true;
    });

    tl.call(() => {
      // Fade out the boot screen
      gsap.to(containerEl, {
        opacity: 0,
        duration: 0.5,
        delay: 0.3,
        onComplete: () => {
          onComplete?.();
        },
      });
    });
  }
</script>

<div
  bind:this={containerEl}
  class="boot-screen"
>
  <div class="boot-inner">
    {#each lines as line}
      <div class="boot-line">{line || '\u00A0'}</div>
    {/each}

    {#if showProgress}
      <div class="progress-section">
        <div class="progress-label">Loading... {progressPct}%</div>
        <div class="progress-track">
          <div class="progress-fill" style="width: {progressPct}%"></div>
        </div>
      </div>
    {/if}

    {#if !done}
      <span class="cursor-blink"></span>
    {/if}
  </div>
</div>

<style>
  .boot-screen {
    position: fixed;
    inset: 0;
    background: #000;
    z-index: 10000;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 2rem;
    font-family: var(--font-mono);
  }

  .boot-inner {
    max-width: 640px;
    width: 100%;
  }

  .boot-line {
    color: #c8d8e8;
    font-size: 13px;
    line-height: 1.7;
    white-space: pre;
  }

  .progress-section {
    margin-top: 1.5rem;
  }

  .progress-label {
    color: #00d4ff;
    font-size: 12px;
    margin-bottom: 6px;
  }

  .progress-track {
    width: 400px;
    max-width: 100%;
    height: 12px;
    border: 1px solid #1e3a5f;
    background: #0a0e1a;
    position: relative;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: #00d4ff;
    transition: width 0.05s linear;
    box-shadow: 0 0 8px #00d4ff88;
  }
</style>
