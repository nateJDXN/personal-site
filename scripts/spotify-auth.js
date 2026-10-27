// One-time helper: sign in to Spotify and print a refresh token for the
// update-song-of-the-day GitHub Action.
//
// Usage:
//   SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/spotify-auth.js
//
// The Spotify app must list this exact Redirect URI: http://127.0.0.1:8888/callback
const http = require('http');
const crypto = require('crypto');

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.');
  process.exit(1);
}

const REDIRECT = 'http://127.0.0.1:8888/callback';
const state = crypto.randomBytes(16).toString('hex');
const authUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
  client_id: id,
  response_type: 'code',
  redirect_uri: REDIRECT,
  scope: 'playlist-read-private playlist-read-collaborative',
  state,
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== '/callback') return res.writeHead(404).end();

  if (url.searchParams.get('state') !== state || !url.searchParams.get('code')) {
    res.end('Authorization failed. Check the terminal.');
    console.error('Authorization failed:', url.searchParams.get('error') || 'state mismatch');
    return server.close();
  }

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(id + ':' + secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: url.searchParams.get('code'),
      redirect_uri: REDIRECT,
    }),
  });
  const body = await tokenRes.json();

  if (!body.refresh_token) {
    res.end('Token exchange failed. Check the terminal.');
    console.error('Token exchange failed:', body);
  } else {
    res.end('Done! You can close this tab and go back to the terminal.');
    console.log('\nAdd this as the SPOTIFY_REFRESH_TOKEN repo secret:\n\n' + body.refresh_token + '\n');
  }
  server.close();
});

server.listen(8888, '127.0.0.1', () => {
  console.log('Open this URL in your browser and approve access:\n\n' + authUrl + '\n');
});
