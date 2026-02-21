import { SITE_PASSWORD } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { password } = await request.json();
	if (password === SITE_PASSWORD) return json({ ok: true });
	return json({ ok: false }, { status: 401 });
}
