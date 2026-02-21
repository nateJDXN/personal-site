<script>
  import { bringToFront, closeWindow, minimizeWindow } from '$lib/stores/desktop.svelte.js';
  import { screenRect } from '$lib/stores/scene.svelte.js';

  /**
   * Props:
   *   id        — window identifier (matches desktop store)
   *   title     — title bar text
   *   zIndex    — z-index managed by desktop store
   *   children  — slot content (Svelte 5 snippet)
   */
  let { id, title = 'Window', zIndex = 10, children } = $props();

  // Starting position — offset each window slightly so they cascade
  const baseX = 80 + Math.random() * 120;
  const baseY = 60 + Math.random() * 80;

  let x = $state(baseX);
  let y = $state(baseY);
  let isDragging = $state(false);
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let windowEl = $state(null);

  const TASKBAR_H = 36;

  /** Auto-fullscreen when screen is too small to fit window content */
  const isAutoFullscreen = $derived(
    screenRect.width > 0 && (
      screenRect.width < 450 || screenRect.height < 350
    )
  );

  /** Screen-relative max dimensions for normal mode */
  const maxW = $derived(screenRect.width > 0 ? screenRect.width : 600);
  const maxH = $derived(screenRect.height > 0 ? screenRect.height - TASKBAR_H : 400);

  /** Computed inline style */
  const windowStyle = $derived(
    isAutoFullscreen
      ? `left: 0; top: 0; right: 0; bottom: ${TASKBAR_H}px; z-index: ${zIndex};`
      : `left: ${x}px; top: ${y}px; z-index: ${zIndex}; max-width: ${maxW}px; max-height: ${maxH}px;`
  );

  function clampPosition(rawX, rawY) {
    const winW = windowEl?.offsetWidth ?? 320;
    const winH = windowEl?.offsetHeight ?? 200;
    return {
      x: Math.max(0, Math.min(rawX, screenRect.width - winW)),
      y: Math.max(0, Math.min(rawY, screenRect.height - TASKBAR_H - winH)),
    };
  }

  function onTitleMousedown(e) {
    if (e.button !== 0) return;
    if (isAutoFullscreen) { bringToFront(id); return; }
    bringToFront(id);
    isDragging = true;
    dragOffsetX = (e.clientX - screenRect.left) - x;
    dragOffsetY = (e.clientY - screenRect.top) - y;

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    const rawX = (e.clientX - screenRect.left) - dragOffsetX;
    const rawY = (e.clientY - screenRect.top) - dragOffsetY;
    const clamped = clampPosition(rawX, rawY);
    x = clamped.x;
    y = clamped.y;
  }

  function onMouseUp() {
    isDragging = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  function handleWindowClick() {
    bringToFront(id);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="window window-shadow"
  class:dragging={isDragging}
  class:auto-fullscreen={isAutoFullscreen}
  style={windowStyle}
  onmousedown={handleWindowClick}
  bind:this={windowEl}
>
  <!-- Title bar -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="title-bar"
    onmousedown={onTitleMousedown}
  >
    <!-- Traffic lights -->
    <div class="traffic-lights">
      <button
        class="tl-btn tl-close"
        title="Close"
        onmousedown={(e) => e.stopPropagation()}
        onclick={() => closeWindow(id)}
      ></button>
      <button
        class="tl-btn tl-minimize"
        title="Minimize"
        onmousedown={(e) => e.stopPropagation()}
        onclick={() => minimizeWindow(id)}
      ></button>
    </div>

    <span class="title-text">{title}</span>

    <div class="title-right"></div>
  </div>

  <!-- Content area -->
  <div class="window-body">
    {@render children?.()}
  </div>
</div>

<style>
  .window {
    position: absolute;
    min-width: min(320px, 100%);
    min-height: min(200px, 100%);
    /* max-width and max-height driven by inline style (screen-relative) */
    display: flex;
    flex-direction: column;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    overflow: hidden;
    will-change: transform;
  }

  .window.auto-fullscreen {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .window.dragging {
    user-select: none;
    cursor: grabbing;
  }

  /* ── Title bar ────────────────────────────────────── */
  .title-bar {
    display: flex;
    align-items: center;
    height: var(--window-title-h);
    background: var(--color-surface-2);
    border-bottom: 1px solid var(--color-border);
    cursor: grab;
    flex-shrink: 0;
    padding: 0 8px;
    user-select: none;
    -webkit-user-select: none;
  }

  .title-bar:active {
    cursor: grabbing;
  }

  .traffic-lights {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .tl-btn {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid transparent;
    cursor: pointer;
    padding: 0;
    transition: filter 0.1s;
  }

  .tl-btn:hover {
    filter: brightness(1.3);
  }

  .tl-close {
    background: var(--color-error);
    border-color: #cc1111;
  }

  .tl-minimize {
    background: var(--color-warn);
    border-color: #cc7700;
  }

  .title-text {
    flex: 1;
    text-align: center;
    font-size: 11px;
    color: var(--color-dim);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .title-right {
    width: 44px; /* balance out the traffic lights */
  }

  /* ── Body ─────────────────────────────────────────── */
  .window-body {
    flex: 1;
    overflow: auto;
    padding: 1rem;
    color: var(--color-text);
    font-size: 13px;
    line-height: 1.6;
  }
</style>
