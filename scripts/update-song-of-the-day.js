// Rewrites _data/song_of_the_day.yml with the 5 most recently added tracks
// from the playlist named in that file. Run by .github/workflows/song-of-the-day.yml.
//
// Since Spotify's Feb 2026 API changes, playlist contents are only returned to the
// playlist's owner/collaborators, so this uses the owner's refresh token
// (see scripts/spotify-auth.js) rather than client credentials.
const fs = require('fs');
const path = require('path');

const COUNT = 5;
const DATA = path.join(__dirname, '..', '_data', 'song_of_the_day.yml');
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

async function accessToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN }),
  });
  const body = await res.json();
  if (!body.access_token) throw new Error('Token refresh failed: ' + JSON.stringify(body));
  if (body.refresh_token && body.refresh_token !== SPOTIFY_REFRESH_TOKEN) {
    console.warn('::warning::Spotify issued a new refresh token; update the SPOTIFY_REFRESH_TOKEN secret if runs start failing.');
  }
  return body.access_token;
}

async function playlistItems(playlist, token) {
  const items = [];
  let url = 'https://api.spotify.com/v1/playlists/' + playlist + '/items?' + new URLSearchParams({
    limit: '50',
    fields: 'next,items(added_at,item(id,name,type,artists(name)))',
  });
  while (url) {
    const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
    if (!res.ok) throw new Error('Playlist request failed (' + res.status + '): ' + await res.text());
    const page = await res.json();
    if (!page.items) throw new Error('No items returned. Is this playlist owned by (or collaborative with) the authorized account?');
    items.push(...page.items);
    url = page.next;
  }
  return items;
}

async function main() {
  const current = fs.readFileSync(DATA, 'utf8');
  const match = current.match(/^playlist:\s*"?([A-Za-z0-9]+)"?\s*$/m);
  if (!match) throw new Error('No playlist ID set in ' + DATA);
  const playlist = match[1];

  const items = await playlistItems(playlist, await accessToken());
  const tracks = items
    .filter((i) => i.item && i.item.type === 'track' && i.item.id) // skip episodes and local files
    .sort((a, b) => new Date(b.added_at) - new Date(a.added_at))
    .slice(0, COUNT)
    .map((i) => ({
      id: i.item.id,
      title: i.item.name,
      artist: i.item.artists.map((a) => a.name).join(', '),
    }));
  if (!tracks.length) throw new Error('Playlist has no playable tracks');

  // JSON strings are valid YAML scalars, so this quotes titles safely
  const yaml = [
    '# Song of the day player (home page only).',
    '# playlist: the Spotify playlist ID (from open.spotify.com/playlist/<id>)',
    '# tracks: newest first. Updated daily by .github/workflows/song-of-the-day.yml',
    'playlist: ' + JSON.stringify(playlist),
    'tracks:',
    ...tracks.flatMap((t) => [
      '  - id: ' + JSON.stringify(t.id),
      '    title: ' + JSON.stringify(t.title),
      '    artist: ' + JSON.stringify(t.artist),
    ]),
    '',
  ].join('\n');

  fs.writeFileSync(DATA, yaml);
  console.log(tracks.map((t, i) => (i + 1) + '. ' + t.title + ' — ' + t.artist).join('\n'));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
