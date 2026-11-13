<script lang="ts">
  import { setPersona } from '$lib/persona.svelte';

  const apps = [
    {
      tag: 'PWA · offline',
      name: 'byom',
      href: 'https://barbuz.github.io/byom/',
      body: 'Bring Your Own Map — georeference a photo or PDF of any map, then see your GPS position on it, even with no signal.'
    },
    {
      tag: 'Web Audio',
      name: 'digitofono',
      href: 'https://barbuz.github.io/digitofono/',
      body: 'A streamlined touchscreen instrument. Tap or drag anywhere on a near-blank surface and it sings.'
    },
    {
      tag: 'daily game',
      name: 'match the gatherer',
      href: 'https://barbuz.github.io/match-the-gatherer/',
      body: 'A Wordle-style daily guessing game for Magic: The Gathering cards, with worldwide stats.'
    }
  ];
</script>

<div class="wrap">
  <nav class="bar-nav">
    <div class="bar-mark">barbu<span>z</span></div>
    <div class="bar-links">
      <a href="#apps">Apps</a>
      <a href="#tools">Tools</a>
      <a href="#about-bar">About</a>
    </div>
  </nav>

  <header class="bar-hero">
    <div class="eyebrow reveal" style="animation-delay: 0.05s">// maker · small sharp tools</div>
    <h1 class="reveal" style="animation-delay: 0.12s">barbuz</h1>
    <p class="reveal" style="animation-delay: 0.2s">
      I build small, sharp tools that do one thing well. Mostly for the web, mostly offline-first,
      always made to be picked up in one hand.
    </p>
    <div class="bar-cta reveal" style="animation-delay: 0.28s">
      <a class="btn btn--solid" href="#apps">See the apps</a>
      <a class="btn" href="https://github.com/barbuz" target="_blank" rel="noopener">GitHub ↗</a>
    </div>
  </header>

  <section class="section" id="apps">
    <div class="section__head">
      <h2>Apps</h2>
      <span class="eyebrow">03</span>
    </div>
    <div class="cards">
      {#each apps as app, i (app.name)}
        <a class="card reveal" style="animation-delay: {0.1 + i * 0.08}s" href={app.href}>
          <span class="card__tag">{app.tag}</span>
          <h3>{app.name}</h3>
          <p>{app.body}</p>
          <span class="card__go">open ↗</span>
        </a>
      {/each}
    </div>
  </section>

  <section class="section" id="tools">
    <div class="section__head">
      <h2>Tools</h2>
      <span class="eyebrow">niche by design</span>
    </div>
    <div class="cards">
      <a class="card reveal" href="https://barbuz.github.io/the-stylus/">
        <span class="card__tag">for 3CB gurus</span>
        <h3>the stylus</h3>
        <p>
          A browser tool for gurus who edit 3 Card Blind MTG result sheets. Small, specific, and
          sharp at its one job.
        </p>
        <span class="card__go">open ↗</span>
      </a>
    </div>
  </section>

  <section class="section" id="about-bar">
    <div class="section__head">
      <h2>About</h2>
    </div>
    <div class="prose" style="max-width: 58ch">
      <p>
        barbuz is where I put the things I build for the love of building them — offline-first web
        apps, a musical instrument, a daily game. Same person behind
        <a
          href="?leo"
          onclick={(e) => {
            e.preventDefault();
            setPersona('leo');
          }}>the engineering side</a
        >, different hat.
      </p>
    </div>
  </section>

  <footer class="foot">
    <span>barbuz · built in the open</span>
    <span><a href="https://github.com/barbuz" target="_blank" rel="noopener">github.com/barbuz</a></span>
    <span>© 2026</span>
  </footer>
</div>
