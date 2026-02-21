<script>
  import { closeAuthModal } from '$lib/stores/auth.svelte.js';
  import { loginWithOAuth } from '$lib/pocketbase.js';

  let loading = $state(false);
  let error = $state('');

  async function handleOAuth(provider) {
    loading = true;
    error = '';
    try {
      await loginWithOAuth(provider);
      closeAuthModal();
    } catch (e) {
      error = e?.message ?? 'Authentication failed. Please try again.';
    } finally {
      loading = false;
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) closeAuthModal();
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') closeAuthModal();
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-backdrop" onclick={handleBackdropClick} onkeydown={handleKeydown} role="dialog" aria-modal="true" aria-label="Login" tabindex="-1">
  <div class="modal-box window-shadow">
    <!-- Title bar -->
    <div class="modal-title-bar">
      <span class="modal-title">LOGIN</span>
      <button class="close-btn" onclick={closeAuthModal} title="Close">✕</button>
    </div>

    <!-- Body -->
    <div class="modal-body">
      <div class="prompt-line">
        <span class="prompt-sym">&gt;_</span>
        <span class="prompt-text">AUTHENTICATE TO SAVE PROGRESS</span>
      </div>

      <div class="divider"></div>

      {#if error}
        <div class="error-msg">{error}</div>
      {/if}

      <div class="oauth-buttons">
        <button
          class="oauth-btn github"
          onclick={() => handleOAuth('github')}
          disabled={loading}
        >
          <svg class="oauth-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          {loading ? 'Connecting...' : 'Login with GitHub'}
        </button>

        <button
          class="oauth-btn google"
          onclick={() => handleOAuth('google')}
          disabled={loading}
        >
          <svg class="oauth-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loading ? 'Connecting...' : 'Login with Google'}
        </button>
      </div>

      <div class="footer-note">
        Your account is used only to save easter egg progress.<br/>
        No personal data is stored beyond your OAuth identity.
      </div>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: absolute;
    inset: 0;
    z-index: 8000;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
  }

  .modal-box {
    width: 360px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    overflow: hidden;
    animation: modal-in 0.15s ease-out;
  }

  @keyframes modal-in {
    from { opacity: 0; transform: scale(0.96) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .modal-title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--window-title-h);
    background: var(--color-surface-2);
    border-bottom: 1px solid var(--color-border);
    padding: 0 10px;
  }

  .modal-title {
    font-size: 11px;
    color: var(--color-dim);
    letter-spacing: 0.12em;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--color-dim);
    cursor: pointer;
    font-size: 12px;
    padding: 2px 4px;
    line-height: 1;
    transition: color 0.1s;
  }

  .close-btn:hover {
    color: var(--color-error);
  }

  .modal-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .prompt-line {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .prompt-sym {
    color: var(--color-accent2);
    font-size: 14px;
    font-weight: 700;
  }

  .prompt-text {
    color: var(--color-text);
    font-size: 12px;
    letter-spacing: 0.06em;
  }

  .divider {
    height: 1px;
    background: var(--color-border);
  }

  .error-msg {
    color: var(--color-error);
    font-size: 12px;
    padding: 8px 10px;
    border: 1px solid var(--color-error);
    background: rgba(255, 68, 68, 0.06);
  }

  .oauth-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .oauth-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: 1px solid var(--color-border);
    background: var(--color-surface-2);
    color: var(--color-text);
    font-family: var(--font-mono);
    font-size: 12px;
    border-radius: var(--radius);
    cursor: pointer;
    transition: border-color 0.12s, background 0.12s, color 0.12s;
    text-align: left;
  }

  .oauth-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .oauth-btn.github:hover:not(:disabled) {
    border-color: #fff;
    background: rgba(255, 255, 255, 0.04);
    color: #fff;
  }

  .oauth-btn.google:hover:not(:disabled) {
    border-color: #4285F4;
    background: rgba(66, 133, 244, 0.06);
    color: #4285F4;
  }

  .oauth-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .footer-note {
    font-size: 10px;
    color: var(--color-dim);
    line-height: 1.5;
    text-align: center;
  }
</style>
