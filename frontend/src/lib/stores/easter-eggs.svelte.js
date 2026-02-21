// easter-eggs.js — Found eggs state and notification queue (Svelte 5 runes)
import { browser } from '$app/environment';
import { EGGS } from '$lib/easter-eggs.config.js';
import { saveEggProgress, getPb } from '$lib/pocketbase.js';

/** Set of egg IDs the current user has found. */
export let foundEggs = $state(new Set());

/** Toast notifications queue. Each item: { id, label } */
export let toasts = $state([]);

/** Load egg progress from an array of IDs (called after login). */
export function loadEggProgress(ids) {
  for (const id of ids) foundEggs.add(id);
}

/**
 * Mark an egg as found.
 * Shows a toast, persists to localStorage, and syncs to PocketBase if logged in.
 */
export async function findEgg(id) {
  if (foundEggs.has(id)) return; // already found

  const egg = EGGS.find((e) => e.id === id);
  if (!egg) return;

  foundEggs.add(id);

  // Persist locally
  if (browser) {
    const saved = JSON.parse(localStorage.getItem('foundEggs') ?? '[]');
    saved.push(id);
    localStorage.setItem('foundEggs', JSON.stringify(saved));
  }

  // Toast
  const toastId = Math.random().toString(36).slice(2);
  toasts.push({ toastId, label: egg.label });
  setTimeout(() => {
    const idx = toasts.findIndex((t) => t.toastId === toastId);
    if (idx !== -1) toasts.splice(idx, 1);
  }, 4000);

  // Sync to PocketBase if logged in
  if (browser && getPb().authStore.isValid) {
    await saveEggProgress(foundEggs);
  }
}

/** Restore locally-persisted eggs on page load (before auth). */
export function restoreLocalEggs() {
  if (!browser) return;
  const saved = JSON.parse(localStorage.getItem('foundEggs') ?? '[]');
  for (const id of saved) foundEggs.add(id);
}
