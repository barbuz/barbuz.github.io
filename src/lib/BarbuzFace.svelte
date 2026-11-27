<script lang="ts">
  import { Github } from 'lucide-svelte';
  import { setPersona } from '$lib/persona.svelte';
  import PersonaToggle from '$lib/PersonaToggle.svelte';
  import Wordmark from '$lib/Wordmark.svelte';

  type Card = {
    tag: string;
    name: string;
    href: string;
    repo: string;
    body: string;
  };

  const apps: Card[] = [
    {
      tag: 'real world maps',
      name: 'byom',
      href: 'https://barbuz.github.io/byom/',
      repo: 'https://github.com/barbuz/byom',
      body: 'Bring Your Own Map. Take a photo of any map, add some reference points, then see your live GPS position on it. Even with no signal.'
    },
    {
      tag: 'music pad',
      name: 'digitofono',
      href: 'https://barbuz.github.io/digitofono/',
      repo: 'https://github.com/barbuz/digitofono',
      body: 'A touchscreen instrument. Tap or drag anywhere on a near-blank surface and it sings.'
    },
    {
      tag: 'MTG daily game',
      name: 'match the gatherer',
      href: 'https://barbuz.github.io/match-the-gatherer/',
      repo: 'https://github.com/barbuz/match-the-gatherer',
      body: 'A Wordle-style daily guessing game for Magic: The Gathering cards, with worldwide stats.'
    }
  ];

  const tools: Card[] = [
    {
      tag: 'for 3CB gurus',
      name: 'the stylus',
      href: 'https://barbuz.github.io/the-stylus/',
      repo: 'https://github.com/barbuz/the-stylus',
      body: 'A browser tool for editing 3 Card Blind MTG result sheets. Small, specific, and sharp at its one job.'
    },
    {
      tag: 'per-site data use',
      name: 'data tracker',
      href: 'https://addons.mozilla.org/en-US/firefox/addon/data-tracker/',
      repo: 'https://github.com/barbuz/firefox-data-tracker',
      body: 'A Firefox extension that logs how much data each site downloads. Nothing leaves your machine. A dashboard sorts the totals by site and date.'
    }
  ];
</script>

{#snippet card(item: Card, i: number)}
  <article class="card reveal" style="animation-delay: {0.1 + i * 0.08}s">
    <span class="card__tag">{item.tag}</span>
    <h3>{item.name}</h3>
    <p>{item.body}</p>
    <div class="card__foot">
      <!-- The stretched link: its ::after covers the whole card, so a click
           anywhere but the GitHub button opens the app. -->
      <a class="card__go" href={item.href} aria-label="Open {item.name}">
        <span aria-hidden="true">open ↗</span>
      </a>
      <a
        class="card__repo"
        href={item.repo}
        target="_blank"
        rel="noopener"
        title="Source on GitHub"
        aria-label="Source for {item.name} on GitHub"
      >
        <Github size={15} strokeWidth={2} aria-hidden="true" />
      </a>
    </div>
  </article>
{/snippet}

<div class="wrap">
  <nav class="bar-nav">
    <PersonaToggle />
    <div class="bar-right">
      <div class="bar-links">
        <a href="#apps">Apps</a>
        <a href="#tools">Tools</a>
        <a href="#about-bar">About</a>
      </div>
      <div class="bar-mark"><Wordmark /></div>
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
      <span class="eyebrow">give them a try</span>
    </div>
    <div class="cards">
      {#each apps as app, i (app.name)}
        {@render card(app, i)}
      {/each}
    </div>
  </section>

  <section class="section" id="tools">
    <div class="section__head">
      <h2>Tools</h2>
      <span class="eyebrow">niche by design</span>
    </div>
    <div class="cards">
      {#each tools as tool, i (tool.name)}
        {@render card(tool, i)}
      {/each}
    </div>
  </section>

  <section class="section" id="about-bar">
    <div class="section__head">
      <h2>About</h2>
    </div>
    <div class="prose reveal" style="max-width: 58ch">
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
      <p>
        Everything here is free. No ads, no tracking, no accounts. If one of them earned it, you
        can <a href="https://donate.stripe.com/9B6eVd1madcF8Dt8yp1gs00" target="_blank" rel="noopener"
          >leave a tip ↗</a
        >.
      </p>
    </div>
  </section>

  <footer class="foot">
    <span>barbuz</span>
    <span><a href="https://github.com/barbuz" target="_blank" rel="noopener">github.com/barbuz</a></span>
    <span>© 2026</span>
  </footer>
</div>
