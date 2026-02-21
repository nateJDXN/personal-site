// desktop.svelte.js — Open windows and active window state (Svelte 5 runes)
// Exported as plain $state objects so any component can import and use them.

/** @type {{ id: string; title: string; component: any; props?: Record<string,any>; minimized: boolean; zIndex: number }[]} */
export const windows = $state([]);

// Private: z-index counter and open-count tracker (no need for reactivity)
let _nextZ = 10;
let _openCounts = {};

/** Open (or un-minimize) a window by id. If it doesn't exist yet, create it. */
export function openWindow({ id, title, component, props = {} }) {
  const existing = windows.find((w) => w.id === id);
  if (existing) {
    existing.minimized = false;
    bringToFront(id);
    return;
  }
  _nextZ += 1;
  windows.push({ id, title, component, props, minimized: false, zIndex: _nextZ });

  // Track open count for the folder-spam egg
  _openCounts[id] = (_openCounts[id] ?? 0) + 1;
}

/** Close (remove) a window by id. */
export function closeWindow(id) {
  const idx = windows.findIndex((w) => w.id === id);
  if (idx !== -1) windows.splice(idx, 1);
}

/** Minimize a window. */
export function minimizeWindow(id) {
  const w = windows.find((w) => w.id === id);
  if (w) w.minimized = true;
}

/** Bring window to front (highest z-index). */
export function bringToFront(id) {
  const w = windows.find((w) => w.id === id);
  if (!w) return;
  _nextZ += 1;
  w.zIndex = _nextZ;
}

/** How many times has a specific window been opened (for easter eggs). */
export function getOpenCount(id) {
  return _openCounts[id] ?? 0;
}
