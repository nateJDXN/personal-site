import PocketBase from 'pocketbase';
import { browser } from '$app/environment';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

// Singleton PocketBase client — all PocketBase access goes through this module.
let _pb;

export function getPb() {
  if (!_pb) {
    _pb = new PocketBase(PUBLIC_POCKETBASE_URL);
    // Auto-refresh token when it is about to expire
    if (browser) {
      _pb.authStore.onChange(() => {
        // Persisted automatically by PocketBase in localStorage
      });
    }
  }
  return _pb;
}

// ─── Auth helpers ───────────────────────────────────────────────────────────

/**
 * Kick off OAuth2 flow with the given provider.
 * @param {'github'|'google'} provider
 */
export async function loginWithOAuth(provider) {
  const pb = getPb();
  const authData = await pb.collection('users').authWithOAuth2({ provider });
  return authData;
}

export async function logout() {
  const pb = getPb();
  pb.authStore.clear();
}

// ─── Easter egg progress ────────────────────────────────────────────────────

/** Fetch the current user's egg progress record, or null if not found. */
export async function fetchEggProgress() {
  const pb = getPb();
  if (!pb.authStore.isValid) return null;
  try {
    const records = await pb.collection('easter_egg_progress').getFullList({
      filter: `user = "${pb.authStore.model.id}"`,
    });
    return records[0] ?? null;
  } catch {
    return null;
  }
}

/** Save (create or update) the set of found egg IDs to PocketBase. */
export async function saveEggProgress(foundEggIds) {
  const pb = getPb();
  if (!pb.authStore.isValid) return;
  try {
    const existing = await fetchEggProgress();
    const data = {
      user: pb.authStore.model.id,
      found_eggs: JSON.stringify([...foundEggIds]),
    };
    if (existing) {
      await pb.collection('easter_egg_progress').update(existing.id, data);
    } else {
      await pb.collection('easter_egg_progress').create(data);
    }
  } catch (err) {
    console.warn('Failed to save egg progress:', err);
  }
}
