<script>
  // About window content
</script>

<div class="about-content">
  <div class="section-header">
    <span class="prompt">&gt;</span> whoami
  </div>

  <div class="output">
    <p>
      Hi — I'm <span class="accent">retr0</span>, a software engineer who loves building things at
      the intersection of systems, UX, and creative code.
    </p>
    <p>
      I spend most of my time in the terminal, occasionally
      surfacing to push code, write blog posts, or obsess over
      font rendering.
    </p>
  </div>

  <div class="section-header">
    <span class="prompt">&gt;</span> skills --list
  </div>

  <div class="output skill-grid">
    <div class="skill-col">
      <div class="skill-cat">Languages</div>
      <ul>
        <li>TypeScript / JavaScript</li>
        <li>Python</li>
        <li>Rust</li>
        <li>Go</li>
      </ul>
    </div>
    <div class="skill-col">
      <div class="skill-cat">Frontend</div>
      <ul>
        <li>Svelte / SvelteKit</li>
        <li>React</li>
        <li>Tailwind CSS</li>
        <li>GSAP</li>
      </ul>
    </div>
    <div class="skill-col">
      <div class="skill-cat">Backend</div>
      <ul>
        <li>Node.js</li>
        <li>PocketBase</li>
        <li>PostgreSQL</li>
        <li>Docker</li>
      </ul>
    </div>
  </div>

  <div class="section-header">
    <span class="prompt">&gt;</span> cat links.txt
  </div>

  <div class="output links">
    <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
    <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume ↗</a>
  </div>
</div>

<style>
  .about-content {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 4px 0;
    min-width: 420px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--color-accent);
    font-size: 13px;
    font-weight: 500;
  }

  .prompt {
    color: var(--color-accent2);
    font-weight: 700;
  }

  .output {
    padding-left: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: var(--color-text);
    font-size: 12px;
    line-height: 1.6;
  }

  .accent {
    color: var(--color-accent);
    font-weight: 700;
  }

  .skill-grid {
    flex-direction: row;
    gap: 24px;
  }

  .skill-col {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .skill-cat {
    color: var(--color-dim);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 4px;
    margin-bottom: 2px;
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  li::before {
    content: '- ';
    color: var(--color-dim);
  }

  .links {
    flex-direction: row;
    gap: 16px;
  }

  .links a {
    color: var(--color-accent);
    text-decoration: none;
    font-size: 12px;
    transition: color 0.12s;
  }

  .links a:hover {
    color: var(--color-accent2);
    text-decoration: underline;
  }
</style>
