<script>
  import { toasts } from '$lib/stores/easter-eggs.svelte.js';
</script>

<div class="toast-container">
  {#each toasts as toast (toast.toastId)}
    <div class="toast" role="status">
      <div class="toast-header">
        <span class="egg-icon">🥚</span>
        <span class="toast-title">EASTER EGG FOUND</span>
      </div>
      <div class="toast-body">"{toast.label}"</div>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: absolute;
    bottom: calc(var(--taskbar-h) + 12px);
    right: 16px;
    z-index: 9000;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
  }

  .toast {
    background: var(--color-surface);
    border: 1px solid var(--color-accent2);
    border-radius: var(--radius);
    padding: 10px 14px;
    min-width: 220px;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.25), 0 4px 16px rgba(0,0,0,0.5);
    animation: toast-in 0.25s ease-out, toast-out 0.3s ease-in 3.7s forwards;
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes toast-out {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(16px); }
  }

  .toast-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .egg-icon {
    font-size: 14px;
  }

  .toast-title {
    font-size: 10px;
    color: var(--color-accent2);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-shadow: 0 0 6px var(--color-accent2);
  }

  .toast-body {
    font-size: 12px;
    color: var(--color-text);
    padding-left: 2px;
  }
</style>
