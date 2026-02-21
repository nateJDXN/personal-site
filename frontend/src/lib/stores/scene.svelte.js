/**
 * scene.svelte.js
 * Publishes the .screen element's bounding rect so Window.svelte can
 * convert drag coordinates from viewport-space to screen-local-space.
 */

export const screenRect = $state({ left: 0, top: 0, width: 0, height: 0 });

/** Called by DeskScene on mount and on window resize. Pass the .screen DOM element. */
export function updateScreenRect(el) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  screenRect.left = r.left;
  screenRect.top = r.top;
  screenRect.width = r.width;
  screenRect.height = r.height;
}
