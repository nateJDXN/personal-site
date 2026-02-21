<script>
	/** @type {{ handleUnlock: (password: string) => Promise<boolean> }} */
	let { handleUnlock } = $props();

	let password = $state('');
	let loading = $state(false);
	let error = $state(false);
	let shaking = $state(false);

	async function submit() {
		if (!password || loading) return;
		loading = true;
		error = false;

		const ok = await handleUnlock(password);

		if (!ok) {
			error = true;
			password = '';
			shaking = true;
			setTimeout(() => (shaking = false), 500);
		}

		loading = false;
	}

	function onkeydown(e) {
		if (e.key === 'Enter') submit();
	}
</script>

<div class="gate">
	<div class="box window-shadow" class:shake={shaking}>
		<div class="header">
			<span class="dot red"></span>
			<span class="dot yellow"></span>
			<span class="dot green"></span>
			<span class="title">AUTHENTICATION REQUIRED</span>
		</div>

		<div class="body">
			<p class="prompt">
				<span class="caret">▶</span> ENTER ACCESS CODE:
			</p>

			<div class="input-row">
				<input
					type="password"
					bind:value={password}
					{onkeydown}
					placeholder="••••••••"
					autocomplete="off"
					spellcheck="false"
					disabled={loading}
					autofocus
				/>
				<button onclick={submit} disabled={loading || !password}>
					{loading ? '...' : 'OK'}
				</button>
			</div>

			{#if error}
				<p class="error-msg glow-text">✗ ACCESS DENIED</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.gate {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: var(--color-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
	}

	.box {
		width: min(420px, 90vw);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-surface);
		overflow: hidden;
	}

	/* title bar */
	.header {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		background: var(--color-surface-2);
		border-bottom: 1px solid var(--color-border);
		user-select: none;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.dot.red    { background: #ff5f57; }
	.dot.yellow { background: #febc2e; }
	.dot.green  { background: #28c840; }

	.title {
		margin-left: 6px;
		font-size: 11px;
		color: var(--color-dim);
		letter-spacing: 0.08em;
	}

	/* body */
	.body {
		padding: 24px 20px 20px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.prompt {
		font-size: 13px;
		color: var(--color-accent);
		letter-spacing: 0.05em;
	}

	.caret {
		color: var(--color-accent2);
		margin-right: 4px;
	}

	.input-row {
		display: flex;
		gap: 8px;
	}

	input {
		flex: 1;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		color: var(--color-text);
		font-family: var(--font-mono);
		font-size: 14px;
		padding: 8px 10px;
		outline: none;
		letter-spacing: 0.1em;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	input:focus {
		border-color: var(--color-accent);
		box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.15);
	}

	input:disabled {
		opacity: 0.5;
	}

	button {
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		color: var(--color-accent);
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.08em;
		padding: 8px 14px;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
	}

	button:hover:not(:disabled) {
		background: var(--color-accent);
		color: var(--color-bg);
		border-color: var(--color-accent);
	}

	button:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.error-msg {
		font-size: 12px;
		color: var(--color-error);
		letter-spacing: 0.1em;
	}

	/* shake animation on wrong password */
	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		20%       { transform: translateX(-8px); }
		40%       { transform: translateX(8px); }
		60%       { transform: translateX(-5px); }
		80%       { transform: translateX(5px); }
	}

	.shake {
		animation: shake 0.5s ease;
	}
</style>
