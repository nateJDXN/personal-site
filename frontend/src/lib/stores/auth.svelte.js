// auth.svelte.js — Current user and session state (Svelte 5 runes)
import { browser } from '$app/environment';
import { getPb, fetchEggProgress, logout as pbLogout } from '$lib/pocketbase.js';
import { loadEggProgress } from '$lib/stores/easter-eggs.svelte.js';

/**
 * Session state. Properties are mutated (not reassigned) to satisfy the
 * Svelte 5 rule: "Cannot export state from a module if it is reassigned."
 */
export const authState = $state({ model: null, isValid: false });

/**
 * UI state for the auth modal. Same rule — only mutate `.open`, never reassign.
 */
export const authUi = $state({ open: false });

/** Initialise auth state from PocketBase's persisted store (call once on mount). */
export function initAuth() {
  if (!browser) return;
  const pb = getPb();
  authState.model = pb.authStore.model;
  authState.isValid = pb.authStore.isValid;

  pb.authStore.onChange(async (_token, model) => {
    authState.model = model;
    authState.isValid = pb.authStore.isValid;

    if (authState.isValid) {
      const progress = await fetchEggProgress();
      if (progress) {
        const ids = JSON.parse(progress.found_eggs ?? '[]');
        loadEggProgress(ids);
      }
    }
  });
}

export function openAuthModal() {
  authUi.open = true;
}

export function closeAuthModal() {
  authUi.open = false;
}

export async function logout() {
  await pbLogout();
  authState.model = null;
  authState.isValid = false;
}
