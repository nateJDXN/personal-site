// Song of the day: minimal controls for a hidden Spotify embed.
// Uses the Spotify iFrame API (play/pause/seek/loadUri; it has no volume control).
// Track + position are kept in sessionStorage so returning to the home page resumes.
(function () {
  var cfg = window.SOTD;
  if (!cfg || !cfg.tracks || !cfg.tracks.length) return;
  // Desktop only: don't load anything from Spotify on small screens
  if (window.matchMedia('(max-width: 768px)').matches) return;

  var KEY = 'sotd';
  var tracks = cfg.tracks;
  var $ = function (id) { return document.getElementById(id); };
  var root = $('sotd'), link = $('sotd-track'), toggle = $('sotd-toggle');
  var seek = $('sotd-seek'), time = $('sotd-time');

  var saved = load();
  var index = saved.index < tracks.length ? saved.index : 0;
  var position = saved.position || 0;   // ms
  var duration = saved.duration || 0;   // ms
  var pendingSeek = position;           // applied once playback actually starts
  var started = false;                  // has the current track begun playing in the embed?
  var paused = true;
  var playOnLoad = false;
  var dragging = false;
  var controller = null;

  function load() {
    try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }

  function save() {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ index: index, position: position, duration: duration }));
    } catch (e) {}
  }

  function uri(i) { return 'spotify:track:' + tracks[i].id; }

  function fmt(ms) {
    var s = Math.floor(ms / 1000);
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  function renderTrack() {
    var t = tracks[index];
    var label = t.title + ' — ' + t.artist;
    link.textContent = label;
    link.title = label;
    link.href = cfg.playlist
      ? 'https://open.spotify.com/playlist/' + cfg.playlist + '?highlight=' + uri(index)
      : 'https://open.spotify.com/track/' + t.id;
  }

  function renderState() {
    root.classList.toggle('is-playing', !paused);
    toggle.setAttribute('aria-label', paused ? 'play' : 'pause');
    seek.max = duration;
    if (!dragging) seek.value = position;
    time.textContent = fmt(dragging ? seek.value : position);
  }

  function go(delta, autoplay) {
    index = (index + delta + tracks.length) % tracks.length;
    position = duration = pendingSeek = 0;
    started = false;
    playOnLoad = autoplay;
    renderTrack();
    renderState();
    save();
    if (controller) controller.loadUri(uri(index));
  }

  function onUpdate(e) {
    var d = e.data;
    var ended = !paused && d.isPaused && duration > 0 && position >= duration - 1500;

    if (!d.isPaused && !started) {
      started = true;
      if (pendingSeek) { controller.seek(pendingSeek / 1000); pendingSeek = 0; }
    }
    if (ended) return go(1, true);

    paused = d.isPaused;
    duration = d.duration || duration;
    if (started) position = d.position;
    renderState();
    save();
  }

  toggle.addEventListener('click', function () {
    if (!controller) return;
    started ? controller.togglePlay() : controller.play();
    paused = !paused;
    renderState();
  });
  $('sotd-prev').addEventListener('click', function () { go(-1, !paused); });
  $('sotd-next').addEventListener('click', function () { go(1, !paused); });

  seek.addEventListener('input', function () { dragging = true; renderState(); });
  seek.addEventListener('change', function () {
    dragging = false;
    position = +seek.value;
    if (started && controller) controller.seek(position / 1000);
    else pendingSeek = position;
    renderState();
    save();
  });

  window.addEventListener('pagehide', save);

  window.onSpotifyIframeApiReady = function (IFrameAPI) {
    IFrameAPI.createController($('sotd-embed'), { uri: uri(index), width: 300, height: 80 }, function (c) {
      controller = c;
      c.addListener('playback_update', onUpdate);
      c.addListener('ready', function () {
        if (playOnLoad) { playOnLoad = false; c.play(); }
      });
    });
  };

  renderTrack();
  renderState();
  root.hidden = false;

  var api = document.createElement('script');
  api.src = 'https://open.spotify.com/embed/iframe-api/v1';
  api.async = true;
  document.body.appendChild(api);
})();
