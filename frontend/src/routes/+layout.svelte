<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { PUBLIC_PASSWORD_MODE } from '$env/static/public';
	import BootScreen from '$lib/components/BootScreen.svelte';
	import PasswordGate from '$lib/components/PasswordGate.svelte';
	import { initAuth } from '$lib/stores/auth.svelte.js';

	let { children } = $props();

	let booting = $state(false);
	let unlocked = $state(false);

	onMount(() => {
		initAuth();

		if (browser) {
			// Boot screen: session-based (plays once per browser session)
			const hasBooted = sessionStorage.getItem('hasBooted');
			if (!hasBooted) booting = true;

			// Password: in session mode, check if already unlocked this session
			if (PUBLIC_PASSWORD_MODE === 'session') {
				unlocked = sessionStorage.getItem('site_unlocked') === 'true';
			}
		}
	});

	function onBootComplete() {
		if (browser) {
			sessionStorage.setItem('hasBooted', 'true');
		}
		booting = false;
	}

	async function handleUnlock(password) {
		const res = await fetch('/api/auth/verify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ password })
		});

		if (res.ok) {
			if (browser && PUBLIC_PASSWORD_MODE === 'session') {
				sessionStorage.setItem('site_unlocked', 'true');
			}
			unlocked = true;
			return true;
		}

		return false;
	}
</script>

<!-- CRT scanline overlay (always on top) -->
<div class="scanlines crt-flicker" aria-hidden="true"></div>

{#if booting}
	<BootScreen onComplete={onBootComplete} />
{:else if !unlocked}
	<PasswordGate {handleUnlock} />
{:else}
	{@render children()}
{/if}
