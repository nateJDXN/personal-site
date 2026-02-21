<script>
  const projects = [
    {
      name: 'personal-site',
      desc: 'This site — a retro desktop OS experience built with SvelteKit.',
      tags: ['svelte', 'gsap', 'pocketbase'],
      url: 'https://github.com',
      status: 'active',
    },
    {
      name: 'termkit',
      desc: 'A lightweight terminal UI toolkit for Node.js applications.',
      tags: ['typescript', 'node', 'cli'],
      url: 'https://github.com',
      status: 'active',
    },
    {
      name: 'pixeldb',
      desc: 'Tiny embedded key-value store with a pixel-perfect data model.',
      tags: ['rust', 'database', 'embedded'],
      url: 'https://github.com',
      status: 'wip',
    },
    {
      name: 'shader-toys',
      desc: 'Collection of WebGL shader experiments and generative art.',
      tags: ['webgl', 'glsl', 'art'],
      url: 'https://github.com',
      status: 'archived',
    },
  ];

  const statusColor = {
    active: 'var(--color-accent2)',
    wip: 'var(--color-warn)',
    archived: 'var(--color-dim)',
  };
</script>

<div class="projects-content">
  <div class="cmd-line">
    <span class="prompt">&gt;</span> ls -la ~/projects/
  </div>

  <div class="project-list">
    {#each projects as proj}
      <a class="project-item" href={proj.url} target="_blank" rel="noopener noreferrer">
        <div class="project-top">
          <span class="proj-name">{proj.name}/</span>
          <span class="proj-status" style="color: {statusColor[proj.status]}">
            [{proj.status}]
          </span>
        </div>
        <div class="proj-desc">{proj.desc}</div>
        <div class="proj-tags">
          {#each proj.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  .projects-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 380px;
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

  .project-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .project-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px 12px;
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    text-decoration: none;
    transition: border-color 0.12s, background 0.12s;
    cursor: pointer;
  }

  .project-item:hover {
    border-color: var(--color-accent);
    background: rgba(0, 212, 255, 0.04);
  }

  .project-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  .proj-name {
    color: var(--color-accent);
    font-size: 13px;
    font-weight: 700;
  }

  .proj-status {
    font-size: 10px;
    letter-spacing: 0.06em;
    flex-shrink: 0;
  }

  .proj-desc {
    color: var(--color-text);
    font-size: 12px;
    line-height: 1.5;
  }

  .proj-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .tag {
    font-size: 10px;
    color: var(--color-dim);
    border: 1px solid var(--color-border);
    padding: 1px 6px;
    border-radius: 1px;
    letter-spacing: 0.04em;
  }
</style>
