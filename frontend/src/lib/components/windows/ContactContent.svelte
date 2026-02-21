<script>
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let sent = $state(false);
  let sending = $state(false);

  async function handleSubmit(e) {
    e.preventDefault();
    sending = true;
    // Simulate send delay (replace with real email API / Formspree / etc.)
    await new Promise((r) => setTimeout(r, 1200));
    sent = true;
    sending = false;
  }
</script>

<div class="contact-content">
  <div class="cmd-line">
    <span class="prompt">&gt;</span> contact --new-message
  </div>

  {#if sent}
    <div class="sent-msg">
      <div class="sent-icon">✓</div>
      <div>
        <div class="sent-title">MESSAGE SENT</div>
        <div class="sent-sub">I'll get back to you soon.</div>
      </div>
    </div>
  {:else}
    <form class="contact-form" onsubmit={handleSubmit}>
      <label class="field">
        <span class="field-label">NAME:</span>
        <input
          type="text"
          class="field-input"
          bind:value={name}
          required
          placeholder="your name"
          autocomplete="off"
        />
      </label>

      <label class="field">
        <span class="field-label">EMAIL:</span>
        <input
          type="email"
          class="field-input"
          bind:value={email}
          required
          placeholder="you@example.com"
          autocomplete="off"
        />
      </label>

      <label class="field column">
        <span class="field-label">MESSAGE:</span>
        <textarea
          class="field-input"
          bind:value={message}
          required
          placeholder="what's on your mind?"
          rows="5"
        ></textarea>
      </label>

      <button type="submit" class="submit-btn" disabled={sending}>
        {sending ? 'SENDING...' : '> SEND MESSAGE'}
      </button>
    </form>

    <div class="or-divider">— or reach me directly —</div>

    <div class="direct-links">
      <a href="mailto:hello@retr0.dev">hello@retr0.dev</a>
    </div>
  {/if}
</div>

<style>
  .contact-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 340px;
  }

  .cmd-line {
    color: var(--color-accent);
    font-size: 13px;
    display: flex;
    gap: 6px;
  }

  .prompt {
    color: var(--color-accent2);
    font-weight: 700;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .field {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
  }

  .field.column {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .field-label {
    color: var(--color-dim);
    font-size: 11px;
    letter-spacing: 0.08em;
    min-width: 60px;
    flex-shrink: 0;
  }

  .field-input {
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    font-family: var(--font-mono);
    font-size: 12px;
    padding: 6px 8px;
    border-radius: var(--radius);
    flex: 1;
    width: 100%;
    outline: none;
    transition: border-color 0.12s;
    resize: vertical;
  }

  .field-input:focus {
    border-color: var(--color-accent);
  }

  .field-input::placeholder {
    color: var(--color-dim);
    opacity: 0.7;
  }

  .submit-btn {
    align-self: flex-start;
    background: none;
    border: 1px solid var(--color-accent2);
    color: var(--color-accent2);
    font-family: var(--font-mono);
    font-size: 12px;
    padding: 7px 14px;
    border-radius: var(--radius);
    cursor: pointer;
    font-weight: 700;
    letter-spacing: 0.06em;
    transition: background 0.12s, color 0.12s;
  }

  .submit-btn:hover:not(:disabled) {
    background: rgba(0, 255, 136, 0.1);
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .or-divider {
    text-align: center;
    color: var(--color-dim);
    font-size: 11px;
    letter-spacing: 0.06em;
  }

  .direct-links {
    display: flex;
    justify-content: center;
  }

  .direct-links a {
    color: var(--color-accent);
    font-size: 12px;
    text-decoration: none;
  }

  .direct-links a:hover {
    text-decoration: underline;
  }

  /* Sent state */
  .sent-msg {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    border: 1px solid var(--color-accent2);
    background: rgba(0, 255, 136, 0.05);
    border-radius: var(--radius);
  }

  .sent-icon {
    font-size: 24px;
    color: var(--color-accent2);
    font-weight: 700;
  }

  .sent-title {
    color: var(--color-accent2);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  .sent-sub {
    color: var(--color-dim);
    font-size: 12px;
    margin-top: 4px;
  }
</style>
