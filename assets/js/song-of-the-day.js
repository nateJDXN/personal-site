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
  var embedReady = false;               // commands sent before the embed's 'ready' are dropped
  var lastLogged = '';

  function log() {
    console.log.apply(console, ['[sotd]'].concat([].slice.call(arguments)));
  }

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
    log('loadUri', uri(index), '(track ' + (index + 1) + '/' + tracks.length + ', autoplay: ' + autoplay + ')');
    if (controller) { embedReady = false; controller.loadUri(uri(index)); }
    else console.warn('[sotd] no controller yet; track change only applied to the UI');
  }

  function onUpdate(e) {
    var d = e.data;
    // playback_update fires several times a second, so only log state changes
    var summary = 'paused=' + d.isPaused + ' buffering=' + d.isBuffering + ' duration=' + d.duration;
    if (summary !== lastLogged) { log('playback_update', summary, 'position=' + d.position); lastLogged = summary; }

    // A track has ended when the embed stops on its own (a user pause flips `paused`
    // before the embed reports it) near the end, or after jumping back to 0.
    // Updates are irregular, so allow a generous window.
    var dur = d.duration || duration;
    var nearEnd = function (ms) { return dur > 0 && ms >= dur - 3000; };
    var stoppedOnItsOwn = !paused && d.isPaused && started;
    var ended = (stoppedOnItsOwn && (nearEnd(d.position) || nearEnd(position) || (d.position === 0 && position > 0))) ||
                (!d.isPaused && dur > 0 && d.position >= dur);
    if (stoppedOnItsOwn) log('embed stopped on its own: position=' + d.position, 'last=' + position, 'duration=' + dur, ended ? '→ ended' : '→ not treated as end');

    if (!d.isPaused && !started) {
      started = true;
      log('playback started');
      if (pendingSeek) { log('resuming at', fmt(pendingSeek)); controller.seek(pendingSeek / 1000); pendingSeek = 0; }
    }
    if (ended) { log('track ended, advancing'); return go(1, true); }

    paused = d.isPaused;
    duration = d.duration || duration;
    if (started) position = d.position;
    renderState();
    save();
  }

  toggle.addEventListener('click', function () {
    if (!controller) { console.warn('[sotd] play clicked but the Spotify controller was never created'); return; }
    paused = !paused;
    if (!embedReady) {
      playOnLoad = !paused;
      log('toggle clicked before embed ready;', playOnLoad ? 'will play once ready' : 'cancelled queued play');
    } else {
      log('toggle clicked:', started ? 'togglePlay()' : 'play()', '(UI paused=' + !paused + ')');
      started ? controller.togglePlay() : controller.play();
    }
    renderState();
  });
  $('sotd-prev').addEventListener('click', function () { go(-1, !paused); });
  $('sotd-next').addEventListener('click', function () { go(1, !paused); });

  seek.addEventListener('input', function () { dragging = true; renderState(); });
  seek.addEventListener('change', function () {
    dragging = false;
    position = +seek.value;
    log('seek to', fmt(position), started ? '' : '(deferred until playback starts)');
    if (started && controller) controller.seek(position / 1000);
    else pendingSeek = position;
    renderState();
    save();
  });

  window.addEventListener('pagehide', save);

  window.onSpotifyIframeApiReady = function (IFrameAPI) {
    log('iframe API ready, creating controller for', uri(index));
    IFrameAPI.createController($('sotd-embed'), { uri: uri(index), width: 300, height: 80 }, function (c) {
      controller = c;
      var frame = document.querySelector('.sotd-embed iframe');
      log('controller created; iframe:', frame ? { src: frame.src, allow: frame.allow, rect: frame.getBoundingClientRect() } : 'not found');
      c.addListener('playback_update', onUpdate);
      c.addListener('playback_started', function (e) { log('playback_started event', e.data); });
      c.addListener('ready', function () {
        embedReady = true;
        log('embed ready', playOnLoad ? '(autoplaying)' : '');
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
  api.onload = function () { log('iframe API script loaded'); };

  // Debug: log each kind of message the Spotify embed sends (once per type)
  var seenTypes = {};
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://open.spotify.com') return;
    var type = (e.data && e.data.type) || typeof e.data;
    if (!seenTypes[type]) { seenTypes[type] = true; log('message from embed:', type, e.data); }
  });
  api.onerror = function () { console.error('[sotd] failed to load the Spotify iframe API script (blocked by an ad/tracker blocker?)'); };
  log('init: track ' + (index + 1) + '/' + tracks.length, 'saved position', fmt(position));
  document.body.appendChild(api);
})();
